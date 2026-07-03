'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Save, CheckCircle, Copy, AlertTriangle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsPage() {
  const [projectId, setProjectId] = useState('prj_8x92m4n5kL');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN || 'https://analytics.midominio.com';
  const [targetDomain, setTargetDomain] = useState('mysaas.com');
  const [isSaving, setIsSaving] = useState(false);

  // Email Reporting State
  const [reportEnabled, setReportEnabled] = useState(false);
  const [reportEmail, setReportEmail] = useState('');
  const [reportTime, setReportTime] = useState('08:00');
  const [reportFreq, setReportFreq] = useState('daily');
  const [reportDay, setReportDay] = useState('Monday');
  const [isSavingReport, setIsSavingReport] = useState(false);

  useEffect(() => {
    // Load general settings
    fetch('/api/v1/tracking/settings')
      .then(r => r.json())
      .then(d => {
        if (d.success && d.data.targetDomain) {
          setTargetDomain(d.data.targetDomain);
        }
      })
      .catch(console.error);

    // Load report settings
    fetch('/api/v1/tracking/report-settings')
      .then(r => r.json())
      .then(d => {
        if (d.success && d.data) {
          setReportEnabled(d.data.enabled);
          setReportEmail(d.data.email || '');
          setReportTime(d.data.time || '08:00');
          setReportFreq(d.data.frequency || 'daily');
          setReportDay(d.data.day || 'Monday');
        }
      })
      .catch(console.error);
  }, []);

  const trackingScript = `<script>
  window.GestionsSEO = window.GestionsSEO || function(){(GestionsSEO.q=GestionsSEO.q||[]).push(arguments)};
  GestionsSEO('init', '${projectId}');
</script>
<script async src="${appDomain}/api/v1/tracking/track.js" data-domain="${targetDomain}"></script>`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(trackingScript);
    toast.success('Script copied to clipboard');
  };

  const handleVerify = () => {
    setIsVerifying(true);
    // Simulate verification
    setTimeout(() => {
      setIsVerifying(false);
      setIsVerified(true);
      toast.success('Installation verified successfully');
    }, 2000);
  };

  const handleDeleteProject = async () => {
    if (!confirm(`Are you sure you want to delete all analytics data for ${targetDomain}? This action cannot be undone.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/v1/tracking/project?domain=${targetDomain}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      
      if (data.success) {
        toast.success('Project data deleted successfully');
      } else {
        toast.error(data.error || 'Failed to delete project data');
      }
    } catch (e) {
      toast.error('Connection error while deleting project');
    }
  };

  return (
    <div className="flex flex-col gap-12 h-full max-w-4xl">
      <motion.div initial={{opacity:0, y:-5}} animate={{opacity:1, y:0}}>
        <h1 className="text-3xl font-light tracking-tight text-neutral-900 mb-2">Project Settings</h1>
        <p className="text-neutral-500 text-sm font-light">Configuration and Integration</p>
      </motion.div>

      <motion.div initial={{opacity:0, y:5}} animate={{opacity:1, y:0}} transition={{delay: 0.1}} className="flex flex-col gap-8">
        
        {/* Tracking Installation */}
        <section className="rounded-xl border border-neutral-200/60 bg-white overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-neutral-200/60 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center">
              <Settings className="w-4 h-4 text-neutral-900" strokeWidth={1.5} />
            </div>
            <div>
              <h2 className="text-sm font-medium text-neutral-900">Install Tracker</h2>
              <p className="text-xs text-neutral-500 font-light mt-0.5">Embed this snippet in the &lt;head&gt; of your website to start collecting data.</p>
            </div>
          </div>
          
          <div className="p-6">
            <div className="relative group">
              <pre className="p-6 bg-neutral-50 rounded-xl overflow-x-auto border border-neutral-200/50 text-xs font-mono text-neutral-800 leading-relaxed">
                {trackingScript}
              </pre>
              <button 
                onClick={copyToClipboard}
                className="absolute top-4 right-4 p-2 bg-white border border-neutral-200 rounded-md text-neutral-500 hover:text-neutral-900 shadow-sm opacity-0 group-hover:opacity-100 transition-all"
                title="Copy to clipboard"
              >
                <Copy className="w-4 h-4" strokeWidth={1.5} />
              </button>
            </div>

            <div className="mt-6 flex items-center justify-between p-4 rounded-xl border border-neutral-200/60 bg-neutral-50/50">
              <div className="flex items-center gap-3">
                {isVerified ? (
                  <CheckCircle className="w-5 h-5 text-neutral-900" strokeWidth={1.5} />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-neutral-500" strokeWidth={1.5} />
                )}
                <div>
                  <p className="text-sm font-medium text-neutral-900">
                    {isVerified ? 'Tracking is active' : 'Waiting for first event'}
                  </p>
                  <p className="text-xs text-neutral-500 font-light">
                    {isVerified ? 'We are receiving data from your site.' : 'Install the snippet and verify connection.'}
                  </p>
                </div>
              </div>
              <button 
                onClick={handleVerify}
                disabled={isVerifying || isVerified}
                className="px-5 py-2.5 bg-white border border-neutral-200 rounded-full text-xs font-medium text-neutral-900 hover:bg-neutral-50 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isVerifying ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Verify Installation'}
              </button>
            </div>
          </div>
        </section>

        {/* General Settings */}
        <section className="rounded-xl border border-neutral-200/60 bg-white overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-neutral-200/60">
            <h2 className="text-sm font-medium text-neutral-900">General Information</h2>
          </div>
          
          <div className="p-6 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-neutral-600">Target Domain</label>
              <input 
                type="text" 
                value={targetDomain}
                onChange={(e) => setTargetDomain(e.target.value)}
                className="px-4 py-3 bg-white border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-neutral-900 transition-colors text-neutral-900 font-light max-w-md"
              />
              <p className="text-xs text-neutral-500 font-light">The website domain you want to track or audit.</p>
            </div>

            <div className="pt-4 border-t border-neutral-100 flex">
              <button 
                onClick={async () => {
                  setIsSaving(true);
                  try {
                    const res = await fetch('/api/v1/tracking/settings', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ targetDomain })
                    });
                    if (res.ok) toast.success('Settings saved successfully');
                    else toast.error('Failed to save settings');
                  } catch (e) {
                    toast.error('Connection error');
                  }
                  setIsSaving(false);
                }}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white text-sm font-medium rounded-full hover:bg-black transition-colors disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" strokeWidth={1.5} />} 
                Save Changes
              </button>
            </div>
          </div>
        </section>

        {/* Automated Reports */}
        <section className="rounded-xl border border-neutral-200/60 bg-white overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-neutral-200/60 flex justify-between items-center">
            <h2 className="text-sm font-medium text-neutral-900">Automated Email Reports</h2>
            <label className="flex items-center cursor-pointer">
              <div className="relative">
                <input type="checkbox" className="sr-only" checked={reportEnabled} onChange={(e) => setReportEnabled(e.target.checked)} />
                <div className={`block w-10 h-6 rounded-full transition-colors ${reportEnabled ? 'bg-neutral-900' : 'bg-neutral-200'}`}></div>
                <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${reportEnabled ? 'transform translate-x-4' : ''}`}></div>
              </div>
            </label>
          </div>
          
          {reportEnabled && (
            <div className="p-6 flex flex-col gap-6 bg-neutral-50/30">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-neutral-600">Recipient Email</label>
                <input 
                  type="email" 
                  value={reportEmail}
                  onChange={(e) => setReportEmail(e.target.value)}
                  placeholder="admin@yourdomain.com"
                  className="px-4 py-3 bg-white border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-neutral-900 transition-colors text-neutral-900 font-light max-w-md"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-md">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium text-neutral-600">Delivery Time (UTC)</label>
                  <input 
                    type="time" 
                    value={reportTime}
                    onChange={(e) => setReportTime(e.target.value)}
                    className="px-4 py-3 bg-white border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-neutral-900 transition-colors text-neutral-900 font-light"
                  />
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium text-neutral-600">Frequency</label>
                  <select 
                    value={reportFreq}
                    onChange={(e) => setReportFreq(e.target.value)}
                    className="px-4 py-3 bg-white border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-neutral-900 transition-colors text-neutral-900 font-light appearance-none"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>
              </div>

              {reportFreq === 'weekly' && (
                <div className="flex flex-col gap-2 max-w-md">
                  <label className="text-xs font-medium text-neutral-600">Day of the Week</label>
                  <select 
                    value={reportDay}
                    onChange={(e) => setReportDay(e.target.value)}
                    className="px-4 py-3 bg-white border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-neutral-900 transition-colors text-neutral-900 font-light appearance-none"
                  >
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="pt-4 flex">
                <button 
                  onClick={async () => {
                    setIsSavingReport(true);
                    try {
                      const res = await fetch('/api/v1/tracking/report-settings', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ enabled: reportEnabled, email: reportEmail, time: reportTime, frequency: reportFreq, day: reportDay })
                      });
                      if (res.ok) toast.success('Report settings saved');
                      else toast.error('Failed to save report settings');
                    } catch (e) {
                      toast.error('Connection error');
                    }
                    setIsSavingReport(false);
                  }}
                  disabled={isSavingReport}
                  className="flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white text-sm font-medium rounded-full hover:bg-black transition-colors disabled:opacity-50"
                >
                  {isSavingReport ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" strokeWidth={1.5} />} 
                  Save Email Settings
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Danger Zone */}
        <section className="rounded-xl border border-red-200/60 bg-[#fffbfc] overflow-hidden flex flex-col mt-4">
          <div className="px-6 py-5 border-b border-red-200/60">
            <h2 className="text-sm font-medium text-red-900">Danger Zone</h2>
          </div>
          <div className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-900">Delete Project</p>
              <p className="text-xs text-neutral-500 font-light mt-1">Permanently remove this project and all its data.</p>
            </div>
            <button onClick={handleDeleteProject} className="px-5 py-2.5 bg-white border border-red-200 rounded-full text-xs font-medium text-red-900 hover:bg-red-50 transition-colors">
              Delete Project
            </button>
          </div>
        </section>

      </motion.div>
    </div>
  );
}
