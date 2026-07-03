import cron from 'node-cron';
import nodemailer from 'nodemailer';
import { redisClient } from './redis';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: parseInt(process.env.SMTP_PORT || '587', 10),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  }
});

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function initCronJobs() {
  console.log('[CRON] Initializing automated reporting jobs...');

  // Run every minute
  cron.schedule('* * * * *', async () => {
    try {
      const settingsStr = await redisClient.get('admin:report_settings');
      if (!settingsStr) return;
      
      const settings = JSON.parse(settingsStr);
      if (!settings.enabled || !settings.email || !settings.time) return;

      const now = new Date();
      
      // Check Time (format: "HH:MM" e.g., "08:00")
      const currentHour = now.getHours().toString().padStart(2, '0');
      const currentMinute = now.getMinutes().toString().padStart(2, '0');
      const currentTimeStr = `${currentHour}:${currentMinute}`;
      
      if (currentTimeStr !== settings.time) return; // Only trigger at exact minute

      // Check Frequency
      if (settings.frequency === 'weekly') {
        const currentDayStr = daysOfWeek[now.getDay()];
        if (currentDayStr !== settings.day) return;
      }

      console.log(`[CRON] Triggering automated report to ${settings.email}`);

      // Fetch Analytics Data (simplified for email)
      const domain = await redisClient.get('admin:target_domain') || 'Unknown';
      const totalPageviews = await redisClient.get(`project:${domain}:pageviews:total`) || '0';
      const totalVisitors = await redisClient.pfCount(`project:${domain}:visitors:total`);

      // HTML Template
      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 8px; padding: 20px;">
          <h2 style="color: #171717; margin-bottom: 5px;">Analytics Report for ${domain}</h2>
          <p style="color: #737373; font-size: 14px; margin-top: 0;">Automated report via Gestions Web Metrics</p>
          
          <div style="display: flex; justify-content: space-between; margin-top: 30px;">
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; width: 45%;">
              <p style="color: #737373; font-size: 12px; margin: 0 0 10px 0; font-weight: bold; text-transform: uppercase;">Total Pageviews</p>
              <h1 style="color: #171717; margin: 0; font-size: 32px;">${parseInt(totalPageviews, 10).toLocaleString()}</h1>
            </div>
            
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; width: 45%;">
              <p style="color: #737373; font-size: 12px; margin: 0 0 10px 0; font-weight: bold; text-transform: uppercase;">Total Visitors</p>
              <h1 style="color: #171717; margin: 0; font-size: 32px;">${totalVisitors.toLocaleString()}</h1>
            </div>
          </div>
          
          <p style="color: #a3a3a3; font-size: 12px; margin-top: 30px; text-align: center;">
            You are receiving this email because automated reporting is enabled in your dashboard.
          </p>
        </div>
      `;

      await transporter.sendMail({
        from: process.env.SMTP_FROM || '"Gestions Analytics" <reports@gestions.com>',
        to: settings.email,
        subject: `Your Analytics Report for ${domain}`,
        html: htmlContent,
      });

      console.log(`[CRON] Email successfully sent to ${settings.email}`);

    } catch (error) {
      console.error('[CRON] Error sending report:', error);
    }
  });
}
