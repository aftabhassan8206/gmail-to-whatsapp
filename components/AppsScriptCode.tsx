
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
    "${currentUrl}/"
  ],
  "addOns": {
    "common": {
      "name": "WA Visual Bridge",
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
 * WA Visual Bridge - HIGH FIDELITY INTEGRATED MODE
 * Version 6.3: Complete Permission & Whitelist Patch
 */

function onGmailMessageOpen(e) {
  var builder = CardService.newCardBuilder();
  var section = CardService.newCardSection();
  var message = GmailApp.getMessageById(e.gmail.messageId);

  section.addWidget(CardService.newTextParagraph()
    .setText("<b>Visual Bridge Studio</b><br>Generate the exact visual of this email for WhatsApp."));

  var action = CardService.newAction()
    .setFunctionName('renderExactVisualAction')
    .setParameters({
      'subject': message.getSubject(),
      'sender': message.getFrom(),
      'body': message.getPlainBody().substring(0, 3000)
    });

  section.addWidget(CardService.newTextButton()
    .setText('📸 GENERATE EXACT VISUAL')
    .setOnClickAction(action)
    .setTextButtonStyle(CardService.TextButtonStyle.FILLED));

  return builder.addSection(section).build();
}

function renderExactVisualAction(e) {
  var url = "${currentUrl}/api/render";
  var payload = {
    'subject': e.parameters.subject,
    'sender': e.parameters.sender,
    'body': e.parameters.body
  };

  var options = {
    'method' : 'post',
    'contentType': 'application/json',
    'payload' : JSON.stringify(payload),
    'muteHttpExceptions': true
  };

  try {
    var response = UrlFetchApp.fetch(url, options);
    var data = JSON.parse(response.getContentText());
    
    var imageUrl = data.imageUrl; 

    var resultCard = CardService.newCardBuilder();
    var resSection = CardService.newCardSection();
    
    resSection.addWidget(CardService.newImage().setImageUrl(imageUrl).setAltText("Exact Email Visual"));
    
    var waUrl = "https://wa.me/?text=" + encodeURIComponent("Check out this email summary: " + e.parameters.subject);
    resSection.addWidget(CardService.newTextButton()
      .setText('SHARE TO WHATSAPP')
      .setOpenLink(CardService.newOpenLink().setUrl(waUrl)));

    return CardService.newActionResponseBuilder()
        .setNavigation(CardService.newNavigation().pushCard(resultCard.addSection(resSection).build()))
        .build();

  } catch (err) {
    return CardService.newActionResponseBuilder()
        .setNotification(CardService.newNotification().setText("Render failed: " + err.toString()))
        .build();
  }
}`;

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
    <div className="space-y-8">
      {/* Manifest Section - The Critical Fix */}
      <div className="bg-indigo-600 p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
             <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
             <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Step 1: Manifest Update (v6.3)</p>
          </div>
          <h3 className="text-2xl font-black mb-4 leading-tight">Authorize Locale & Whitelist</h3>
          <p className="text-xs text-indigo-100 leading-relaxed mb-6">
            Google Add-ons require specific authorization for "Locale" and "External Requests". This manifest includes the missing <code>script.locale</code> scope.
          </p>
          
          <div className="bg-black/20 p-4 rounded-2xl mb-6 space-y-2">
             <p className="text-[10px] font-bold text-indigo-200">FINAL PERMISSION FIX:</p>
             <ol className="text-[10px] space-y-1 list-decimal ml-4 text-white/80">
                <li>Open <code>appsscript.json</code> in your project editor.</li>
                <li><b>REPLACE</b> the content with the updated version below.</li>
                <li>Save and test the Add-on again.</li>
             </ol>
          </div>

          <button 
            onClick={() => handleCopy(jsonManifest, 'json')}
            className="w-full py-4 bg-white text-indigo-600 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-gray-100 transition shadow-lg"
          >
            {copiedJson ? 'Copied Final Manifest!' : 'Copy appsscript.json (Final Patch)'}
          </button>
        </div>
      </div>

      {/* Code Section */}
      <div className="bg-green-600 p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
             <div className="w-2 h-2 rounded-full bg-white opacity-50"></div>
             <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Step 2: Logic Check</p>
          </div>
          <h3 className="text-2xl font-black mb-4 leading-none">Script Confirmation</h3>
          <button 
            onClick={() => handleCopy(gsCode, 'gs')}
            className="w-full py-4 bg-white text-green-600 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-gray-100 transition shadow-lg"
          >
            {copiedGs ? 'Copied Logic Code!' : 'Copy Code.gs'}
          </button>
        </div>
      </div>
    </div>
  );
};
