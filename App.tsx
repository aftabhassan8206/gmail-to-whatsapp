
import React, { useState, useRef } from 'react';
import { EmailScreenshot } from './components/EmailScreenshot';
import { AppsScriptCode } from './components/AppsScriptCode';
import * as htmlToImage from 'html-to-image';

const App: React.FC = () => {
  const [subject, setSubject] = useState(new URLSearchParams(window.location.search).get('subject') || '');
  const [sender, setSender] = useState(new URLSearchParams(window.location.search).get('sender') || 'Gmail User');
  const [html, setHtml] = useState('');
  const [stripImages, setStripImages] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [showAddonCode, setShowAddonCode] = useState(false);
  
  const previewRef = useRef<HTMLDivElement>(null);

  const handleExport = async () => {
    if (!previewRef.current) return;
    setIsCapturing(true);
    try {
      const dataUrl = await htmlToImage.toPng(previewRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: '#ffffff'
      });
      const link = document.createElement('a');
      link.download = `Email-${subject || 'visual'}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Capture failed', err);
      alert('Capture failed. Try enabling "Safe Mode" to strip external images.');
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-emerald-500/30">
      {/* Top Navigation */}
      <header className="border-b border-white/5 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-black shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tighter uppercase">Visual Bridge <span className="text-emerald-500">Studio</span></h1>
              <p className="text-[10px] font-bold text-zinc-500 tracking-[0.2em] uppercase">HTML to Visual Card Engine</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowAddonCode(!showAddonCode)}
              className="px-4 py-2 rounded-lg text-xs font-bold border border-white/10 hover:bg-white/5 transition"
            >
              {showAddonCode ? '← BACK TO STUDIO' : 'GET GMAIL ADD-ON'}
            </button>
            <button 
              onClick={handleExport}
              disabled={isCapturing || !html}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition shadow-lg ${
                isCapturing || !html 
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
                : 'bg-emerald-500 text-black hover:bg-emerald-400 active:scale-95'
              }`}
            >
              {isCapturing ? (
                <><div className="w-3 h-3 border-2 border-black/20 border-t-black rounded-full animate-spin"></div> CAPTURING...</>
              ) : (
                <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg> EXPORT PNG</>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto p-6 lg:p-10">
        {showAddonCode ? (
          <div className="max-w-4xl mx-auto">
             <div className="mb-10 text-center">
               <h2 className="text-3xl font-black mb-3">Add-on Integration</h2>
               <p className="text-zinc-400 text-sm">Follow these steps to link your Gmail directly to this Studio.</p>
             </div>
             <AppsScriptCode />
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Left: Input Panel */}
            <div className="w-full lg:w-1/3 space-y-6">
              <div className="bg-zinc-900 border border-white/5 p-6 rounded-3xl shadow-xl">
                <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-6">Configuration</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-2 ml-1">Subject Line</label>
                    <input 
                      type="text" 
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Enter email subject..."
                      className="w-full bg-zinc-800 border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 placeholder:text-zinc-600 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-2 ml-1">Sender Name</label>
                    <input 
                      type="text" 
                      value={sender}
                      onChange={(e) => setSender(e.target.value)}
                      placeholder="e.g. Amazon Support"
                      className="w-full bg-zinc-800 border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 placeholder:text-zinc-600 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-2 ml-1">HTML Content</label>
                    <textarea 
                      value={html}
                      onChange={(e) => setHtml(e.target.value)}
                      placeholder="Paste <html> or plain text here..."
                      className="w-full bg-zinc-800 border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 placeholder:text-zinc-600 transition h-64 font-mono text-[11px] resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-zinc-950/50 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center">
                        <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                      </div>
                      <span className="text-xs font-bold text-zinc-300">Safe Mode (Capture Speed)</span>
                    </div>
                    <button 
                      onClick={() => setStripImages(!stripImages)}
                      className={`w-10 h-5 rounded-full relative transition ${stripImages ? 'bg-emerald-500' : 'bg-zinc-700'}`}
                    >
                      <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${stripImages ? 'right-1' : 'left-1'}`}></div>
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-3xl">
                <p className="text-[10px] text-emerald-500 font-black uppercase mb-2 tracking-widest">Pro Tip</p>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Turn on <b>Safe Mode</b> if your capture looks empty. It strips external tracking images that sometimes block rendering.
                </p>
              </div>
            </div>

            {/* Right: Preview Panel */}
            <div className="flex-1 flex flex-col items-center">
              <div className="w-full max-w-[650px] relative">
                <div className="absolute -top-6 left-0 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Real-time Render Preview</span>
                </div>
                
                <div 
                  ref={previewRef}
                  className="rounded-3xl shadow-[0_40px_100px_rgba(0,0,0,0.4)] overflow-hidden bg-white"
                >
                  {html ? (
                    <EmailScreenshot 
                      html={html}
                      subject={subject}
                      sender={sender}
                      stripImages={stripImages}
                    />
                  ) : (
                    <div className="w-[600px] h-[600px] bg-white flex flex-col items-center justify-center text-center p-12">
                      <div className="w-20 h-20 bg-zinc-50 rounded-3xl flex items-center justify-center mb-6">
                        <svg className="w-10 h-10 text-zinc-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                      </div>
                      <h4 className="text-zinc-900 font-black text-xl mb-2">No Content to Render</h4>
                      <p className="text-zinc-400 text-sm max-w-xs leading-relaxed">
                        Paste your email HTML in the editor on the left to generate a visual preview.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="mt-20 border-t border-white/5 py-10">
        <div className="max-w-[1600px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition duration-500">
           <div className="text-[10px] font-black tracking-[0.3em] uppercase">Visual Bridge Studio © 2024</div>
           <div className="flex gap-10">
              <span className="text-[10px] font-bold uppercase tracking-widest">HTML-to-PNG Native</span>
              <span className="text-[10px] font-bold uppercase tracking-widest">Privacy Secured</span>
              <span className="text-[10px] font-bold uppercase tracking-widest">Zero AI Generation</span>
           </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
