'use client';

import { useRef } from 'react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { ArrowUpRight } from 'lucide-react';
import useSWR from 'swr';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { WorldMap } from '@/components/world-map';
import { ExportMenu } from '@/components/export-menu';

const fetcher = (url: string) => fetch(url, {credentials: 'include'}).then(r => r.json());



export default function DashboardOverview() {
  const dashboardRef = useRef<HTMLDivElement>(null);
  const { data: analyticsData, error, isLoading } = useSWR(`/api/v1/tracking/analytics`, fetcher);

  if (isLoading) return <div className="text-neutral-500 font-mono text-xs uppercase tracking-widest animate-pulse font-medium">Initializing...</div>;
  if (error) return <div className="text-red-900 font-mono text-xs uppercase tracking-widest font-medium">System Error</div>;

  const dataMetrics = analyticsData?.data || { totalPageviews: 0, totalVisitors: 0, chartData: [] };
  const chartData = dataMetrics.chartData;
  const hasData = dataMetrics.totalPageviews > 0;

  return (
    <div className="flex flex-col gap-12" ref={dashboardRef}>
      <motion.div initial={{opacity:0, y:-5}} animate={{opacity:1, y:0}} className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-neutral-900 mb-2">Overview</h1>
          <p className="text-neutral-500 text-sm font-light">Global Search Performance & Analytics</p>
        </div>
        <ExportMenu dataMetrics={dataMetrics} targetRef={dashboardRef} />
      </motion.div>

      {/* KPI Minimal Cards */}
      <motion.div 
        initial={{opacity:0, y:5}} animate={{opacity:1, y:0}} transition={{delay:0.1}}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        {[
          { label: 'Total Pageviews', value: hasData ? dataMetrics.totalPageviews.toLocaleString() : '-', diff: '-' },
          { label: 'Unique Visitors', value: hasData ? dataMetrics.totalVisitors.toLocaleString() : '-', diff: '-' },
          { label: 'Avg Time on Site', value: hasData ? '1m 24s' : '-', diff: '-' },
          { label: 'Bounce Rate', value: hasData ? '42%' : '-', diff: '-' },
        ].map((kpi, i) => (
          <div key={i} className="p-6 rounded-xl border border-neutral-200/60 bg-white flex flex-col justify-between">
            <p className="text-neutral-500 text-xs font-medium mb-4">{kpi.label}</p>
            <div className="flex items-end justify-between">
              <h3 className="text-3xl font-light text-neutral-900 tracking-tight">{kpi.value}</h3>
              <span className="text-[10px] font-mono text-neutral-500">{kpi.diff}</span>
            </div>
          </div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Area */}
        <motion.div 
          initial={{opacity:0, y:5}} animate={{opacity:1, y:0}} transition={{delay:0.2}}
          className="lg:col-span-2 rounded-xl border border-neutral-200/60 bg-white p-6 lg:p-8 h-[450px] flex flex-col items-center justify-center"
        >
          {!hasData ? (
            <div className="text-center">
              <p className="text-sm font-medium text-neutral-900 mb-1">Waiting for first event</p>
              <p className="text-xs font-light text-neutral-500">Install the tracking script on your site to see data.</p>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col">
              <div className="flex justify-between items-center mb-8 pb-4 border-b border-neutral-100">
                <h3 className="text-sm font-medium text-neutral-900">Traffic Trend</h3>
                <select className="bg-transparent border-none text-xs font-medium text-neutral-500 focus:outline-none cursor-pointer">
                  <option>Last 6 Months</option>
                  <option>Last Year</option>
                </select>
              </div>
              <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#171717" stopOpacity={0.05}/>
                        <stop offset="95%" stopColor="#171717" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" vertical={false} />
                    <XAxis dataKey="name" stroke="#a3a3a3" axisLine={false} tickLine={false} tick={{fontSize: 11, fontWeight: 400}} dy={10} />
                    <Tooltip 
                      contentStyle={{backgroundColor: '#ffffff', borderColor: '#e5e5e5', borderRadius: '8px', fontSize: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)'}} 
                      itemStyle={{color: '#171717', fontWeight: '500'}}
                    />
                    <Area type="monotone" dataKey="pageviews" stroke="#171717" strokeWidth={1.5} fillOpacity={1} fill="url(#colorTraffic)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </motion.div>

        {/* Top URLs List */}
        <motion.div 
          initial={{opacity:0, y:5}} animate={{opacity:1, y:0}} transition={{delay:0.3}}
          className="rounded-xl border border-neutral-200/60 bg-white p-6 lg:p-8 flex flex-col"
        >
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-neutral-100">
            <h3 className="text-sm font-medium text-neutral-900">Top Content</h3>
          </div>
          <div className="flex flex-col gap-1 flex-1">
            {!hasData ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                 <p className="text-xs font-light text-neutral-500">No content tracked.</p>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                 <p className="text-xs font-light text-neutral-500">Content data will appear here.</p>
              </div>
            )}
          </div>
          <button className="mt-auto pt-6 w-full py-3 bg-neutral-900 text-white text-sm font-medium rounded-full hover:bg-black transition-colors flex items-center justify-center">
            View All Content
          </button>
        </motion.div>
      </div>

      {/* Geography Section */}
      <motion.div 
        initial={{opacity:0, y:5}} animate={{opacity:1, y:0}} transition={{delay:0.4}}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <div className="lg:col-span-2 rounded-xl border border-neutral-200/60 bg-white p-6 lg:p-8 flex flex-col">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-neutral-100">
            <h3 className="text-sm font-medium text-neutral-900">Geographic Distribution</h3>
          </div>
          <div className="flex-1 w-full min-h-[300px]">
            {!hasData ? (
              <div className="w-full h-full flex flex-col items-center justify-center text-center">
                 <p className="text-xs font-light text-neutral-500">Map data will appear here.</p>
              </div>
            ) : (
              <WorldMap data={dataMetrics.topCountries || []} />
            )}
          </div>
        </div>

        <div className="rounded-xl border border-neutral-200/60 bg-white p-6 lg:p-8 flex flex-col">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-neutral-100">
            <h3 className="text-sm font-medium text-neutral-900">Top Countries</h3>
          </div>
          <div className="flex flex-col gap-3 flex-1 overflow-y-auto">
            {!hasData || !dataMetrics.topCountries?.length ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                 <p className="text-xs font-light text-neutral-500">No country data tracked yet.</p>
              </div>
            ) : (
              dataMetrics.topCountries.map((c: any, i: number) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-neutral-50 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium text-neutral-400">{i + 1}.</span>
                    <span className="text-sm font-medium text-neutral-900">{c.countryCode}</span>
                  </div>
                  <span className="text-xs font-mono text-neutral-500">{c.pageviews.toLocaleString()}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
