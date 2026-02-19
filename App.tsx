
import React from 'react';
import { AppsScriptCode } from './components/AppsScriptCode';
import { ServerCode } from './components/ServerCode';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-blue-500/30 overflow-x-hidden pb-20">
      {/* Navbar */}
      <header className="border-b border-white/5 bg-zinc-950/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-[0_0_30px_rgba(37,99,235,0.2)] rotate-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter uppercase leading-none">Visual <span className="text-blue-500">Bridge</span></h1>
              <p className="text-[9px] font-bold text-zinc-500 tracking-[0.3em] uppercase mt-1">Native Render Engine</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 rounded-full border border-blue-500/20">
             <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
             <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Studio Mode • Active</span>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto p-6 lg:p-12">
        {/* Intro */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          <div className="inline-block px-3 py-1 bg-zinc-900 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-6">
            Deployment Dashboard
          </div>
          <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tight leading-[1.1]">
            Transform Email HTML <br/>
            <span className="text-blue-600">Into Social Media Cards.</span>
          </h2>
          <p className="text-zinc-500 text-lg leading-relaxed max-w-2xl mx-auto">
            A zero-AI, high-fidelity pipeline. Capture emails with 100% precision using headless Chrome and serve them directly back to your Gmail Add-on.
          </p>
        </div>

        {/* The Pipeline Visualization */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="p-8 bg-zinc-900 border border-white/5 rounded-[2.5rem] relative group hover:border-blue-500/30 transition-all duration-500">
             <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-6">01</div>
             <h3 className="font-black text-lg mb-3">Add-on Trigger</h3>
             <p className="text-sm text-zinc-500 leading-relaxed">Runs inside Gmail. Detects the current thread and extracts the clean HTML body via Apps Script.</p>
          </div>
          <div className="p-8 bg-zinc-900 border border-white/5 rounded-[2.5rem] relative group hover:border-blue-500/30 transition-all duration-500">
             <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-6">02</div>
             <h3 className="font-black text-lg mb-3">Puppeteer Render</h3>
             <p className="text-sm text-zinc-500 leading-relaxed">Your Node.js API receives the HTML, renders it in a 600px viewport, and captures a PNG screenshot.</p>
          </div>
          <div className="p-8 bg-zinc-900 border border-white/5 rounded-[2.5rem] relative group hover:border-blue-500/30 transition-all duration-500">
             <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-6">03</div>
             <h3 className="font-black text-lg mb-3">Visual Result</h3>
             <p className="text-sm text-zinc-500 leading-relaxed">The Base64 image is sent back to Gmail. Users can preview and share the PNG via WhatsApp instantly.</p>
          </div>
        </div>

        {/* Code Blocks */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
          <ServerCode />
          <AppsScriptCode />
        </div>

        {/* Footer Support */}
        <div className="mt-20 border-t border-white/5 pt-20">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-12 rounded-[3rem] text-center shadow-[0_0_50px_rgba(37,99,235,0.1)]">
             <h3 className="text-3xl font-black mb-4">Ready for Production?</h3>
             <p className="text-blue-100/70 text-sm max-w-xl mx-auto mb-8 leading-relaxed">
               This pipeline avoids AI halluncinations and ensures your email captures look exactly as they do in the browser. Perfect for billing, newsletters, and receipts.
             </p>
             <div className="flex flex-wrap items-center justify-center gap-4">
                <div className="px-5 py-3 bg-white/10 backdrop-blur-md rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/10">Pixel Perfect</div>
                <div className="px-5 py-3 bg-white/10 backdrop-blur-md rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/10">No AI Lag</div>
                <div className="px-5 py-3 bg-white/10 backdrop-blur-md rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/10">1:1 HTML Match</div>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
