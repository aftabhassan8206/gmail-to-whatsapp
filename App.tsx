
import React from 'react';
import { AppsScriptCode } from './components/AppsScriptCode';

const App: React.FC = () => {
  return (
    <div className="min-h-screen pb-24 font-sans text-gray-900 bg-[#f8f9fa]">
      <header className="bg-white border-b border-gray-100 py-6 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white shadow-lg rotate-2">
               <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-2.135 0-4.128.833-5.637 2.346C4.885 10.031 4.05 12.022 4.05 14.155c0 1.341.34 2.645 1.012 3.811L3.922 22l4.133-1.085c1.233.673 2.618 1.026 3.974 1.026h.001c2.135 0 4.128-.833-5.637 2.346s2.345-3.513 2.345-5.64c0-2.136-.834-4.127-2.346-5.637s-3.513-2.146-5.635-2.146zm4.904 11.031c-.63 1.103-2.457 1.837-3.415 1.956-1.031.127-2.288.195-3.666-.234-2.616-.816-4.63-3.13-4.63-5.601 0-.961.341-1.921.961-2.58.558-.596 1.34-.942 2.115-.942.235 0 .47.05.648.067.432.043.648.083.896.643.321.72 1.042 2.508 1.135 2.686.095.178.16.384.043.6-.117.216-.178.35-.353.551-.176.201-.368.448-.526.6-.175.166-.358.347-.154.697.202.35.897 1.474 1.926 2.394 1.325 1.184 2.443 1.554 2.793 1.729.351.176.554.146.758-.083.204-.23.864-1.008 1.101-1.357.234-.351.469-.297.794-.176.326.121 2.067 1.018 2.422 1.196s.591.267.678.416c.088.148.088.853-.254 1.713z"/></svg>
            </div>
            <div>
              <h1 className="text-xl font-black text-gray-900 tracking-tight leading-none uppercase">Visual Bridge</h1>
              <p className="text-[10px] font-black text-amber-600 tracking-widest mt-1 uppercase">Standalone Solution v7.0</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-red-100 rounded-full border border-red-200">
             <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></div>
             <span className="text-[9px] font-black text-red-700 uppercase tracking-widest">401 Auth Bypass Active</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 mt-12">
        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-black text-gray-900 mb-4 leading-tight">Fixing the <br/><span className="text-red-600">401 Authentication</span> Error</h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Your Vercel deployment is protected by a login screen, which blocks Apps Script. 
              We've updated the code to <b>Standalone Mode</b>: the Add-on now talks directly to Google AI, ignoring your Vercel URL entirely.
            </p>
          </div>

          <AppsScriptCode />

          <div className="mt-16 border-t border-gray-100 pt-12">
             <h3 className="text-sm font-black text-gray-400 mb-8 uppercase tracking-[0.2em] text-center">Troubleshooting Checklist</h3>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-gray-50 rounded-3xl">
                   <p className="text-[10px] font-black text-zinc-400 mb-2 uppercase">Check 1</p>
                   <p className="text-xs font-bold text-zinc-700">Did you paste your API key on Line 11 of Code.gs?</p>
                </div>
                <div className="p-6 bg-gray-50 rounded-3xl">
                   <p className="text-[10px] font-black text-zinc-400 mb-2 uppercase">Check 2</p>
                   <p className="text-xs font-bold text-zinc-700">Is "generativelanguage.googleapis.com" in your manifest whitelist?</p>
                </div>
                <div className="p-6 bg-gray-50 rounded-3xl">
                   <p className="text-[10px] font-black text-zinc-400 mb-2 uppercase">Check 3</p>
                   <p className="text-xs font-bold text-zinc-700">Did you run "TRIGGER_AUTH_POPUP" manually in the editor?</p>
                </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
