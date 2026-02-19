
import React, { useState, useEffect } from 'react';

export const AppsScriptCode: React.FC = () => {
  const [copiedGs, setCopiedGs] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('https://your-deployed-app.vercel.app');

  useEffect(() => {
    if (typeof window !== 'undefined' && !window.location.hostname.includes('localhost')) {
      setCurrentUrl(window.location.origin);
    }
  }, []);

  const jsonManifest = `{
  "timeZone": "Etc/GMT",
  "dependencies": {},
  "exceptionLogging": "STACKDRIVER",
  "runtimeVersion": "V8",
  "oauthScopes": [
    "https://www.googleapis.com/auth/gmail.addons.execute",
    "https://www.googleapis.com/auth/gmail.readonly",
    "https://www.googleapis.com/auth/script.external_request",
    "https://www.googleapis.com/auth/script.locale"
  ],
  "urlFetchWhitelist": [
    "https://wa.me/",
    "${currentUrl}/"
  ],
  "addOns": {
    "common": {
      "name": "Visual Bridge",
      "logoUrl": "https://www.gstatic.com/images/icons/material/system/1x/wallpaper_black_24dp.png",
      "useLocaleFromApp": true
    },
    "gmail": {
      "contextualTriggers": [
        {
          "unconditional": {},
          "onTriggerFunction": "onGmailMessageOpen"
        }
      ]
    }
  }
}`;

  const gsCode = `/**
 * Visual Bridge Bridge Launcher
 * Launch the conversion Studio from any open Gmail message.
 */

function onGmailMessageOpen(e) {
  var builder = CardService.newCardBuilder();
  var section = CardService.newCardSection();
  var message = GmailApp.getMessageById(e.gmail.messageId);

  section.addWidget(CardService.newTextParagraph()
    .setText("<b>Visual Bridge Studio</b><br>Transfer this email to the converter to create a professional WhatsApp visual card."));

  // Build the launcher URL with metadata
  var studioUrl = "${currentUrl}/" + 
                  "?subject=" + encodeURIComponent(message.getSubject()) + 
                  "&sender=" + encodeURIComponent(message.getFrom().replace(/<.*>/, '').trim());

  section.addWidget(CardService.newTextButton()
    .setText('🚀 OPEN IN STUDIO')
    .setOpenLink(CardService.newOpenLink().setUrl(studioUrl))
    .setTextButtonStyle(CardService.TextButtonStyle.FILLED));

  return builder.addSection(section).build();
}
`;

  const handleCopy = (text: string, type: 'gs' | 'json') => {
    navigator.clipboard.writeText(text);
    if (type === 'gs') setCopiedGs(true);
    else setCopiedJson(true);
    setTimeout(() => {
      setCopiedGs(false);
      setCopiedJson(false);
    }, 2000);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-zinc-900/50 p-10 rounded-[2.5rem] border border-white/5 text-white shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
           <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-black border border-white/10">01</div>
           <h3 className="text-xl font-black uppercase tracking-tight">The Manifest</h3>
        </div>
        <p className="text-xs text-zinc-500 mb-8 leading-relaxed font-medium">
          Whitelist your Vercel deployment URL in <code>appsscript.json</code> to allow the Gmail Add-on to link to this Studio.
        </p>
        <button 
          onClick={() => handleCopy(jsonManifest, 'json')}
          className="w-full py-4 bg-zinc-800 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-zinc-700 transition border border-white/5"
        >
          {copiedJson ? '✓ COPIED JSON' : 'Copy Manifest'}
        </button>
      </div>

      <div className="bg-zinc-900/50 p-10 rounded-[2.5rem] border border-white/5 text-white shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
           <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-black text-[10px] font-black">02</div>
           <h3 className="text-xl font-black uppercase tracking-tight">Launcher Code</h3>
        </div>
        <p className="text-xs text-zinc-500 mb-8 leading-relaxed font-medium">
          Paste this into your <code>Code.gs</code>. It adds a button to Gmail that automatically loads the subject and sender into the converter.
        </p>
        <button 
          onClick={() => handleCopy(gsCode, 'gs')}
          className="w-full py-4 bg-emerald-500 text-black rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-emerald-400 transition shadow-lg shadow-emerald-500/10"
        >
          {copiedGs ? '✓ COPIED CODE' : 'Copy Bridge Script'}
        </button>
      </div>
    </div>
  );
};
