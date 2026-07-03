import { Router } from 'express';
import { redisClient } from '../redis';

const router = Router();

// Helper to generate a deterministic pseudo-random number based on a string seed
function stringToSeed(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

function seededRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

// Generate realistic deterministic data for a domain
function generateDomainData(domain: string) {
  const seed = stringToSeed(domain);
  const dr = Math.floor(seededRandom(seed) * 100);
  const trafficBase = seededRandom(seed + 1) * 5000000;
  const backlinks = Math.floor(seededRandom(seed + 2) * 15000000);
  const refDomains = Math.floor(backlinks / (10 + seededRandom(seed + 3) * 50));

  // Generate 6 months of history chart data
  const chartData = [];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
  let currentTraffic = trafficBase * 0.5; // Start at 50% 6 months ago

  for (let i = 0; i < 7; i++) {
    const volatility = (seededRandom(seed + 10 + i) - 0.3) * 0.4; // between -12% and +28% month over month
    currentTraffic = Math.max(0, currentTraffic * (1 + volatility));
    
    chartData.push({
      name: months[i],
      organic: Math.floor(currentTraffic),
      paid: Math.floor(currentTraffic * seededRandom(seed + 20 + i) * 0.2)
    });
  }

  // Set the final traffic to the last month
  const organicTraffic = chartData[6].organic;

  return {
    domain,
    domainRating: dr,
    backlinks,
    refDomains,
    organicTraffic,
    chartData
  };
}

// Generate realistic deterministic data for a keyword
function generateKeywordData(keyword: string) {
  const seed = stringToSeed(keyword);
  const volume = Math.floor(seededRandom(seed) * 200000);
  const globalVolume = Math.floor(volume * (1 + seededRandom(seed + 1) * 3));
  const kd = Math.floor(seededRandom(seed + 2) * 100);
  const cpc = seededRandom(seed + 3) * 30;
  const trafficPotential = Math.floor(volume * 0.4);
  const backlinksReq = Math.floor(kd * 2.5 * seededRandom(seed + 4));
  
  const intents = ['Informational', 'Navigational', 'Commercial', 'Transactional'];
  const intent = intents[Math.floor(seededRandom(seed + 5) * intents.length)];

  const modifiers = ['best', 'cheap', 'how to', 'what is', 'alternative', 'services'];
  
  const keywordIdeas = [];
  for (let i = 0; i < 15; i++) {
    const rSeed = seed + 10 + i;
    const mod = modifiers[Math.floor(seededRandom(rSeed) * modifiers.length)];
    const ideaVolume = Math.floor(seededRandom(rSeed + 1) * volume * 0.8);
    const ideaKd = Math.floor(seededRandom(rSeed + 2) * 100);
    const ideaCpc = seededRandom(rSeed + 3) * 25;
    
    keywordIdeas.push({
      term: `${mod} ${keyword} ${Math.floor(seededRandom(rSeed + 4)*1000)}`.replace(/[0-9]+/g, '').trim(),
      intent: intents[Math.floor(seededRandom(rSeed + 5) * intents.length)],
      volume: ideaVolume,
      kd: ideaKd,
      cpc: ideaCpc,
      clicks: Math.floor(ideaVolume * seededRandom(rSeed + 6) * 0.7)
    });
  }

  // Sort ideas by volume descending
  keywordIdeas.sort((a, b) => b.volume - a.volume);

  return {
    keyword,
    difficulty: kd,
    volume,
    globalVolume,
    trafficPotential,
    cpc,
    backlinksReq,
    intent,
    ideas: keywordIdeas.slice(0, 10) // Return top 10 ideas
  };
}

// GET /api/v1/seo/explore?domain=xyz.com
router.get('/explore', (req, res) => {
  const domain = req.query.domain as string;
  if (!domain) {
    return res.status(400).json({ error: 'Domain parameter is required' });
  }

  // Simulating an external API delay of ~1 second
  setTimeout(() => {
    const data = generateDomainData(domain.toLowerCase());
    res.json({ success: true, data });
  }, 1000);
});

// GET /api/v1/seo/keywords?query=keyword
router.get('/keywords', (req, res) => {
  const query = req.query.query as string;
  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  // Simulating an external API delay
  setTimeout(() => {
    const data = generateKeywordData(query.toLowerCase());
    res.json({ success: true, data });
  }, 1000);
});

// Generate deterministic rankings
function generateRankings(projectDomain: string) {
  const seed = stringToSeed(projectDomain);
  const keywords = ['best seo software', 'rank tracker tool', 'how to do seo', 'free site audit', 'keyword research'];
  return keywords.map((kw, i) => {
    const kSeed = seed + i;
    const currentRank = Math.max(1, Math.floor(seededRandom(kSeed) * 50));
    const previousRank = Math.max(1, currentRank + Math.floor((seededRandom(kSeed + 1) - 0.5) * 10));
    const volume = Math.floor(seededRandom(kSeed + 2) * 50000);
    const difficulty = Math.floor(seededRandom(kSeed + 3) * 100);
    
    const history = [];
    let rank = previousRank;
    for(let j=0; j<5; j++) {
      history.push({val: rank});
      rank = Math.max(1, rank + Math.floor((seededRandom(kSeed + 10 + j) - 0.5) * 5));
    }
    history.push({val: currentRank});
    
    return { keyword: kw, url: `/${kw.split(' ').join('-')}`, currentRank, previousRank, volume, difficulty, history };
  });
}

// GET /api/v1/seo/rankings
router.get('/rankings', (req, res) => {
  const domain = req.query.domain as string || 'default.com';
  setTimeout(() => {
    const data = generateRankings(domain);
    res.json({ success: true, data });
  }, 500);
});

router.post('/audit', async (req, res) => {
  let domain = req.body.domain as string;
  if (!domain) {
    domain = await redisClient.get('admin:target_domain') || '';
  }
  if (!domain) return res.status(400).json({ error: 'Domain is required' });

  try {
    const targetUrl = domain.startsWith('http') ? domain : `https://${domain}`;
    
    // Set a timeout of 5 seconds for the fetch
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(targetUrl, { signal: controller.signal });
    clearTimeout(timeoutId);

    const html = await response.text();
    
    const issues = [];
    let errors = 0;
    let warnings = 0;
    let notices = 0;

    // 1. Check Title
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    if (!titleMatch) {
      issues.push({ title: 'Missing Title Tag', type: 'Error', count: 1, group: 'On-Page' });
      errors++;
    } else if (titleMatch[1].length < 10 || titleMatch[1].length > 60) {
      issues.push({ title: 'Title length is not optimal', type: 'Warning', count: 1, group: 'On-Page' });
      warnings++;
    }

    // 2. Check Meta Description
    const metaDescMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i);
    if (!metaDescMatch) {
      issues.push({ title: 'Missing Meta Description', type: 'Error', count: 1, group: 'On-Page' });
      errors++;
    }

    // 3. Check H1 Tags
    const h1Matches = html.match(/<h1[^>]*>.*?<\/h1>/gi);
    if (!h1Matches) {
      issues.push({ title: 'Missing H1 Tag', type: 'Error', count: 1, group: 'On-Page' });
      errors++;
    } else if (h1Matches.length > 1) {
      issues.push({ title: 'Multiple H1 Tags', type: 'Warning', count: h1Matches.length, group: 'On-Page' });
      warnings++;
    }

    // 4. Performance heuristic (HTML size)
    const sizeKb = html.length / 1024;
    if (sizeKb > 200) {
      issues.push({ title: 'Large HTML Size (>200KB)', type: 'Notice', count: 1, group: 'Performance' });
      notices++;
    }

    // Calculate score
    const penalty = (errors * 15) + (warnings * 5) + (notices * 2);
    const score = Math.max(0, 100 - penalty);

    res.json({
      success: true,
      data: {
        score,
        errors,
        warnings,
        notices,
        issues
      }
    });

  } catch (error) {
    console.error('Audit failed:', error);
    res.json({
      success: true,
      data: {
        score: 0,
        errors: 1,
        warnings: 0,
        notices: 0,
        issues: [{ title: 'Failed to crawl homepage (Connection Error)', type: 'Error', count: 1, group: 'Technical' }]
      }
    });
  }
});

export { router as seoRouter };
