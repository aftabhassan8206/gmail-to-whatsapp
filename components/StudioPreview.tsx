
import React, { useState, useRef } from 'react';
import { toPng } from 'html-to-image';
import { EmailScreenshot } from './EmailScreenshot';
import { EmailCard } from './EmailCard';
import { VisualSummary } from '../types';

export const StudioPreview: React.FC = () => {
  const [renderMode, setRenderMode] = useState<'screenshot' | 'card'>('screenshot');
  const [html, setHtml] = useState('<div style="padding: 20px; background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0;"><h2 style="color: #1e293b; margin-bottom: 10px;">Welcome to Visual Bridge!</h2><p style="color: #64748b; line-height: 1.6;">This is a sample email body. Paste your own HTML in the editor to see how the engine renders it for WhatsApp sharing.</p><div style="margin-top: 20px; padding: 15px; background: #3b82f6; color: white; border-radius: 8px; text-align: center; font-weight: bold;">CONFIRM SUBSCRIPTION</div></div>');
  const [subject, setSubject] = useState('Welcome to the Future of Email');
  const [sender, setSender] = useState('Visual Bridge Team');
  
  const [summary, setSummary] = useState<VisualSummary>({
    themeColor: '#3b82f6',
    headline: 'Visual Bridge Active',
    senderName: 'Visual Bridge Team',
    summary: 'Your email rendering pipeline is now live. You can capture any HTML content as a high-fidelity image or a summarized insight card.',
    bulletPoints: [
      'Pixel-perfect rendering',
      'No AI hallucinations',
      'Direct WhatsApp sharing',
      'Retina scale output'
    ],
    callToAction: 'Get Started'
  });

  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  
  const captureRef = useRef<HTMLDivElement>(null);

  const handleCapture = async () => {
    const targetId = renderMode === 'screenshot' ? 'email-capture-area' : 'email-screenshot-card';
    const element = document.getElementById(targetId);
    if (!element) return;
    
    setIsCapturing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const dataUrl = await toPng(element, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: renderMode === 'screenshot' ? '#ffffff' : 'transparent',
      });
      
      setCapturedImage(dataUrl);
    } catch (err) {
      console.error('Capture failed:', err);
    } finally {
      setIsCapturing(false);
    }
  };

  const downloadImage = () => {
    if (!capturedImage) return;
    const link = document.createElement('a');
    link.download = `visual-bridge-${Date.now()}.png`;
    link.href = capturedImage;
    link.click();
  };

  return (
    <section className="mt-20">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg rotate-3">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </div>
        <div>
          <h2 className="text-3xl font-black tracking-tight uppercase">Live <span className="text-blue-500">Playground</span></h2>
          <p className="text-[10px] font-bold text-zinc-500 tracking-[0.3em] uppercase mt-1">Client-Side Simulation</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Editor Side */}
        <div className="space-y-6">
          <div className="bg-zinc-900 border border-white/5 p-8 rounded-[2.5rem]">
            <div className="flex p-1 bg-black/40 rounded-2xl border border-white/5 mb-8">
              <button 
                onClick={() => setRenderMode('screenshot')}
                className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition ${renderMode === 'screenshot' ? 'bg-blue-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                Full Screenshot
              </button>
              <button 
                onClick={() => setRenderMode('card')}
                className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition ${renderMode === 'card' ? 'bg-blue-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                Insight Card
              </button>
            </div>

            <div className="space-y-4">
              {renderMode === 'screenshot' ? (
                <>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Email Subject</label>
                    <input 
                      type="text" 
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500/50 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Sender Name</label>
                    <input 
                      type="text" 
                      value={sender}
                      onChange={(e) => setSender(e.target.value)}
                      className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500/50 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Email HTML Body</label>
                    <textarea 
                      value={html}
                      onChange={(e) => setHtml(e.target.value)}
                      rows={8}
                      className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:border-blue-500/50 transition resize-none"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Theme Color</label>
                      <input 
                        type="color" 
                        value={summary.themeColor}
                        onChange={(e) => setSummary({...summary, themeColor: e.target.value})}
                        className="w-full h-11 bg-black/40 border border-white/5 rounded-xl px-2 py-1 focus:outline-none focus:border-blue-500/50 transition cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Headline</label>
                      <input 
                        type="text" 
                        value={summary.headline}
                        onChange={(e) => setSummary({...summary, headline: e.target.value})}
                        className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500/50 transition"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Summary</label>
                    <textarea 
                      value={summary.summary}
                      onChange={(e) => setSummary({...summary, summary: e.target.value})}
                      rows={3}
                      className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500/50 transition resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Bullet Points (one per line)</label>
                    <textarea 
                      value={summary.bulletPoints.join('\n')}
                      onChange={(e) => setSummary({...summary, bulletPoints: e.target.value.split('\n')})}
                      rows={4}
                      className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500/50 transition resize-none"
                    />
                  </div>
                </>
              )}
            </div>

            <button 
              onClick={handleCapture}
              disabled={isCapturing}
              className="w-full mt-8 py-5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-blue-500/10 flex items-center justify-center gap-3"
            >
              {isCapturing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Rendering...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Generate Visual Card
                </>
              )}
            </button>
          </div>

          {capturedImage && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 p-8 rounded-[2.5rem] animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest text-emerald-400">Capture Ready</span>
                </div>
                <button 
                  onClick={downloadImage}
                  className="text-[10px] font-black uppercase tracking-widest text-emerald-400 hover:text-emerald-300 transition"
                >
                  Download PNG
                </button>
              </div>
              <img src={capturedImage} alt="Captured Email" className="w-full rounded-xl border border-white/5 shadow-2xl" />
            </div>
          )}
        </div>

        {/* Preview Side */}
        <div className="relative">
          <div className="sticky top-32">
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-blue-500/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
            
            <div className="relative overflow-hidden rounded-[2.5rem] border border-white/5 shadow-2xl bg-zinc-900 p-1">
              <div className="bg-zinc-950 rounded-[2.25rem] overflow-hidden">
                <div className="origin-top scale-[0.85] lg:scale-100 transition-transform flex justify-center p-4">
                  {renderMode === 'screenshot' ? (
                    <EmailScreenshot 
                      html={html}
                      subject={subject}
                      sender={sender}
                    />
                  ) : (
                    <EmailCard 
                      summary={summary}
                      subject={subject}
                    />
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex items-center justify-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">600px Viewport</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Retina Scale</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

