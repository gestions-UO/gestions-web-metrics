import { Router } from 'express';
import { authMiddleware, generateToken, AuthenticatedRequest } from './auth';
import { trackingRouter } from './routes/tracking';
import { seoRouter } from './routes/seo';

export const router = Router();

router.use('/tracking', trackingRouter);
router.use('/seo', seoRouter);

router.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@gestions.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin';

  if (email !== adminEmail || password !== adminPassword) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = generateToken({ id: 'admin-1', email: adminEmail });
  
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  res.json({ success: true, user: { id: 'admin-1', email: adminEmail, name: 'Admin' } });
});

router.post('/auth/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ success: true });
});

router.get('/auth/me', authMiddleware, (req: AuthenticatedRequest, res) => {
  res.json({ user: req.user });
});

router.get('/projects', authMiddleware, async (req: AuthenticatedRequest, res) => {
  // In single-tenant, we just return the hardcoded default project or fetch domains from Redis
  res.json({ 
    projects: [
      { id: 'prj_1', domain: 'mysaas.com', domainRating: 0, organicTraffic: 0 }
    ] 
  });
});
