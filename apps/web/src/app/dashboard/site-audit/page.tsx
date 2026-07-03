'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, XCircle, Info, RefreshCw, Loader2 } from 'lucide-react';
import { useState, useRef } from 'react';
import { ExportAuditMenu } from '@/components/export-audit-menu';

export default function SiteAuditPage() {
  const auditRef = useRef<HTMLDivElement>(null);
  const [auditData, setAuditData] = useState<any>(null);
  const [isScanning, setIsScanning] = useState(false);

  const runAudit = async () => {
    setIsScanning(true);
    try {
      const res = await fetch('/api/v1/seo/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}) // backend should use target_domain if none provided
      });
      const json = await res.json();
      if (json.success) {
        setAuditData(json.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="flex flex-col gap-12 h-full" ref={auditRef}>
      <div className="flex justify-between items-end">
        <motion.div initial={{opacity:0, y:-5}} animate={{opacity:1, y:0}}>
          <h1 className="text-3xl font-light tracking-tight text-neutral-900 mb-2">Site Audit</h1>
          <p className="text-neutral-500 text-sm font-light">Technical Health & Performance Issues</p>
        </motion.div>
        <div className="flex items-center gap-3">
          {auditData && <ExportAuditMenu auditData={auditData} targetRef={auditRef} />}
          <motion.button 
            onClick={runAudit}
            disabled={isScanning}
            initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.1}}
            className="flex items-center gap-2 bg-neutral-900 text-white text-sm font-medium px-6 py-3 rounded-full transition-colors hover:bg-black disabled:opacity-50"
          >
            {isScanning ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" strokeWidth={1.5} />} 
            {isScanning ? 'Scanning...' : 'Run Audit'}
          </motion.button>
        </div>
      </div>

      <motion.div initial={{opacity:0, y:5}} animate={{opacity:1, y:0}} transition={{delay: 0.1}} className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-6 rounded-xl bg-white border border-neutral-200/60 flex flex-col justify-between md:col-span-1">
          <p className="text-neutral-500 text-xs font-medium mb-4">Health Score</p>
          <div className="flex items-end gap-2">
            <h3 className="text-6xl font-light tracking-tight text-neutral-900">{auditData ? auditData.score : '-'}</h3>
            {auditData && <span className="text-xs font-mono text-neutral-400 mb-2">/ 100</span>}
          </div>
        </div>

        <div className="md:col-span-3 grid grid-cols-3 gap-4">
          {[
            { label: 'Errors', value: auditData ? auditData.errors : '-', icon: XCircle, color: 'text-neutral-900', countColor: 'text-neutral-900' },
            { label: 'Warnings', value: auditData ? auditData.warnings : '-', icon: AlertTriangle, color: 'text-neutral-500', countColor: 'text-neutral-700' },
            { label: 'Notices', value: auditData ? auditData.notices : '-', icon: Info, color: 'text-neutral-400', countColor: 'text-neutral-500' },
          ].map((item, i) => (
            <div key={i} className="p-6 rounded-xl bg-white border border-neutral-200/60 flex flex-col justify-between">
              <div className="flex items-center gap-2 mb-4">
                <item.icon className={`w-4 h-4 ${item.color}`} strokeWidth={1.5} />
                <p className="text-neutral-500 text-xs font-medium">{item.label}</p>
              </div>
              <h3 className={`text-4xl font-light tracking-tight ${item.countColor}`}>{item.value}</h3>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{opacity:0, y:5}} animate={{opacity:1, y:0}} transition={{delay: 0.2}} className="rounded-xl bg-white border border-neutral-200/60 flex flex-col overflow-hidden">
        <div className="p-6 border-b border-neutral-200/60">
          <h3 className="text-sm font-medium text-neutral-900">Top Issues</h3>
        </div>
        
        <div className="flex flex-col">
          {!auditData ? (
             <div className="p-12 text-center text-neutral-500 font-light flex flex-col items-center justify-center">
               <AlertTriangle className="w-8 h-8 mb-4 text-neutral-300" strokeWidth={1} />
               <p>No audit has been run yet.</p>
               <p className="text-sm mt-2">Click "Run Audit" to scan your site for technical SEO issues.</p>
             </div>
          ) : (
            auditData.issues.map((issue: any, i: number) => (
              <div key={i} className={`p-6 flex items-center justify-between hover:bg-neutral-50/50 transition-colors cursor-pointer ${i !== auditData.issues.length - 1 ? 'border-b border-neutral-100/50' : ''}`}>
                <div className="flex items-center gap-4">
                  {issue.type === 'Error' && <XCircle className="w-5 h-5 text-neutral-900" strokeWidth={1.5} />}
                  {issue.type === 'Warning' && <AlertTriangle className="w-5 h-5 text-neutral-500" strokeWidth={1.5} />}
                  {issue.type === 'Notice' && <Info className="w-5 h-5 text-neutral-400" strokeWidth={1.5} />}
                  <div>
                    <h4 className="text-sm font-medium text-neutral-900">{issue.title}</h4>
                    <span className="text-[10px] text-neutral-400 font-mono mt-1">{issue.group}</span>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <span className="text-sm font-mono text-neutral-900">{issue.count}</span>
                    <span className="text-[10px] text-neutral-400 font-mono mt-1 block">Pages affected</span>
                  </div>
                  <button className="px-4 py-2 border border-neutral-200 rounded-full text-xs font-medium text-neutral-900 hover:bg-neutral-50 transition-colors">Details</button>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}
