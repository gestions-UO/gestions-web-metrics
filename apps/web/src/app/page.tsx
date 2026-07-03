import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#fdfcfb] font-sans text-neutral-900 selection:bg-neutral-900 selection:text-white flex flex-col">
      
      <header className="px-6 md:px-12 py-8 flex justify-between items-center w-full max-w-[1400px] mx-auto">
        <Link href="/" className="text-xl font-medium tracking-tight text-neutral-900">
          gestions-web-metrics.
        </Link>

        <div className="flex gap-4">
          <Link href="/login" className="px-5 py-2.5 text-sm font-medium text-[#fdfcfb] bg-neutral-900 hover:bg-black rounded-full transition-colors">
            Go to Dashboard
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center max-w-[900px] mx-auto mt-20 mb-32">
        <h1 className="text-5xl md:text-7xl font-light tracking-tight text-neutral-900 mb-8 leading-[1.1] pb-2">
          Monitor your web traffic and technical health.
        </h1>
        <p className="text-lg md:text-xl text-neutral-500 font-light mb-12 max-w-[600px] leading-relaxed">
          The most elegant, privacy-friendly first-party analytics and technical SEO auditor. Know your traffic and keep your site error-free.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link href="/login" className="px-8 py-4 text-sm font-medium text-white bg-neutral-900 hover:bg-black rounded-full transition-all flex items-center justify-center">
            Go to Dashboard
          </Link>
          <a href="https://github.com/tu-usuario/gestions-web-metrics" className="px-8 py-4 text-sm font-medium text-neutral-900 bg-white border border-neutral-200 hover:bg-neutral-50 rounded-full transition-all flex items-center justify-center">
            View on GitHub
          </a>
        </div>
      </main>

      {/* Features Section */}
      <section className="px-6 pb-32 max-w-[1200px] mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="rounded-[2rem] bg-white border border-neutral-200 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-start">
            <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mb-6">
              <svg className="w-5 h-5 text-neutral-900" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            </div>
            <h3 className="text-xl font-medium tracking-tight text-neutral-900 mb-3">Privacy-First Analytics</h3>
            <p className="text-neutral-500 font-light leading-relaxed">
              Track pageviews, unique visitors, and top content without compromising user privacy. Say goodbye to invasive cookies.
            </p>
          </div>

          <div className="rounded-[2rem] bg-white border border-neutral-200 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-start">
            <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mb-6">
              <svg className="w-5 h-5 text-neutral-900" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <h3 className="text-xl font-medium tracking-tight text-neutral-900 mb-3">Technical SEO Audits</h3>
            <p className="text-neutral-500 font-light leading-relaxed">
              Run on-demand crawlers to detect missing tags, broken links, and performance bottlenecks before search engines do.
            </p>
          </div>

          <div className="rounded-[2rem] bg-white border border-neutral-200 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-start">
            <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mb-6">
              <svg className="w-5 h-5 text-neutral-900" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" /></svg>
            </div>
            <h3 className="text-xl font-medium tracking-tight text-neutral-900 mb-3">Self-Hosted via Docker</h3>
            <p className="text-neutral-500 font-light leading-relaxed">
              Own your data completely. Deploy gestions-web-metrics on your own infrastructure in minutes using our official Docker image.
            </p>
          </div>

        </div>
      </section>

      <footer className="mt-auto py-12 px-6 border-t border-neutral-200 w-full">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-neutral-500 font-light">© 2026 gestions-web-metrics. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="text-sm text-neutral-500 hover:text-neutral-900 font-light transition-colors">Privacy Policy</Link>
            <Link href="/terms-of-service" className="text-sm text-neutral-500 hover:text-neutral-900 font-light transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
