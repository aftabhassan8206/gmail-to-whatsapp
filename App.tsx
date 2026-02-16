
import React, { useState, useRef } from 'react';
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
  const [status, setStatus] = useState<ProcessingStatus>(ProcessingStatus.IDLE);
  const [aiSummary, setAiSummary] = useState<VisualSummary | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleProcess = async () => {
    if (!htmlContent || !subject) {
      setError("Please provide both a subject and the email content.");
      return;
    }

    setStatus(ProcessingStatus.LOADING);
    setError(null);
    setCapturedImage(null);

    try {
      if (mode === 'ai') {
        const summary = await generateVisualSummary(htmlContent, subject);
        setAiSummary(summary);
      }
      
      // Wait for React to render the component and for fonts to load
      await new Promise(resolve => setTimeout(resolve, 800));
      if (document.fonts) await document.fonts.ready;

      const elementId = mode === 'ai' ? 'email-screenshot-card' : 'email-capture-area';
      const node = document.getElementById(elementId);
      
      if (!node) throw new Error("Capture target not found in DOM.");

      const dataUrl = await htmlToImage.toPng(node, {
        cacheBust: true,
        backgroundColor: '#ffffff',
        pixelRatio: 2,
      });

      setCapturedImage(dataUrl);
      setStatus(ProcessingStatus.SUCCESS);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to process email.");
      setStatus(ProcessingStatus.ERROR);
    }
  };

  const downloadImage = () => {
    if (!capturedImage) return;
    const link = document.createElement('a');
    link.download = `Email_Visual_${Date.now()}.png`;
    link.href = capturedImage;
    link.click();
  };

  return (
    <div className="min-h-screen pb-24 font-sans text-gray-900 bg-[#f8f9fa]">
      <header className="bg-white border-b border-gray-100 py-4 sticky top-0 z-50 shadow-sm backdrop-blur-md bg-white/90">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#25D366] rounded-xl flex items-center justify-center text-white shadow-lg rotate-2">
               <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-2.135 0-4.128.833-5.637 2.346C4.885 10.031 4.05 12.022 4.05 14.155c0 1.341.34 2.645 1.012 3.811L3.922 22l4.133-1.085c1.233.673 2.618 1.026 3.974 1.026h.001c2.135 0 4.128-.833 5.637-2.346s2.345-3.513 2.345-5.64c0-2.136-.834-4.127-2.346-5.637s-3.513-2.146-5.635-2.146zm4.904 11.031c-.63 1.103-2.457 1.837-3.415 1.956-1.031.127-2.288.195-3.666-.234-2.616-.816-4.63-3.13-4.63-5.601 0-.961.341-1.921.961-2.58.558-.596 1.34-.942 2.115-.942.235 0 .47.05.648.067.432.043.648.083.896.643.321.72 1.042 2.508 1.135 2.686.095.178.16.384.043.6-.117.216-.178.35-.353.551-.176.201-.368.448-.526.6-.175.166-.358.347-.154.697.202.35.897 1.474 1.926 2.394 1.325 1.184 2.443 1.554 2.793 1.729.351.176.554.146.758-.083.204-.23.864-1.008 1.101-1.357.234-.351.469-.297.794-.176.326.121 2.067 1.018 2.422 1.196s.591.267.678.416c.088.148.088.853-.254 1.713z"/></svg>
            </div>
            <div>
              <h1 className="text-lg font-black text-gray-900 tracking-tight leading-none">WA Visual Bridge</h1>
              <p className="text-[9px] uppercase font-black text-green-600 tracking-widest mt-1">AI-Powered Rendering</p>
            </div>
          </div>
          <div className="flex gap-4">
             <a href="#setup" className="text-[11px] font-bold text-gray-500 hover:text-green-600 transition uppercase tracking-widest">Setup Add-on</a>
             <a href="#hosting" className="text-[11px] font-bold text-gray-500 hover:text-blue-600 transition uppercase tracking-widest">How to Host</a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Configuration */}
        <div className="lg:col-span-5 space-y-8">
          <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-sm font-black text-gray-900 mb-6 uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-4 bg-green-500 rounded-full"></span>
              Input Content
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

              <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-xl">
                <button 
                  onClick={() => setMode('raw')}
                  className={`py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${mode === 'raw' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  Raw Capture
                </button>
                <button 
                  onClick={() => setMode('ai')}
                  className={`py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${mode === 'ai' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  ✨ AI Summary
                </button>
              </div>

              <button 
                onClick={handleProcess}
                disabled={status === ProcessingStatus.LOADING}
                className={`w-full py-4 rounded-xl font-black text-white transition-all shadow-lg flex items-center justify-center gap-2 uppercase tracking-widest text-xs ${mode === 'ai' ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20' : 'bg-gray-900 hover:bg-black shadow-gray-900/20'} disabled:opacity-50`}
              >
                {status === ProcessingStatus.LOADING ? (
                   <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : mode === 'ai' ? 'Generate AI Visual' : 'Capture Raw View'}
              </button>

              {error && <p className="text-[10px] text-red-500 font-bold bg-red-50 p-3 rounded-lg border border-red-100 uppercase tracking-tighter">{error}</p>}
            </div>
          </section>

          <section id="setup" className="scroll-mt-24">
            <h2 className="text-sm font-black text-gray-900 mb-4 uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-4 bg-blue-500 rounded-full"></span>
              Google Apps Script Code
            </h2>
            <AppsScriptCode />
          </section>

          <section id="hosting" className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-3xl text-white scroll-mt-24">
            <h2 className="text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              How to Host (Free)
            </h2>
            <ul className="space-y-4 text-[11px] text-gray-400">
               <li className="flex gap-3">
                 <span className="w-5 h-5 bg-white/10 rounded-full flex items-center justify-center text-white font-bold shrink-0">1</span>
                 <p>Create an account on <b>Vercel.com</b> or <b>Netlify.com</b>.</p>
               </li>
               <li className="flex gap-3">
                 <span className="w-5 h-5 bg-white/10 rounded-full flex items-center justify-center text-white font-bold shrink-0">2</span>
                 <p>Upload this code folder or connect your GitHub repository.</p>
               </li>
               <li className="flex gap-3">
                 <span className="w-5 h-5 bg-white/10 rounded-full flex items-center justify-center text-white font-bold shrink-0">3</span>
                 <p>Once deployed, your app will have a URL like <code>your-app.vercel.app</code>. The scripts above will update automatically!</p>
               </li>
            </ul>
          </section>
        </div>

        {/* Right: Studio */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-[2.5rem] p-4 lg:p-8 min-h-[500px] border border-gray-100 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute top-4 right-6 text-[9px] font-black text-gray-300 uppercase tracking-widest">Preview Studio</div>
            
            {status === ProcessingStatus.IDLE && (
              <div className="text-center space-y-4 opacity-30">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                   <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                </div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Canvas Ready</p>
              </div>
            )}

            {status === ProcessingStatus.LOADING && (
              <div className="text-center space-y-4">
                <div className="w-12 h-12 border-4 border-green-500/20 border-t-green-500 rounded-full animate-spin mx-auto"></div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Processing Visuals...</p>
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
                     onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent('Check out this visual email summary! (Attach image manually)')}`, '_blank')}
                     className="flex-1 py-3 bg-[#25D366] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-green-600 transition shadow-lg shadow-green-500/20"
                   >
                     Share to WhatsApp
                   </button>
                </div>
              </div>
            )}
          </div>

          {/* Hidden Capture Area */}
          <div className="fixed top-0 left-[-9999px]">
            {mode === 'raw' ? (
              <EmailScreenshot html={htmlContent} subject={subject} />
            ) : (
              aiSummary && <EmailCard summary={aiSummary} subject={subject} />
            )}
          </div>
        </div>
      </main>

      <footer className="max-w-7xl mx-auto px-4 mt-20 pt-10 border-t border-gray-100 text-center">
         <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">Built for Gmail Add-on v2 & AI Visual Bridge Architecture</p>
      </footer>
    </div>
  );
};

export default App;
