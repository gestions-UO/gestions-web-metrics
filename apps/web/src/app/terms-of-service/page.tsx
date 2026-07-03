import Link from 'next/link';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-[#fdfcfb] font-sans text-neutral-900 selection:bg-neutral-900 selection:text-white flex flex-col">
      <header className="px-6 md:px-12 py-8 w-full max-w-[1400px] mx-auto">
        <Link href="/" className="text-xl font-medium tracking-tight text-neutral-900">
          gestions-web-metrics.
        </Link>
      </header>
      
      <main className="flex-1 max-w-[800px] mx-auto px-6 py-20">
        <h1 className="text-4xl font-light tracking-tight mb-12">Terms of Service</h1>
        
        <div className="flex flex-col gap-6 font-light leading-relaxed text-neutral-600">
          <p>Last updated: July 3, 2026</p>
          
          <h2 className="text-2xl font-medium text-neutral-900 mt-4">1. License</h2>
          <p>
            Gestions-seo is provided as open-source software. You are free to use, modify, and self-host the application 
            for your personal or commercial projects under the terms of the applicable open-source license.
          </p>

          <h2 className="text-2xl font-medium text-neutral-900 mt-4">2. Self-Hosting Responsibility</h2>
          <p>
            As a self-hosted platform, you are solely responsible for the security, maintenance, and legal compliance 
            of your own instance. We do not have access to your server or your data.
          </p>

          <h2 className="text-2xl font-medium text-neutral-900 mt-4">3. Limitation of Liability</h2>
          <p>
            The software is provided "as is", without warranty of any kind. In no event shall the authors or copyright 
            holders be liable for any claim, damages, or other liability arising from, out of, or in connection with 
            the software or the use or other dealings in the software.
          </p>
        </div>
      </main>

      <footer className="mt-auto py-12 px-6 border-t border-neutral-200 w-full text-center">
        <p className="text-sm text-neutral-500 font-light">© 2026 gestions-web-metrics. All rights reserved.</p>
      </footer>
    </div>
  );
}
