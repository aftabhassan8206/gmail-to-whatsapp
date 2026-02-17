
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
    
    // 1. Extract body content if it's a full HTML document
    const bodyMatch = raw.match(/<body[^>]*>([\s\S]*)<\/body>/i);
    if (bodyMatch && bodyMatch[1]) {
      content = bodyMatch[1];
    }

    // 2. Stripping logic based on user preference
    if (stripImages) {
      // Safe Mode: Aggressively remove all possible sources of capture failure
      content = content.replace(/<img[^>]*>/gi, '<div style="background: #f8f9fa; border: 1px dashed #e2e8f0; padding: 12px; font-size: 10px; color: #94a3b8; text-align: center; border-radius: 8px; margin: 10px 0;">[IMAGE STRIPPED FOR SAFE MODE]</div>');
      
      // Remove background images from style attributes
      content = content.replace(/background-image:[^;]*;/gi, 'background-image: none !important;');
      content = content.replace(/background:[^;]*url\([^)]*\)[^;]*/gi, 'background: #f8f9fa !important;');
      
      // Remove external fonts/imports
      content = content.replace(/@import[^;]*;/gi, '');
      content = content.replace(/@font-face\s*{[^}]*}/gi, '');
    } else {
      // Normal Mode: We allow images to stay. 
      // We only normalize them to ensure they don't break layout.
      content = content.replace(/<img/gi, '<img crossorigin="anonymous"');
    }

    return content;
  };

  return (
    <div 
      id="email-capture-area"
      className="w-[600px] bg-white shadow-none font-sans overflow-hidden"
      style={{ 
        minHeight: '400px',
        display: 'block',
        position: 'relative',
        backgroundColor: '#ffffff'
      }}
    >
      {/* Client Frame */}
      <div className="bg-[#f1f3f4] px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></div>
        </div>
        <div className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Visual Bridge Secure Render</div>
        <div className="w-8"></div>
      </div>

      {/* Email Metadata */}
      <div className="p-8 border-b border-gray-100 bg-white">
        <h1 className="text-2xl font-black text-gray-900 mb-6 leading-tight">{subject || 'No Subject'}</h1>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#25D366] to-[#075E54] flex items-center justify-center text-white font-black text-lg shadow-lg">
            {sender.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-black text-sm text-gray-900 tracking-tight">{sender}</span>
              <span className="text-[9px] font-black text-green-600 px-1.5 py-0.5 bg-green-50 rounded uppercase tracking-tighter border border-green-100">WhatsApp Ready</span>
            </div>
            <div className="text-[11px] font-medium text-gray-400">Received via Gmail Bridge</div>
          </div>
        </div>
      </div>

      {/* Email Body Content */}
      <div className="p-8 bg-white">
        <div 
          className="prose prose-sm max-w-none email-content-wrapper"
          style={{ 
            overflowWrap: 'break-word',
            wordBreak: 'break-word',
            fontSize: '14px',
            color: '#334155'
          }}
          dangerouslySetInnerHTML={{ __html: cleanHtml(html) }}
        />
      </div>

      {/* Footer Branding */}
      <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Secured Visual Bridge Capture</span>
        </div>
        <div className="text-[9px] font-bold text-gray-300">VERSION 3.1.0-PRO</div>
      </div>
    </div>
  );
};
