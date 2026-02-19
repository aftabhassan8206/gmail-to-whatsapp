
import React, { useState } from 'react';
import { AppsScriptCode } from './components/AppsScriptCode';

const App: React.FC = () => {
  const [showAddonCode, setShowAddonCode] = useState(true);

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-emerald-500/30 overflow-x-hidden">
      <header className="border-b border-white/5 bg-zinc-950/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 bg-emerald-500 rounded-2xl flex items-center justify-center text-black shadow-[0_0_30px_rgba(16,185,129,0.2)] rotate-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter uppercase leading-none">Visual Bridge</h1>
              <p className="text-[9px] font-bold text-zinc-500 tracking-[0.3em] uppercase mt-1">Direct API Engine</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
             <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">In-Gmail Flow Enabled</span>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto p-6 lg:p-12">
        <div className="max-w-4xl mx-auto py-10">
          <div className="mb-12 text-center">
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] mb-4 block">Deployment Guide</span>
            <h2 className="text-4xl font-black mb-4 tracking-tight">Direct HTML-to-PNG API</h2>
            <p className="text-zinc-500 text-base max-w-xl mx-auto">
              Follow these steps to enable 1:1 rendering directly inside Gmail. No external apps, no auth errors.
            </p>
          </div>

          <div className="mb-10 p-6 bg-amber-500/5 border border-amber-500/20 rounded-3xl">
             <div className="flex items-start gap-4">
               <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 flex-shrink-0">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
               </div>
               <div>
                 <h4 className="text-amber-500 text-xs font-black uppercase tracking-widest mb-1">Payload Error Fixed</h4>
                 <p className="text-zinc-400 text-[11px] leading-relaxed">
                   We've replaced <code>config</code> with <code>generationConfig</code> in the code below. This resolves the 400 error you experienced when calling the API via UrlFetchApp.
                 </p>
               </div>
             </div>
          </div>

          <AppsScriptCode />

          <div className="mt-20 bg-zinc-900/30 p-12 rounded-[3rem] border border-white/5">
             <h3 className="text-xl font-black mb-6">How it works</h3>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
               <div>
                 <div className="text-emerald-500 font-black mb-2">01. Extract</div>
                 <p className="text-xs text-zinc-500 leading-relaxed">The Add-on grabs the email body and subject line directly from the Gmail thread.</p>
               </div>
               <div>
                 <div className="text-emerald-500 font-black mb-2">02. Fetch</div>
                 <p className="text-xs text-zinc-500 leading-relaxed">It sends this content to the Google Generative AI REST endpoint as a background request.</p>
               </div>
               <div>
                 <div className="text-emerald-500 font-black mb-2">03. Render</div>
                 <p className="text-xs text-zinc-500 leading-relaxed">The PNG image is returned to Gmail and displayed in the sidebar for instant sharing.</p>
               </div>
             </div>
          </div>
        </div>
      </main>

      <footer className="mt-32 border-t border-white/5 py-12 bg-zinc-950">
        <div className="max-w-[1400px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="flex flex-col gap-2">
             <div className="text-[10px] font-black tracking-[0.4em] uppercase text-zinc-700">Visual Bridge API v4.1.0</div>
             <p className="text-[9px] font-bold text-zinc-800 uppercase tracking-widest">© 2024 Direct Rendering Lab</p>
           </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
