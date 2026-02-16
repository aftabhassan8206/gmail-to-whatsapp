
import React, { useState, useEffect } from 'react';

export const AppsScriptCode: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('https://your-deployed-app.web.app');

  useEffect(() => {
    // Detect the actual URL where this app is hosted
    if (typeof window !== 'undefined' && !window.location.hostname.includes('localhost')) {
      setCurrentUrl(window.location.origin);
    }
  }, []);

  const manifestCode = `{
  "timeZone": "Etc/GMT",
  "dependencies": {},
  "exceptionLogging": "STACKDRIVER",
  "runtimeVersion": "V8",
  "urlFetchWhitelist": [
    "https://wa.me/",
    "${currentUrl}/"
  ],
  "oauthScopes": [
    "https://www.googleapis.com/auth/gmail.addons.execute",
    "https://www.googleapis.com/auth/gmail.readonly",
    "https://www.googleapis.com/auth/script.locale",
    "https://www.googleapis.com/auth/script.external_request"
  ],
  "gmail": {
    "name": "WA Visualizer",
    "logoUrl": "https://www.gstatic.com/images/icons/material/system/2x/share_black_48dp.png",
    "contextualTriggers": [
      {
        "unconditional": {},
        "onTriggerFunction": "onGmailMessageOpen"
      }
    ],
    "primaryColor": "#25D366",
    "secondaryColor": "#075E54"
  }
}`;

  const gsCode = `/**
 * Professional WhatsApp Bridge for Gmail
 * This script is pre-configured for: ${currentUrl}
 */
function onGmailMessageOpen(e) {
  var cBuilder = CardService.newCardBuilder();
  try {
    var messageId = e.gmail.messageId;
    var message = GmailApp.getMessageById(messageId);
    var subject = message.getSubject() || '(No Subject)';
    var plainBody = message.getPlainBody();
    
    var header = CardService.newCardHeader()
      .setTitle('WhatsApp Bridge')
      .setSubtitle('Visual Sharing Ready')
      .setImageStyle(CardService.ImageStyle.CIRCLE)
      .setImageUrl('https://www.gstatic.com/images/icons/material/system/2x/share_black_48dp.png');
      
    cBuilder.setHeader(header);

    var section = CardService.newCardSection();

    section.addWidget(CardService.newTextParagraph()
      .setText("<b>Visual Mode:</b> Capture a high-quality screenshot of this email."));
    
    var visualizerUrl = "${currentUrl}";
    var visualBtn = CardService.newTextButton()
      .setText('✨ CAPTURE EMAIL IMAGE')
      .setOpenLink(CardService.newOpenLink().setUrl(visualizerUrl))
      .setTextButtonStyle(CardService.TextButtonStyle.FILLED);
    
    section.addWidget(visualBtn);

    section.addWidget(CardService.newDivider());
    section.addWidget(CardService.newTextParagraph()
      .setText("<b>Quick Summary:</b> Send text summary only."));

    var shareText = '*' + subject + '*\\n\\n' + plainBody.substring(0, 500) + '...';
    var whatsappUrl = 'https://wa.me/?text=' + encodeURIComponent(shareText);
    
    var textBtn = CardService.newTextButton()
      .setText('SEND TEXT SUMMARY')
      .setOpenLink(CardService.newOpenLink().setUrl(whatsappUrl))
      .setTextButtonStyle(CardService.TextButtonStyle.OUTLINED);
    
    section.addWidget(textBtn);

    cBuilder.addSection(section);
  } catch (err) {
    cBuilder.addSection(CardService.newCardSection()
      .addWidget(CardService.newTextParagraph().setText('Error: ' + err.toString())));
  }
  return cBuilder.build();
}`;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100">
          <p className="text-[10px] font-black text-amber-800 uppercase tracking-[0.2em] mb-1">Deployment Tip</p>
          <p className="text-[11px] text-amber-700 leading-relaxed font-medium">
            Ensure this web app is <b>deployed</b> before copying these scripts. The URLs are synced to your current domain.
          </p>
        </div>
        <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100">
          <p className="text-[10px] font-black text-purple-800 uppercase tracking-[0.2em] mb-1">Why an external app?</p>
          <p className="text-[11px] text-purple-700 leading-relaxed font-medium">
            Google Apps Script lacks a <b>DOM engine</b>. This React app acts as a "Visual Renderer" to turn HTML into high-res images.
          </p>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 mb-4 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-black text-blue-800 uppercase tracking-widest mb-1">Bridge URL Configured</p>
          <p className="text-sm font-bold text-blue-600 truncate max-w-[200px] sm:max-w-md">{currentUrl}</p>
        </div>
        <div className="bg-blue-500 text-white text-[10px] px-2 py-1 rounded-full font-black">ACTIVE</div>
      </div>
      
      <div>
        <h3 className="text-sm font-black text-gray-900 mb-3 uppercase tracking-widest flex items-center gap-2">
          1. Manifest <span className="text-[10px] font-normal text-gray-400 font-mono">(appsscript.json)</span>
        </h3>
        <div className="relative group">
          <pre className="bg-gray-900 text-green-400 p-5 rounded-2xl text-[11px] overflow-x-auto leading-relaxed border border-gray-800">
            {manifestCode}
          </pre>
          <button onClick={() => handleCopy(manifestCode)} className="absolute top-3 right-3 px-4 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-[10px] font-bold uppercase backdrop-blur-sm transition">
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-black text-gray-900 mb-3 uppercase tracking-widest flex items-center gap-2">
          2. Script <span className="text-[10px] font-normal text-gray-400 font-mono">(Code.gs)</span>
        </h3>
        <div className="relative group">
          <pre className="bg-gray-900 text-green-400 p-5 rounded-2xl text-[11px] overflow-x-auto max-h-[300px] leading-relaxed border border-gray-800">
            {gsCode}
          </pre>
          <button onClick={() => handleCopy(gsCode)} className="absolute top-3 right-3 px-4 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-[10px] font-bold uppercase backdrop-blur-sm transition">
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>
    </div>
  );
};
