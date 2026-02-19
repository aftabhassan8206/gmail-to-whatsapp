
import React, { useState, useRef, useEffect } from 'react';
import { EmailScreenshot } from './components/EmailScreenshot';
import { AppsScriptCode } from './components/AppsScriptCode';
import * as htmlToImage from 'html-to-image';

const App: React.FC = () => {
  const [subject, setSubject] = useState('');
  const [sender, setSender] = useState('');
  const [html, setHtml] = useState('');
  const [stripImages, setStripImages] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [showAddonCode, setShowAddonCode] = useState(false);
  
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSubject(params.get('subject') || '');
    setSender(params.get('sender') || 'Gmail User');
  }, []);

  const handleExport = async () => {
    if (!previewRef.current) return;
    setIsCapturing(true);
    try {
      // We use pixelRatio 2 for retina quality
      const dataUrl = await htmlToImage.toPng(previewRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: '#ffffff',
        skipAutoScale: true
      });
      
      const link = document.createElement('a');
      link.download = `Email-${subject.replace(/[^a-z0-9]/gi, '_') || 'capture'}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Capture failed', err);
      alert('Capture failed. This usually happens with large external images. Try turning on "Safe Mode" and try again.');
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-emerald-500/30 overflow-x-hidden">
      {/* Glassmorphism Header */}
      <header className="border-b border-white/5 bg-zinc-950/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 bg-emerald-500 rounded-2xl flex items-center justify-center text-black shadow-[0_0_30px_rgba(16,185,129,0.2)] rotate-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter uppercase leading-none">Visual Bridge</h1>
              <p className="text-[9px] font-bold text-zinc-500 tracking-[0.3em] uppercase mt-1">Professional PNG Engine</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowAddonCode(!showAddonCode)}
              className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all border ${
                showAddonCode 
                ? 'bg-zinc-800 border-zinc-700 text-zinc-400' 
                : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
              }`}
            >
              {showAddonCode ? 'Studio Interface' : 'Add-on Code'}
            </button>
            <button 
              onClick={handleExport}
              disabled={isCapturing || !html}
              className={`flex items-center gap-3 px-8 py-3 rounded-xl text-xs font-black uppercase tracking-[0.15em] transition shadow-2xl ${
                isCapturing || !html 
                ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed border border-white/5' 
                : 'bg-emerald-500 text-black hover:bg-emerald-400 active:scale-95 shadow-emerald-500/20'
              }`}
            >
              {isCapturing ? (
                <><div className="w-3.5 h-3.5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div> Processing...</>
              ) : (
                <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg> Export Visual</>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto p-6 lg:p-12">
        {showAddonCode ? (
          <div className="max-w-4xl mx-auto py-10">
             <div className="mb-12 text-center">
               <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] mb-4 block">Integration Guide</span>
               <h2 className="text-4xl font-black mb-4 tracking-tight">Bridge your Gmail to the Studio</h2>
               <p className="text-zinc-500 text-base max-w-xl mx-auto">
                 Copy these snippets into your Google Apps Script project to allow one-click transfers from any email into this converter.
               </p>
             </div>
             <AppsScriptCode />
          </div>
        ) : (
          <div className="flex flex-col xl:flex-row gap-12 items-start">
            {/* Control Panel */}
            <div className="w-full xl:w-[420px] shrink-0 space-y-8 sticky top-32">
              <div className="bg-zinc-900/50 border border-white/5 p-8 rounded-[2.5rem] shadow-2xl backdrop-blur-sm">
                <h3 className="text-xs font-black text-zinc-600 uppercase tracking-[0.3em] mb-8">Metadata Configuration</h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-zinc-500 uppercase mb-3 ml-1 tracking-widest">Subject Line</label>
                    <input 
                      type="text" 
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g. Your Order Confirmation"
                      className="w-full bg-zinc-800/50 border border-white/5 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 placeholder:text-zinc-700 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-zinc-500 uppercase mb-3 ml-1 tracking-widest">Sender Name</label>
                    <input 
                      type="text" 
                      value={sender}
                      onChange={(e) => setSender(e.target.value)}
                      placeholder="e.g. Amazon.com"
                      className="w-full bg-zinc-800/50 border border-white/5 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 placeholder:text-zinc-700 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-zinc-500 uppercase mb-3 ml-1 tracking-widest">Raw HTML Source</label>
                    <textarea 
                      value={html}
                      onChange={(e) => setHtml(e.target.value)}
                      placeholder="Paste <html> source code here..."
                      className="w-full bg-zinc-800/50 border border-white/5 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 placeholder:text-zinc-700 transition h-56 font-mono text-[11px] leading-relaxed resize-none"
                    />
                  </div>

                  <div className="pt-4">
                    <button 
                      onClick={() => setStripImages(!stripImages)}
                      className={`w-full flex items-center justify-between p-5 rounded-2xl border transition-all ${
                        stripImages 
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                        : 'bg-zinc-800/30 border-white/5 text-zinc-500 hover:bg-zinc-800/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${stripImages ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-zinc-600'}`}></div>
                        <span className="text-[11px] font-black uppercase tracking-wider">Safe Rendering Mode</span>
                      </div>
                      <div className={`w-10 h-6 rounded-full relative transition ${stripImages ? 'bg-emerald-500' : 'bg-zinc-700'}`}>
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${stripImages ? 'right-1' : 'left-1'}`}></div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-zinc-900/30 border border-white/5 rounded-[2.5rem]">
                <div className="flex items-center gap-3 mb-4">
                  <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  <p className="text-[11px] font-black uppercase text-zinc-400 tracking-widest">Capture Stability</p>
                </div>
                <p className="text-[11px] text-zinc-500 leading-relaxed font-medium">
                  Gmail HTML often includes tracking images from external domains that prevent clean captures. Enable <b>Safe Rendering</b> if your export contains blank spaces or fails.
                </p>
              </div>
            </div>

            {/* Preview Section */}
            <div className="flex-1 w-full flex flex-col items-center xl:pt-10">
              <div className="w-full max-w-[650px] relative group">
                <div className="absolute -top-12 left-0 flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.3)]"></div>
                  <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em]">Live Studio Canvas</span>
                </div>
                
                <div className="relative rounded-[2.5rem] overflow-hidden shadow-[0_60px_120px_-20px_rgba(0,0,0,0.8)] border border-white/5">
                  <div 
                    ref={previewRef}
                    className="bg-white"
                  >
                    {html ? (
                      <EmailScreenshot 
                        html={html}
                        subject={subject}
                        sender={sender}
                        stripImages={stripImages}
                      />
                    ) : (
                      <div className="w-[600px] h-[600px] bg-white flex flex-col items-center justify-center text-center p-16">
                        <div className="w-24 h-24 bg-zinc-50 rounded-[2rem] flex items-center justify-center mb-10 text-zinc-100">
                          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
                        </div>
                        <h4 className="text-zinc-900 font-black text-2xl mb-4 tracking-tight uppercase">Ready for Input</h4>
                        <p className="text-zinc-400 text-sm font-medium max-w-[280px] leading-relaxed mx-auto">
                          Paste your email HTML content into the editor to generate your visual card.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Decorative Elements */}
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none"></div>
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none"></div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="mt-32 border-t border-white/5 py-12 bg-zinc-950">
        <div className="max-w-[1400px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="flex flex-col gap-2">
             <div className="text-[10px] font-black tracking-[0.4em] uppercase text-zinc-700">Visual Bridge Engine v4.0.0</div>
             <p className="text-[9px] font-bold text-zinc-800 uppercase tracking-widest">© 2024 High Precision Imaging</p>
           </div>
           <div className="flex gap-12">
              <div className="flex flex-col gap-1 text-right">
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Native Capture</span>
                <span className="text-[9px] font-bold text-zinc-700 uppercase tracking-tighter">No Server Latency</span>
              </div>
              <div className="flex flex-col gap-1 text-right">
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">WhatsApp Optimized</span>
                <span className="text-[9px] font-bold text-zinc-700 uppercase tracking-tighter">Retina PNG Support</span>
              </div>
           </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
