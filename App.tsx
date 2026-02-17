
import React, { useState, useEffect } from 'react';
import * as htmlToImage from 'html-to-image';
import { EmailScreenshot } from './components/EmailScreenshot';
import { EmailCard } from './components/EmailCard';
import { AppsScriptCode } from './components/AppsScriptCode';
import { ProcessingStatus, VisualSummary } from './types';
import { generateVisualSummary } from './services/geminiService';

const App: React.FC = () => {
  const [subject, setSubject] = useState('');
  const [htmlContent, setHtmlContent] = useState('');
  const [mode, setMode] = useState<'raw' | 'ai'>('raw');
  const [stripImages, setStripImages] = useState(false);
  const [status, setStatus] = useState<ProcessingStatus>(ProcessingStatus.IDLE);
  const [aiSummary, setAiSummary] = useState<VisualSummary | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isEmbedded, setIsEmbedded] = useState(false);

  // Check for parameters from Gmail Add-on
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlSubject = params.get('subject');
    const urlBody = params.get('body');
    const urlMode = params.get('mode') as 'raw' | 'ai';

    if (urlSubject || urlBody) {
      setIsEmbedded(true);
      if (urlSubject) setSubject(decodeURIComponent(urlSubject));
      if (urlBody) setHtmlContent(decodeURIComponent(urlBody));
      if (urlMode) setMode(urlMode);
      
      if (urlSubject && urlBody) {
        setTimeout(() => handleProcess(decodeURIComponent(urlBody), decodeURIComponent(urlSubject), urlMode || 'raw'), 300);
      }
    }
  }, []);

  const handleProcess = async (manualHtml?: string, manualSubject?: string, manualMode?: 'raw' | 'ai') => {
    const activeHtml = manualHtml || htmlContent;
    const activeSubject = manualSubject || subject;
    const activeMode = manualMode || mode;

    if (!activeHtml || !activeSubject) {
      setError("Please ensure email content is present.");
      return;
    }

    setStatus(ProcessingStatus.LOADING);
    setError(null);
    setCapturedImage(null);

    try {
      if (activeMode === 'ai') {
        const summary = await generateVisualSummary(activeHtml, activeSubject);
        setAiSummary(summary);
      }
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      if (document.fonts) await document.fonts.ready;

      const elementId = activeMode === 'ai' ? 'email-screenshot-card' : 'email-capture-area';
      const node = document.getElementById(elementId);
      
      if (!node) throw new Error("Rendering node missing.");

      const dataUrl = await htmlToImage.toPng(node, {
        cacheBust: true,
        backgroundColor: '#ffffff',
        pixelRatio: 2,
        skipFonts: true,
        imagePlaceholder: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN8/x8AAuMB8DtXNjkAAAAASUVORK5CYII=',
      });

      setCapturedImage(dataUrl);
      setStatus(ProcessingStatus.SUCCESS);
    } catch (err: any) {
      console.error("Studio Capture Error:", err);
      setError(err.message || "Capture failed. Try Safe Mode or manual pasting.");
      setStatus(ProcessingStatus.ERROR);
    }
  };

  const downloadImage = () => {
    if (!capturedImage) return;
    const link = document.createElement('a');
    link.download = `Email_Bridge_${Date.now()}.png`;
    link.href = capturedImage;
    link.click();
  };

  if (isEmbedded) {
    return (
      <div className="min-h-screen bg-white p-4 flex flex-col font-sans">
        <div className="w-full max-w-lg mx-auto">
          <header className="flex items-center justify-between mb-4 border-b pb-4 border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#25D366] rounded-lg flex items-center justify-center text-white shadow-md">
                 <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-2.135 0-4.128.833-5.637 2.346C4.885 10.031 4.05 12.022 4.05 14.155c0 1.341.34 2.645 1.012 3.811L3.922 22l4.133-1.085c1.233.673 2.618 1.026 3.974 1.026h.001c2.135 0 4.128-.833 5.637-2.346s2.345-3.513 2.345-5.64c0-2.136-.834-4.127-2.346-5.637s-3.513-2.146-5.635-2.146zm4.904 11.031c-.63 1.103-2.457 1.837-3.415 1.956-1.031.127-2.288.195-3.666-.234-2.616-.816-4.63-3.13-4.63-5.601 0-.961.341-1.921.961-2.58.558-.596 1.34-.942 2.115-.942.235 0 .47.05.648.067.432.043.648.083.896.643.321.72 1.042 2.508 1.135 2.686.095.178.16.384.043.6-.117.216-.178.35-.353.551-.176.201-.368.448-.526.6-.175.166-.358.347-.154.697.202.35.897 1.474 1.926 2.394 1.325 1.184 2.443 1.554 2.793 1.729.351.176.554.146.758-.083.204-.23.864-1.008 1.101-1.357.234-.351.469-.297.794-.176.326.121 2.067 1.018 2.422 1.196s.591.267.678.416c.088.148.088.853-.254 1.713z"/></svg>
              </div>
              <div>
                <h1 className="text-xs font-black text-gray-900 leading-none">BRIDGE STUDIO</h1>
                <p className="text-[7px] text-green-600 font-bold uppercase tracking-widest mt-0.5">Gmail Integrated</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setIsEmbedded(false)} className="text-[9px] font-black text-gray-400 uppercase tracking-tighter px-2 py-1 bg-gray-50 rounded-md">Edit Manually</button>
            </div>
          </header>

          <div className="space-y-4">
            {status === ProcessingStatus.LOADING && (
              <div className="py-20 text-center">
                <div className="w-10 h-10 border-2 border-green-500/20 border-t-green-500 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Capturing Visual...</p>
              </div>
            )}

            {status === ProcessingStatus.SUCCESS && capturedImage && (
              <div className="animate-in fade-in zoom-in-95 duration-500">
                <img src={capturedImage} className="w-full rounded-2xl shadow-xl border border-gray-100 mb-6" alt="Capture" />
                <div className="grid grid-cols-2 gap-3 mb-6">
                   <button onClick={downloadImage} className="py-4 bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                     PNG
                   </button>
                   <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent('Shared via WA Visual Bridge!')}`, '_blank')} className="py-4 bg-[#25D366] text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
                     WhatsApp
                   </button>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <p className="text-[9px] font-black text-gray-400 uppercase mb-2">Notice</p>
                  <p className="text-[10px] text-gray-500 leading-tight">
                    This is a snippet view. If you need the full HTML rendering, click <b>Edit Manually</b> and paste the full email code.
                  </p>
                </div>
              </div>
            )}

            {status === ProcessingStatus.ERROR && (
              <div className="py-12 text-center bg-red-50 rounded-2xl border border-red-100">
                <p className="text-[10px] font-black uppercase text-red-500 mb-2">Render Failed</p>
                <button onClick={() => setIsEmbedded(false)} className="px-6 py-2 bg-gray-900 text-white rounded-lg text-[10px] font-black uppercase">Switch to Manual Mode</button>
              </div>
            )}
          </div>
        </div>

        {/* Hidden render nodes */}
        <div id="capture-container">
          {mode === 'raw' ? (
            <EmailScreenshot html={htmlContent} subject={subject} stripImages={stripImages} />
          ) : (
            aiSummary && <EmailCard summary={aiSummary} subject={subject} />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 font-sans text-gray-900 bg-[#f8f9fa]">
      <header className="bg-white border-b border-gray-100 py-4 sticky top-0 z-50 shadow-sm backdrop-blur-md bg-white/90">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#25D366] rounded-xl flex items-center justify-center text-white shadow-lg rotate-2">
               <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-2.135 0-4.128.833-5.637 2.346C4.885 10.031 4.05 12.022 4.05 14.155c0 1.341.34 2.645 1.012 3.811L3.922 22l4.133-1.085c1.233.673 2.618 1.026 3.974 1.026h.001c2.135 0 4.128-.833-5.637 2.346s2.345-3.513 2.345-5.64c0-2.136-.834-4.127-2.346-5.637s-3.513-2.146-5.635-2.146zm4.904 11.031c-.63 1.103-2.457 1.837-3.415 1.956-1.031.127-2.288.195-3.666-.234-2.616-.816-4.63-3.13-4.63-5.601 0-.961.341-1.921.961-2.58.558-.596 1.34-.942 2.115-.942.235 0 .47.05.648.067.432.043.648.083.896.643.321.72 1.042 2.508 1.135 2.686.095.178.16.384.043.6-.117.216-.178.35-.353.551-.176.201-.368.448-.526.6-.175.166-.358.347-.154.697.202.35.897 1.474 1.926 2.394 1.325 1.184 2.443 1.554 2.793 1.729.351.176.554.146.758-.083.204-.23.864-1.008 1.101-1.357.234-.351.469-.297.794-.176.326.121 2.067 1.018 2.422 1.196s.591.267.678.416c.088.148.088.853-.254 1.713z"/></svg>
            </div>
            <div>
              <h1 className="text-lg font-black text-gray-900 tracking-tight leading-none">WA Visual Bridge</h1>
              <p className="text-[9px] uppercase font-black text-green-600 tracking-widest mt-1">Capture Studio</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-8">
          <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-sm font-black text-gray-900 mb-6 uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-4 bg-green-500 rounded-full"></span>
              Bridge Composer
            </h2>
            
            <div className="space-y-4">
              <input 
                type="text" 
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Email Subject..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition text-sm font-medium"
              />
              <textarea 
                value={htmlContent}
                onChange={(e) => setHtmlContent(e.target.value)}
                placeholder="Paste Email HTML content here..."
                className="w-full h-48 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition font-mono text-xs leading-relaxed"
              />

              <div className={`p-4 rounded-xl border transition-all ${stripImages ? 'bg-green-50 border-green-100' : 'bg-blue-50 border-blue-100'}`}>
                <div className="flex items-center justify-between mb-2">
                   <div className="flex flex-col">
                     <span className={`text-[10px] font-black uppercase tracking-tight ${stripImages ? 'text-green-800' : 'text-blue-800'}`}>
                       {stripImages ? '✅ Safe Mode Active' : 'Normal Mode'}
                     </span>
                     <span className="text-[9px] text-gray-500 leading-none mt-1">
                       {stripImages ? 'External images are removed for stability.' : 'Attempting to load images from email.'}
                     </span>
                   </div>
                   <button 
                    onClick={() => setStripImages(!stripImages)}
                    className={`w-12 h-6 rounded-full relative transition-colors ${stripImages ? 'bg-green-500' : 'bg-gray-300'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${stripImages ? 'left-7' : 'left-1'}`}></div>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-xl">
                <button 
                  onClick={() => setMode('raw')}
                  className={`py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${mode === 'raw' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  Full View
                </button>
                <button 
                  onClick={() => setMode('ai')}
                  className={`py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${mode === 'ai' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  ✨ AI Card
                </button>
              </div>

              <button 
                onClick={() => handleProcess()}
                disabled={status === ProcessingStatus.LOADING}
                className={`w-full py-4 rounded-xl font-black text-white transition-all shadow-lg flex items-center justify-center gap-2 uppercase tracking-widest text-xs ${mode === 'ai' ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20' : 'bg-gray-900 hover:bg-black shadow-gray-900/20'} disabled:opacity-50`}
              >
                {status === ProcessingStatus.LOADING ? (
                   <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : mode === 'ai' ? 'Generate AI Visual' : 'Render Email Image'}
              </button>

              {error && (
                <div className="bg-red-50 p-4 rounded-xl border border-red-100 animate-in fade-in slide-in-from-top-2">
                  <p className="text-[10px] text-red-600 font-black uppercase tracking-tight mb-2">Capture Error</p>
                  <p className="text-[11px] text-red-500 font-medium leading-tight">{error}</p>
                </div>
              )}
            </div>
          </section>

          <section id="setup">
            <h2 className="text-sm font-black text-gray-900 mb-4 uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-4 bg-blue-500 rounded-full"></span>
              Apps Script Setup
            </h2>
            <AppsScriptCode />
          </section>
        </div>

        <div className="lg:col-span-7">
          <div className="bg-white rounded-[2.5rem] p-4 lg:p-8 min-h-[500px] border border-gray-100 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute top-4 right-6 text-[9px] font-black text-gray-300 uppercase tracking-widest">Studio Workspace</div>
            
            {status === ProcessingStatus.IDLE && (
              <div className="text-center space-y-4 opacity-30">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                   <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                </div>
                <p className="text-xs font-black uppercase tracking-widest text-gray-400">Canvas Ready</p>
              </div>
            )}

            {status === ProcessingStatus.LOADING && (
              <div className="text-center space-y-4">
                <div className="w-12 h-12 border-4 border-green-500/20 border-t-green-500 rounded-full animate-spin mx-auto"></div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Rendering high-res capture...</p>
              </div>
            )}

            {status === ProcessingStatus.SUCCESS && capturedImage && (
              <div className="w-full animate-in fade-in zoom-in-95 duration-500 flex flex-col items-center">
                <img src={capturedImage} className="max-w-full rounded-2xl shadow-2xl border border-gray-100 mb-8" alt="Visual" />
                <div className="flex gap-3 w-full max-w-sm">
                   <button 
                     onClick={downloadImage}
                     className="flex-1 py-3 bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition shadow-lg"
                   >
                     Download PNG
                   </button>
                   <button 
                     onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent('Shared from WA Visual Bridge Studio')}`, '_blank')}
                     className="flex-1 py-3 bg-[#25D366] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-green-600 transition shadow-lg shadow-green-500/20"
                   >
                     WhatsApp Share
                   </button>
                </div>
              </div>
            )}

            {status === ProcessingStatus.ERROR && (
               <div className="text-center space-y-4 max-w-xs">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto text-red-500">
                   <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                </div>
                <p className="text-[11px] font-black uppercase tracking-widest text-red-500">Capture Blocked</p>
                <p className="text-[10px] text-gray-400">Security restrictions prevented image generation. Please use <b>Safe Mode</b>.</p>
              </div>
            )}
          </div>

          <div id="capture-container">
            {mode === 'raw' ? (
              <EmailScreenshot html={htmlContent} subject={subject} stripImages={stripImages} />
            ) : (
              aiSummary && <EmailCard summary={aiSummary} subject={subject} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
