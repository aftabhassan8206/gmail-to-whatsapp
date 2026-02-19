
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
 * Visual Bridge Bridge Script
 * This script launches the Visual Studio where you can 1:1 convert 
 * your email HTML into a high-quality PNG for WhatsApp.
 */

function onGmailMessageOpen(e) {
  var builder = CardService.newCardBuilder();
  var section = CardService.newCardSection();
  var message = GmailApp.getMessageById(e.gmail.messageId);

  section.addWidget(CardService.newTextParagraph()
    .setText("<b>Visual Bridge Studio</b><br>Open the studio to render this email as a professional visual card."));

  var studioUrl = "${currentUrl}/" + 
                  "?subject=" + encodeURIComponent(message.getSubject()) + 
                  "&sender=" + encodeURIComponent(message.getFrom().replace(/<.*>/, '').trim());

  section.addWidget(CardService.newTextButton()
    .setText('🚀 OPEN IN VISUAL STUDIO')
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
    <div className="space-y-6">
      <div className="bg-zinc-900 p-8 rounded-[2.5rem] border border-white/5 text-white shadow-2xl">
        <h3 className="text-xl font-black mb-4">The Manifest</h3>
        <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
          Update your <code>appsscript.json</code> to allow the bridge to open the Studio.
        </p>
        <button 
          onClick={() => handleCopy(jsonManifest, 'json')}
          className="w-full py-4 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-200 transition"
        >
          {copiedJson ? '✓ COPIED' : 'COPY MANIFEST'}
        </button>
      </div>

      <div className="bg-zinc-900 p-8 rounded-[2.5rem] border border-white/5 text-white shadow-2xl">
        <h3 className="text-xl font-black mb-4">The Bridge Script</h3>
        <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
          Replace your <code>Code.gs</code> with this simple launcher. It passes the email metadata to the Studio for you.
        </p>
        <button 
          onClick={() => handleCopy(gsCode, 'gs')}
          className="w-full py-4 bg-emerald-500 text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-400 transition"
        >
          {copiedGs ? '✓ COPIED' : 'COPY CODE.GS'}
        </button>
      </div>
    </div>
  );
};
