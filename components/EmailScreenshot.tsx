
import React from 'react';

interface EmailScreenshotProps {
  html: string;
  subject: string;
  sender?: string;
}

export const EmailScreenshot: React.FC<EmailScreenshotProps> = ({ html, subject, sender = "Gmail User" }) => {
  // Clean the HTML if it's a full document to prevent double-body issues
  const cleanHtml = (raw: string) => {
    let content = raw;
    const bodyMatch = raw.match(/<body[^>]*>([\s\S]*)<\/body>/i);
    if (bodyMatch && bodyMatch[1]) {
      content = bodyMatch[1];
    }
    return content;
  };

  return (
    <div 
      id="email-capture-area"
      className="w-[600px] bg-white shadow-none font-sans"
      style={{ 
        minHeight: '400px',
        display: 'block',
        position: 'relative',
        backgroundColor: '#ffffff'
      }}
    >
      {/* Browser/Client Header */}
      <div className="bg-[#f1f3f4] px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
          <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
        </div>
        <div className="text-[11px] font-medium text-gray-500 uppercase tracking-widest">Email Message</div>
        <div className="w-10"></div>
      </div>

      {/* Email Metadata */}
      <div className="p-6 border-b border-gray-100 bg-white">
        <h1 className="text-xl font-bold text-gray-900 mb-4">{subject}</h1>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
            {sender.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-gray-900">{sender}</span>
              <span className="text-xs text-gray-400">&lt;no-reply@gmail.com&gt;</span>
            </div>
            <div className="text-[10px] text-gray-400">to me</div>
          </div>
        </div>
      </div>

      {/* Actual HTML Content */}
      <div className="p-8 bg-white overflow-hidden">
        <div 
          className="prose prose-sm max-w-none email-content-wrapper"
          style={{ overflowWrap: 'break-word' }}
          dangerouslySetInnerHTML={{ __html: cleanHtml(html) }}
        />
      </div>

      {/* Footer Branding */}
      <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
        <div className="text-[10px] font-bold text-gray-300 uppercase tracking-tighter">Shared via WhatsApp Bridge</div>
        <div className="text-[10px] text-gray-300">© 2024 Visual Emailer</div>
      </div>
    </div>
  );
};
