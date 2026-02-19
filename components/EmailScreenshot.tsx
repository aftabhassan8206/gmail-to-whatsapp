
import React from 'react';

interface EmailScreenshotProps {
  html: string;
  subject: string;
  sender?: string;
  stripImages?: boolean;
}

export const EmailScreenshot: React.FC<EmailScreenshotProps> = ({ html, subject, sender = "Gmail User", stripImages = false }) => {
  const cleanHtml = (raw: string) => {
    let content = raw;
    
    // Extract body content if it's a full HTML document
    const bodyMatch = raw.match(/<body[^>]*>([\s\S]*)<\/body>/i);
    if (bodyMatch && bodyMatch[1]) {
      content = bodyMatch[1];
    }

    if (stripImages) {
      // Remove images that might block rendering or cross-origin captures
      content = content.replace(/<img[^>]*>/gi, '<div style="background: #f1f5f9; border: 1px dashed #cbd5e1; padding: 12px; font-size: 10px; color: #64748b; text-align: center; border-radius: 8px; margin: 10px 0;">[IMAGE REMOVED FOR CAPTURE STABILITY]</div>');
      content = content.replace(/background-image:[^;]*;/gi, 'background-image: none !important;');
    } else {
      // Standardize images for capture
      content = content.replace(/<img/gi, '<img crossorigin="anonymous" style="max-width:100%; height:auto;"');
    }

    return content;
  };

  return (
    <div 
      id="email-capture-area"
      className="w-[600px] bg-white shadow-none font-sans overflow-hidden"
      style={{ 
        minHeight: '200px',
        display: 'block',
        position: 'relative',
        backgroundColor: '#ffffff',
        color: '#1f2937'
      }}
    >
      {/* OS Frame UI */}
      <div className="bg-[#f8fafc] px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ef4444]"></div>
          <div className="w-3 h-3 rounded-full bg-[#fbbf24]"></div>
          <div className="w-3 h-3 rounded-full bg-[#22c55e]"></div>
        </div>
        <div className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">Visual Bridge Engine</div>
        <div className="w-10"></div>
      </div>

      {/* Header Info */}
      <div className="p-10 border-b border-gray-50 bg-white">
        <h1 className="text-3xl font-black text-gray-900 mb-6 leading-[1.1] tracking-tight">
          {subject || 'Untitled Email'}
        </h1>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-[1.25rem] bg-zinc-900 flex items-center justify-center text-white font-black text-xl shadow-xl shadow-zinc-200">
            {sender.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-black text-base text-gray-900">{sender}</span>
              <span className="text-[9px] font-black bg-emerald-50 text-emerald-600 px-2 py-1 rounded-md border border-emerald-100 uppercase tracking-wider">Verified Source</span>
            </div>
            <div className="text-xs font-medium text-gray-400 mt-0.5">Transferred via Secure Bridge</div>
          </div>
        </div>
      </div>

      {/* Actual Email HTML */}
      <div className="p-10 bg-white min-h-[100px]">
        <style dangerouslySetInnerHTML={{ __html: `
          .email-content-wrapper * { max-width: 100% !important; box-sizing: border-box !important; }
          .email-content-wrapper img { height: auto !important; display: block; margin: 10px 0; }
        `}} />
        <div 
          className="prose prose-sm max-w-none email-content-wrapper text-gray-700 leading-relaxed"
          style={{ fontSize: '15px' }}
          dangerouslySetInnerHTML={{ __html: cleanHtml(html) }}
        />
      </div>

      {/* Branded Footer */}
      <div className="p-8 bg-[#fafafa] border-t border-gray-50 flex justify-between items-center mt-10">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">High Fidelity Conversion</span>
        </div>
        <div className="text-[10px] font-black text-gray-200 uppercase tracking-widest tracking-tighter">VB-STUDIO-V4</div>
      </div>
    </div>
  );
};
