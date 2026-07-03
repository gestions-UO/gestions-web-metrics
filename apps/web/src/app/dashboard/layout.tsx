'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Globe, LineChart, Activity, LogOut, Settings, Search, Fingerprint, Menu, X } from 'lucide-react';
import { toast } from 'sonner';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch('/api/v1/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (e) {
      toast.error('Failed to logout');
    }
  };

  const navItems = [
    { name: 'Overview', href: '/dashboard', icon: Home },
    { name: 'Audit', href: '/dashboard/site-audit', icon: Activity },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-[#fdfcfb] text-neutral-900 overflow-hidden font-sans selection:bg-neutral-900 selection:text-white">
      
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:static inset-y-0 left-0 w-[260px] border-r border-neutral-200/60 bg-[#fdfcfb] flex flex-col justify-between z-50 transition-transform duration-300 ease-in-out md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8">
          <Link href="/dashboard" className="text-xl font-medium tracking-tight mb-12 flex items-center gap-2 group">
            <span className="text-neutral-900">gestions-web-metrics.</span>
          </Link>

          <nav className="flex flex-col gap-1.5 mt-8">
            <p className="px-3 text-[11px] font-medium text-neutral-400 mb-3">WORKSPACE</p>
            {navItems.map((item) => {
              const active = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/dashboard');
              const Icon = item.icon;
              return (
                <Link 
                  key={item.href} 
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 text-sm font-medium transition-colors rounded-lg ${
                    active ? 'text-neutral-900 bg-neutral-100/50' : 'text-neutral-500 hover:text-neutral-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-neutral-900' : 'text-neutral-400'}`} strokeWidth={active ? 2 : 1.5} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-8 border-t border-neutral-200/60">
          <div className="flex items-center gap-3 px-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-500">
               <Fingerprint className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-neutral-900">Admin</span>
              <span className="text-xs font-light text-neutral-500">Pro Plan</span>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 w-full text-left text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors rounded-lg"
          >
            <LogOut className="w-4 h-4" strokeWidth={1.5} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between px-6 py-4 border-b border-neutral-200/60 bg-[#fdfcfb] shrink-0">
          <span className="font-medium tracking-tight text-neutral-900">gestions-web-metrics.</span>
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 -mr-2 text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors">
            <Menu className="w-5 h-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto">
          <div className="p-6 md:p-14 max-w-[1200px] mx-auto min-h-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
