
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
    "name": "WA Bridge",
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
 * Visual Bridge for Gmail - Fixed Length Integration
 * This version prevents "URL cannot be used" errors by truncating data.
 */
function onGmailMessageOpen(e) {
  var cBuilder = CardService.newCardBuilder();
  try {
    var messageId = e.gmail.messageId;
    var message = GmailApp.getMessageById(messageId);
    var subject = message.getSubject() || '(No Subject)';
    
    // CRITICAL FIX: Limit body size to 500 chars. 
    // Gmail Add-ons reject URLs that are too long (approx 2KB total).
    var bodySnippet = message.getPlainBody().substring(0, 500); 

    var header = CardService.newCardHeader()
      .setTitle('WhatsApp Bridge')
      .setSubtitle('Visual Capture Studio');
      
    cBuilder.setHeader(header);

    var section = CardService.newCardSection();

    section.addWidget(CardService.newTextParagraph()
      .setText("<b>Quick Capture:</b> Creates a visual summary based on the email snippet."));
    
    // Construct Safe URL
    var bridgeUrl = "${currentUrl}/?mode=raw" + 
                    "&subject=" + encodeURIComponent(subject.substring(0, 100)) + 
                    "&body=" + encodeURIComponent(bodySnippet);

    var visualBtn = CardService.newTextButton()
      .setText('📸 OPEN CAPTURE STUDIO')
      .setOpenLink(CardService.newOpenLink()
        .setUrl(bridgeUrl)
        .setOpenAs(CardService.OpenAs.OVERLAY)
      )
      .setTextButtonStyle(CardService.TextButtonStyle.FILLED);
    
    section.addWidget(visualBtn);

    section.addWidget(CardService.newDivider());
    section.addWidget(CardService.newTextParagraph()
      .setText("<font color='#666666'><i>Note: Large emails are truncated for security. For full HTML visuals, use manual mode in the studio.</i></font>"));

    cBuilder.addSection(section);
  } catch (err) {
    cBuilder.addSection(CardService.newCardSection()
      .addWidget(CardService.newTextParagraph().setText('Add-on Error: ' + err.toString())));
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
      <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 mb-4">
        <p className="text-[10px] font-black text-amber-800 uppercase tracking-[0.2em] mb-1">⚠️ Fix: Runtime Error</p>
        <p className="text-[11px] text-amber-700 leading-relaxed font-medium">
          If you saw "URL cannot be used", it was because the email HTML was too long for Google's URL limit. This updated code truncates the body safely to 500 characters.
        </p>
      </div>

      <div className="bg-gray-900 p-4 rounded-2xl border border-gray-800 mb-4 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-black text-green-400 uppercase tracking-widest mb-1">Target Studio</p>
          <p className="text-sm font-bold text-white truncate max-w-[200px] sm:max-w-md font-mono">{currentUrl}</p>
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-black text-gray-900 mb-3 uppercase tracking-widest">1. Update appsscript.json</h3>
        <div className="relative group">
          <pre className="bg-gray-50 text-gray-700 p-5 rounded-2xl text-[10px] overflow-x-auto border border-gray-200">
            {manifestCode}
          </pre>
          <button onClick={() => handleCopy(manifestCode)} className="absolute top-3 right-3 px-3 py-1 bg-gray-900 text-white rounded-lg text-[10px] font-bold">Copy</button>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-black text-gray-900 mb-3 uppercase tracking-widest">2. Update Code.gs</h3>
        <div className="relative group">
          <pre className="bg-gray-50 text-gray-700 p-5 rounded-2xl text-[10px] overflow-x-auto max-h-[250px] border border-gray-200">
            {gsCode}
          </pre>
          <button onClick={() => handleCopy(gsCode)} className="absolute top-3 right-3 px-3 py-1 bg-gray-900 text-white rounded-lg text-[10px] font-bold">Copy</button>
        </div>
      </div>
    </div>
  );
};
