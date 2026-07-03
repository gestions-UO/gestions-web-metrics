import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#fdfcfb] font-sans text-neutral-900 selection:bg-neutral-900 selection:text-white flex flex-col">
      <header className="px-6 md:px-12 py-8 w-full max-w-[1400px] mx-auto">
        <Link href="/" className="text-xl font-medium tracking-tight text-neutral-900">
          gestions-web-metrics.
        </Link>
      </header>
      
      <main className="flex-1 max-w-[800px] mx-auto px-6 py-20">
        <h1 className="text-4xl font-light tracking-tight mb-12">Privacy Policy</h1>
        
        <div className="flex flex-col gap-6 font-light leading-relaxed text-neutral-600">
          <p>Last updated: July 3, 2026</p>
          
          <h2 className="text-2xl font-medium text-neutral-900 mt-4">1. Introduction</h2>
          <p>
            Gestions-seo is designed as a privacy-first, self-hosted analytics and SEO tool. We believe your data is your own.
            When you self-host gestions-web-metrics, all data is stored exclusively on your own infrastructure.
          </p>

          <h2 className="text-2xl font-medium text-neutral-900 mt-4">2. Data Collection (Self-Hosted)</h2>
          <p>
            The tracking script collects basic pageview information, including URL, referrer, user agent, and screen width. 
            IP addresses are only used temporarily for geolocation (country/city) and hashing (HyperLogLog) to estimate unique visitors.
            Raw IP addresses are never permanently stored in the database.
          </p>

          <h2 className="text-2xl font-medium text-neutral-900 mt-4">3. No Cookies</h2>
          <p>
            Gestions-seo does not use tracking cookies or persistent identifiers to track visitors across multiple sessions or days.
            This makes it compliant with GDPR, CCPA, and PECR without requiring an annoying cookie banner.
          </p>
          
          <h2 className="text-2xl font-medium text-neutral-900 mt-4">4. Ownership</h2>
          <p>
            Because you run the software yourself, you maintain 100% ownership and control over your website's analytics data.
          </p>
        </div>
      </main>

      <footer className="mt-auto py-12 px-6 border-t border-neutral-200 w-full text-center">
        <p className="text-sm text-neutral-500 font-light">© 2026 gestions-web-metrics. All rights reserved.</p>
      </footer>
    </div>
  );
}
