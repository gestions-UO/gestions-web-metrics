# gestions-web-metrics

**gestions-web-metrics** is a privacy-first, self-hosted web analytics and technical SEO auditing platform. Designed to be deployed effortlessly on your own infrastructure via Docker, it puts you in complete control of your data without compromising on aesthetics or functionality.

![gestions-web-metrics](https://raw.githubusercontent.com/gestions-web-metrics/gestions-web-metrics/main/screenshot.png)

## Features

- **Privacy-First Analytics**: Track pageviews, unique visitors, and top content without using cookies. Fully GDPR, CCPA, and PECR compliant out of the box.
- **Technical SEO Audits**: Run on-demand crawler scans of your website to detect missing meta tags, broken links, and performance bottlenecks.
- **Single-Tenant Architecture**: A simplified, secure environment intended for a single administrator or team.
- **Ultra-Fast Backend**: Leverages Redis and HyperLogLog algorithms for instant analytics aggregations.
- **Beautiful UI**: A minimalist, monochrome dashboard inspired by top-tier SaaS design.

## Deployment (Dockploy / Docker)

The easiest way to run `gestions-web-metrics` is via Docker Compose. You can use PaaS platforms like **Dockploy**, Coolify, or Dokku.

### 1. Requirements
- Docker and Docker Compose installed.

### 2. Environment Setup
Create a `.env` file in the root directory:

```env
ADMIN_EMAIL=admin@tusitio.com
ADMIN_PASSWORD=supersecreto
JWT_SECRET=un_secreto_muy_largo
```

### 3. Run with Docker Compose
We provide a `docker-compose.prod.yml` ready for production:

```bash
docker-compose -f docker-compose.prod.yml up -d --build
```

The app will be available on port `3000`.

## Architecture
`gestions-web-metrics` is a Turborepo monorepo:
- **`apps/web`**: Next.js 14 frontend using Tailwind CSS.
- **`apps/api`**: Express backend powered by Node.js.
- **`redis`**: In-memory data store for the analytics engine.

## Tracking Installation
To start collecting data, paste this snippet into the `<head>` of your website:

```html
<script>
  window.GestionsSEO = window.GestionsSEO || function(){(GestionsSEO.q=GestionsSEO.q||[]).push(arguments)};
  GestionsSEO('init', 'your-project-id');
</script>
<script async src="https://analytics.tusitio.com/api/v1/tracking/track.js" data-domain="tusitio.com"></script>
```

## License
MIT License. You are free to self-host and modify it as you see fit.
