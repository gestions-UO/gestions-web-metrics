import { Router } from 'express';
import { redisClient } from '../redis';

export const trackingRouter = Router();

const TRACKER_SCRIPT = `
(function() {
  const d = document;
  const script = d.currentScript;
  const domain = script.getAttribute('data-domain');
  if (!domain) return console.error('GestionsSEO: data-domain attribute missing from script.');

  const sendPing = async () => {
    try {
      const payload = {
        domain,
        url: window.location.href,
        referrer: d.referrer || null,
        userAgent: navigator.userAgent,
        screenWidth: window.innerWidth,
      };

      await fetch('http://localhost:3002/api/v1/tracking/collect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        mode: 'cors'
      });
    } catch (e) {
      console.error('GestionsSEO Tracking Error', e);
    }
  };

  // Ping on load
  if (d.readyState === 'complete') {
    sendPing();
  } else {
    window.addEventListener('load', sendPing);
  }
})();
`;

trackingRouter.get('/track.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  // Avoid caching so the script is fresh, or set a long cache in prod
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.send(TRACKER_SCRIPT);
});

trackingRouter.post('/collect', async (req, res) => {
  try {
    const { domain, url, referrer, userAgent, screenWidth } = req.body;
    
    // Express gets IP (may need trust proxy if behind NGINX)
    let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    if (Array.isArray(ip)) ip = ip[0];

    // Check Redis Cache for IP Location
    let locationData = { country: 'Unknown', city: 'Unknown' };
    const cacheKey = `ip_loc:${ip}`;

    const cachedLoc = await redisClient.get(cacheKey);
    if (cachedLoc) {
      locationData = JSON.parse(cachedLoc);
    } else if (ip !== '127.0.0.1' && ip !== '::1') {
      // Call external API if not cached and not local
      try {
        const response = await fetch(`http://ip-api.com/json/${ip}`);
        const data = await response.json();
        
        if (data.status === 'success') {
          locationData = {
            country: data.country,
            city: data.city,
            countryCode: data.countryCode
          };
          // Cache in Redis for 30 days (2592000 seconds)
          await redisClient.setEx(cacheKey, 2592000, JSON.stringify(locationData));
        }
      } catch (e) {
        console.error('IP Geolocation failed:', e);
      }
    }

    // Use Redis for analytics tracking
    const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    
    // Increment total pageviews
    await redisClient.incr(`project:${domain}:pageviews:total`);
    // Increment daily pageviews
    await redisClient.incr(`project:${domain}:pageviews:${date}`);
    
    // Track unique visitors using HyperLogLog
    await redisClient.pfAdd(`project:${domain}:visitors:total`, ip);
    await redisClient.pfAdd(`project:${domain}:visitors:${date}`, ip);

    // Track URLs
    await redisClient.zIncrBy(`project:${domain}:top_urls`, 1, url);

    // Track Countries
    if (locationData.countryCode) {
      await redisClient.zIncrBy(`project:${domain}:countries`, 1, locationData.countryCode);
    }

    console.log(`[TRACKING SAVED] Domain: ${domain} | URL: ${url} | IP: ${ip} | Location: ${locationData.country}`);

    res.json({ success: true, logged: true });
  } catch (error) {
    console.error('Tracking Error:', error);
    res.status(500).json({ success: false, error: 'Failed to process tracking data' });
  }
});

trackingRouter.get('/analytics', async (req, res) => {
  try {
    let domain = req.query.domain as string;
    if (!domain) {
      domain = await redisClient.get('admin:target_domain') || '';
    }
    if (!domain) return res.status(400).json({ error: 'Domain is required' });

    const totalPageviews = await redisClient.get(`project:${domain}:pageviews:total`) || '0';
    const totalVisitors = await redisClient.pfCount(`project:${domain}:visitors:total`);

    // Get chart data for the last 7 days
    const chartData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const pvs = await redisClient.get(`project:${domain}:pageviews:${dateStr}`) || '0';
      const visitors = await redisClient.pfCount(`project:${domain}:visitors:${dateStr}`);
      
      chartData.push({
        name: d.toLocaleDateString('en-US', { weekday: 'short' }),
        pageviews: parseInt(pvs, 10),
        visitors: visitors
      });
    }

    // Get Top Countries
    const topCountriesRaw = await redisClient.zRangeWithScores(`project:${domain}:countries`, 0, -1, { REV: true });
    const topCountries = topCountriesRaw.map(c => ({
      countryCode: c.value,
      pageviews: c.score
    }));

    res.json({
      success: true,
      data: {
        totalPageviews: parseInt(totalPageviews, 10),
        totalVisitors: totalVisitors,
        chartData,
        topCountries
      }
    });
  } catch (error) {
    console.error('Analytics Fetch Error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch analytics' });
  }
});

trackingRouter.delete('/project', async (req, res) => {
  try {
    let domain = req.query.domain as string;
    if (!domain) {
      domain = await redisClient.get('admin:target_domain') || '';
    }
    if (!domain) return res.status(400).json({ error: 'Domain is required' });

    // Find all keys for this project
    const keys = await redisClient.keys(`project:${domain}:*`);
    if (keys.length > 0) {
      await redisClient.del(keys);
    }

    res.json({ success: true, message: 'Project data reset successfully' });
  } catch (error) {
    console.error('Project Delete Error:', error);
    res.status(500).json({ success: false, error: 'Failed to reset project' });
  }
});

trackingRouter.get('/settings', async (req, res) => {
  try {
    const targetDomain = await redisClient.get('admin:target_domain') || '';
    res.json({ success: true, data: { targetDomain } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch settings' });
  }
});

trackingRouter.post('/settings', async (req, res) => {
  try {
    const { targetDomain } = req.body;
    if (targetDomain) {
      await redisClient.set('admin:target_domain', targetDomain);
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to save settings' });
  }
});

trackingRouter.get('/report-settings', async (req, res) => {
  try {
    const settingsStr = await redisClient.get('admin:report_settings');
    const settings = settingsStr ? JSON.parse(settingsStr) : {
      enabled: false,
      email: '',
      time: '08:00',
      frequency: 'daily',
      day: 'Monday'
    };
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch report settings' });
  }
});

trackingRouter.post('/report-settings', async (req, res) => {
  try {
    const { enabled, email, time, frequency, day } = req.body;
    const settings = { enabled, email, time, frequency, day };
    await redisClient.set('admin:report_settings', JSON.stringify(settings));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to save report settings' });
  }
});
