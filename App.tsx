
import React from 'react';
import { AppsScriptCode } from './components/AppsScriptCode';

const App: React.FC = () => {
  return (
    <div className="min-h-screen pb-24 font-sans text-gray-900 bg-[#f8f9fa]">
      <header className="bg-white border-b border-gray-100 py-6 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-amber-500 shadow-lg rotate-2">
               <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-2.135 0-4.128.833-5.637 2.346C4.885 10.031 4.05 12.022 4.05 14.155c0 1.341.34 2.645 1.012 3.811L3.922 22l4.133-1.085c1.233.673 2.618 1.026 3.974 1.026h.001c2.135 0 4.128-.833-5.637 2.346s2.345-3.513 2.345-5.64c0-2.136-.834-4.127-2.346-5.637s-3.513-2.146-5.635-2.146zm4.904 11.031c-.63 1.103-2.457 1.837-3.415 1.956-1.031.127-2.288.195-3.666-.234-2.616-.816-4.63-3.13-4.63-5.601 0-.961.341-1.921.961-2.58.558-.596 1.34-.942 2.115-.942.235 0 .47.05.648.067.432.043.648.083.896.643.321.72 1.042 2.508 1.135 2.686.095.178.16.384.043.6-.117.216-.178.35-.353.551-.176.201-.368.448-.526.6-.175.166-.358.347-.154.697.202.35.897 1.474 1.926 2.394 1.325 1.184 2.443 1.554 2.793 1.729.351.176.554.146.758-.083.204-.23.864-1.008 1.101-1.357.234-.351.469-.297.794-.176.326.121 2.067 1.018 2.422 1.196s.591.267.678.416c.088.148.088.853-.254 1.713z"/></svg>
            </div>
            <div>
              <h1 className="text-xl font-black text-gray-900 tracking-tight leading-none uppercase">Visual Bridge</h1>
              <p className="text-[10px] font-black text-amber-600 tracking-widest mt-1 uppercase">Standalone Mode v7.0</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-amber-500 rounded-full border border-amber-600 shadow-sm">
             <div className="w-1.5 h-1.5 rounded-full bg-black animate-pulse"></div>
             <span className="text-[9px] font-black text-black uppercase tracking-widest">SyntaxError Fixed</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 mt-12">
        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-black text-gray-900 mb-4 leading-tight">Fixing the <br/><span className="text-amber-600">"Unexpected Token &lt;"</span> Error</h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Your Apps Script was trying to read your website's <b>HTML code</b> as if it were a data image. We've fixed this by moving the AI processing directly into the Add-on.
            </p>
          </div>

          <AppsScriptCode />

          <div className="mt-16 bg-zinc-900 p-8 rounded-[2rem] text-zinc-400">
             <h3 className="text-sm font-black text-white mb-6 uppercase tracking-widest">Standalone Mode Benefits</h3>
             <ul className="text-[11px] space-y-4">
                <li className="flex gap-4">
                  <span className="text-amber-500 font-bold">✓</span>
                  <span><b>Zero Backend:</b> No need to maintain a Vercel/Next.js API. Apps Script calls Google directly.</span>
                </li>
                <li className="flex gap-4">
                  <span className="text-amber-500 font-bold">✓</span>
                  <span><b>No SyntaxErrors:</b> Because we aren't fetching your website URL for data, you won't get HTML responses.</span>
                </li>
                <li className="flex gap-4">
                  <span className="text-amber-500 font-bold">✓</span>
                  <span><b>Lower Latency:</b> Data stays within the Google cloud infrastructure.</span>
                </li>
             </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
