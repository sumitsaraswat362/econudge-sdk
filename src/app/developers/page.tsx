'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function DevelopersPage() {
  const [apiKey, setApiKey] = useState('eco_********************************');
  const [isCopied, setIsCopied] = useState(false);

  const generateKey = () => {
    const chars = 'abcdef0123456789';
    const key = Array.from({ length: 32 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    setApiKey(`eco_${key}`);
  };

  const copyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <main className="relative z-10 mx-auto max-w-5xl px-6 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="mb-4 text-center text-3xl font-bold text-white sm:text-4xl">
          Developer <span className="gradient-text">Portal</span>
        </h1>
        <p className="mb-10 text-center text-sm text-gray-500">
          Integrate the EcoNudge engine into your own platform
        </p>

        <div className="grid gap-8 sm:grid-cols-2">
          {/* API Key section */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-bold text-white mb-2">🔑 Your API Key</h3>
            <p className="text-sm text-gray-400 mb-6">Use this key to authenticate requests to the EcoNudge calculation engine.</p>
            
            <div className="flex items-center gap-2 mb-4">
              <div className="flex-1 bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-sm font-mono text-emerald-400 overflow-hidden text-ellipsis">
                {apiKey}
              </div>
              <button 
                onClick={copyKey}
                className="bg-white/10 hover:bg-white/20 transition rounded-lg px-4 py-3 text-white font-bold"
              >
                {isCopied ? '✅' : 'Copy'}
              </button>
            </div>
            
            <button 
              onClick={generateKey}
              className="w-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 transition rounded-lg py-3 text-sm font-bold"
            >
              Generate New Key
            </button>
          </div>

          {/* Quickstart snippet */}
          <div className="glass-card p-6 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-white">⚡ Quickstart</h3>
              <div className="flex gap-2">
                <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded">React</span>
                <span className="bg-yellow-500/20 text-yellow-400 text-xs px-2 py-1 rounded">Node.js</span>
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-4">Drop the EcoNudge widget into your React app.</p>
            
            <div className="flex-1 bg-[#0d1117] border border-gray-800 rounded-lg p-4 overflow-x-auto">
              <pre className="text-xs font-mono text-gray-300 leading-relaxed">
<span className="text-pink-400">import</span> {'{'} EcoNudgeWidget {'}'} <span className="text-pink-400">from</span> <span className="text-green-300">'@econudge/react'</span>;{'\n\n'}
<span className="text-pink-400">export default function</span> <span className="text-blue-300">CheckoutPage</span>() {'{'}{'\n'}
{'  '}<span className="text-pink-400">return</span> ({'\n'}
{'    '}&lt;<span className="text-blue-300">div</span>&gt;{'\n'}
{'      '}&lt;<span className="text-blue-300">EcoNudgeWidget</span>{'\n'}
{'        '}<span className="text-blue-200">apiKey</span>=<span className="text-green-300">"YOUR_API_KEY"</span>{'\n'}
{'        '}<span className="text-blue-200">actionType</span>=<span className="text-green-300">"ride_booking"</span>{'\n'}
{'        '}<span className="text-blue-200">metadata</span>={'{'}{'{'} distanceKm: <span className="text-orange-300">12</span> {'}'}{'}'}{'\n'}
{'        '}<span className="text-blue-200">onAlternativeSelected</span>={'{'}(alt) =&gt; {'{'}{'\n'}
{'          '}<span className="text-gray-500">// Update your cart/booking</span>{'\n'}
{'          '}<span className="text-yellow-200">applyGreenAlternative</span>(alt);{'\n'}
{'        '}{'}'}{'}'}{'\n'}
{'      '}/&gt;{'\n'}
{'    '}&lt;/<span className="text-blue-300">div</span>&gt;{'\n'}
{'  '});{'\n'}
{'}'}
              </pre>
            </div>
          </div>
        </div>

        {/* Endpoints */}
        <div className="mt-8 glass-card p-6">
          <h3 className="text-lg font-bold text-white mb-4">📡 Available Endpoints</h3>
          <div className="space-y-3">
            {[
              { method: 'POST', path: '/api/v1/nudge/calculate', desc: 'Calculate carbon footprint and return greener alternatives for a specific user action.' },
              { method: 'GET', path: '/api/v1/esg/report', desc: 'Fetch automated corporate ESG compliance data based on your users\' choices.' },
              { method: 'POST', path: '/api/v1/webhooks', desc: 'Register a webhook to receive real-time events when users accept green nudges.' }
            ].map(ep => (
              <div key={ep.path} className="flex flex-col sm:flex-row sm:items-center gap-4 bg-white/5 border border-white/10 rounded-lg p-4">
                <div className="flex items-center gap-3 w-64 shrink-0">
                  <span className={`text-xs font-bold px-2 py-1 rounded ${
                    ep.method === 'POST' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {ep.method}
                  </span>
                  <span className="font-mono text-sm text-gray-300">{ep.path}</span>
                </div>
                <p className="text-sm text-gray-500">{ep.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </main>
  );
}
