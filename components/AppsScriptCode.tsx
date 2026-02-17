
import React, { useState, useEffect } from 'react';

export const AppsScriptCode: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('https://your-deployed-app.web.app');

  useEffect(() => {
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
 * Professional WhatsApp Bridge for Gmail (Integrated Mode)
 */
function onGmailMessageOpen(e) {
  var cBuilder = CardService.newCardBuilder();
  try {
    var messageId = e.gmail.messageId;
    var message = GmailApp.getMessageById(messageId);
    var subject = message.getSubject() || '(No Subject)';
    var body = message.getBody(); // Get HTML body
    
    // Clean body for URL passing (limit size)
    var bodySnippet = body.substring(0, 1500).replace(/\\n/g, ' '); 

    var header = CardService.newCardHeader()
      .setTitle('WhatsApp Bridge')
      .setSubtitle('Visual Studio Pro')
      .setImageStyle(CardService.ImageStyle.CIRCLE)
      .setImageUrl('https://www.gstatic.com/images/icons/material/system/2x/share_black_48dp.png');
      
    cBuilder.setHeader(header);

    var section = CardService.newCardSection();

    section.addWidget(CardService.newTextParagraph()
      .setText("<b>Direct Integrated Capture:</b> Convert this email into a shareable image instantly."));
    
    // Construct Auto-Bridge URL
    var bridgeUrl = "${currentUrl}/?mode=raw" + 
                    "&subject=" + encodeURIComponent(subject) + 
                    "&body=" + encodeURIComponent(bodySnippet);

    var visualBtn = CardService.newTextButton()
      .setText('📸 CAPTURE IN-APP')
      .setOpenLink(CardService.newOpenLink()
        .setUrl(bridgeUrl)
        .setOpenAs(CardService.OpenAs.OVERLAY) // INTEGRATED MODE: Opens as a modal inside Gmail
      )
      .setTextButtonStyle(CardService.TextButtonStyle.FILLED);
    
    section.addWidget(visualBtn);

    section.addWidget(CardService.newDivider());
    section.addWidget(CardService.newTextParagraph()
      .setText("<b>AI Smart Card:</b> Create a professionally designed summary card."));

    var aiUrl = "${currentUrl}/?mode=ai" + 
                "&subject=" + encodeURIComponent(subject) + 
                "&body=" + encodeURIComponent(bodySnippet);
                
    var aiBtn = CardService.newTextButton()
      .setText('✨ GENERATE AI CARD')
      .setOpenLink(CardService.newOpenLink()
        .setUrl(aiUrl)
        .setOpenAs(CardService.OpenAs.OVERLAY)
      )
      .setTextButtonStyle(CardService.TextButtonStyle.OUTLINED);
    
    section.addWidget(aiBtn);

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
        <div className="bg-green-50 p-4 rounded-2xl border border-green-100">
          <p className="text-[10px] font-black text-green-800 uppercase tracking-[0.2em] mb-1">New: Integrated Mode</p>
          <p className="text-[11px] text-green-700 leading-relaxed font-medium">
            This updated script uses <b>OVERLAY</b> mode. The bridge will now open as a modal <i>inside</i> Gmail, not in a new tab.
          </p>
        </div>
        <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
          <p className="text-[10px] font-black text-blue-800 uppercase tracking-[0.2em] mb-1">Auto-Processing</p>
          <p className="text-[11px] text-blue-700 leading-relaxed font-medium">
            Subject and body are now passed automatically. The capture will start the second you click.
          </p>
        </div>
      </div>

      <div className="bg-gray-900 p-4 rounded-2xl border border-gray-800 mb-4 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-black text-green-400 uppercase tracking-widest mb-1">Active Studio URL</p>
          <p className="text-sm font-bold text-white truncate max-w-[200px] sm:max-w-md font-mono">{currentUrl}</p>
        </div>
        <div className="flex gap-2">
           <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-black text-gray-900 mb-3 uppercase tracking-widest flex items-center gap-2">
          1. Manifest <span className="text-[10px] font-normal text-gray-400 font-mono">(appsscript.json)</span>
        </h3>
        <div className="relative group">
          <pre className="bg-gray-50 text-gray-700 p-5 rounded-2xl text-[11px] overflow-x-auto leading-relaxed border border-gray-200">
            {manifestCode}
          </pre>
          <button onClick={() => handleCopy(manifestCode)} className="absolute top-3 right-3 px-4 py-1.5 bg-gray-900 hover:bg-black text-white rounded-lg text-[10px] font-bold uppercase transition">
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-black text-gray-900 mb-3 uppercase tracking-widest flex items-center gap-2">
          2. Script <span className="text-[10px] font-normal text-gray-400 font-mono">(Code.gs)</span>
        </h3>
        <div className="relative group">
          <pre className="bg-gray-50 text-gray-700 p-5 rounded-2xl text-[11px] overflow-x-auto max-h-[300px] leading-relaxed border border-gray-200">
            {gsCode}
          </pre>
          <button onClick={() => handleCopy(gsCode)} className="absolute top-3 right-3 px-4 py-1.5 bg-gray-900 hover:bg-black text-white rounded-lg text-[10px] font-bold uppercase transition">
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>
    </div>
  );
};
