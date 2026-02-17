
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
    "${currentUrl}/",
    "https://wa.me/"
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
 * WA Visual Bridge - DEFINITIVE PATCH v6.5
 * 
 * FIXING "REQUIRED PERMISSIONS" ERROR:
 * 1. You MUST update appsscript.json first.
 * 2. You MUST manually trigger the Auth Dialog.
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
    // This is the line that requires 'script.external_request' scope
    var response = UrlFetchApp.fetch(url, options);
    var data = JSON.parse(response.getContentText());
    var imageUrl = data.imageUrl; 

    var resultCard = CardService.newCardBuilder();
    var resSection = CardService.newCardSection();
    
    resSection.addWidget(CardService.newImage().setImageUrl(imageUrl).setAltText("Exact Email Visual"));
    
    var waUrl = "https://wa.me/?text=" + encodeURIComponent("Check out this email: " + e.parameters.subject);
    resSection.addWidget(CardService.newTextButton()
      .setText('SHARE TO WHATSAPP')
      .setOpenLink(CardService.newOpenLink().setUrl(waUrl)));

    return CardService.newActionResponseBuilder()
        .setNavigation(CardService.newNavigation().pushCard(resultCard.addSection(resSection).build()))
        .build();

  } catch (err) {
    return CardService.newActionResponseBuilder()
        .setNotification(CardService.newNotification().setText("CRITICAL: " + err.toString()))
        .build();
  }
}

/**
 * !!! RUN THIS FUNCTION MANUALLY !!!
 * Click the 'Run' button in the toolbar while this function is selected.
 * This FORCES the "Authorization Required" popup to appear.
 * If you don't do this, the Add-on will fail silently.
 */
function TRIGGER_AUTH_POPUP() {
  UrlFetchApp.fetch("${currentUrl}/");
  GmailApp.getInboxThreads(0, 1);
  console.log("Permissions successfully granted!");
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
    <div className="space-y-8">
      {/* Step 1: Manifest */}
      <div className="bg-black p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden border border-gray-800">
        <div className="absolute top-0 right-0 p-4">
           <span className="text-[10px] font-black bg-red-600 px-2 py-1 rounded">MANDATORY</span>
        </div>
        <div className="relative z-10">
          <h3 className="text-2xl font-black mb-4 flex items-center gap-3">
             <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm">1</span>
             Override Manifest
          </h3>
          <p className="text-xs text-gray-400 mb-6 leading-relaxed">
            Go to <b>Project Settings (Gear Icon)</b> → Enable <b>"Show 'appsscript.json' manifest file"</b>. 
            Open the file and <b>delete everything</b>. Paste this instead:
          </p>
          <button 
            onClick={() => handleCopy(jsonManifest, 'json')}
            className="w-full py-4 bg-white text-black rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-gray-100 transition shadow-lg"
          >
            {copiedJson ? '✓ COPIED MANIFEST' : 'COPY APPSSCRIPT.JSON'}
          </button>
        </div>
      </div>

      {/* Step 2: Code */}
      <div className="bg-green-600 p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-2xl font-black mb-4 flex items-center gap-3">
             <span className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center text-sm">2</span>
             Update Code.gs
          </h3>
          <p className="text-xs text-green-100 mb-6 leading-relaxed">
            Paste this into your main <code>Code.gs</code> file. It includes a specific trigger function to fix the auth loop.
          </p>
          <button 
            onClick={() => handleCopy(gsCode, 'gs')}
            className="w-full py-4 bg-white text-green-600 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-gray-100 transition shadow-lg"
          >
            {copiedGs ? '✓ COPIED SCRIPT' : 'COPY CODE.GS'}
          </button>
        </div>
      </div>

      {/* Step 3: Trigger */}
      <div className="bg-amber-500 p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-2xl font-black mb-4 flex items-center gap-3 text-black">
             <span className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center text-sm">3</span>
             The "Magic" Fix
          </h3>
          <p className="text-xs text-amber-950 mb-4 font-bold">
            YOU MUST DO THIS OR IT WILL FAIL:
          </p>
          <ol className="text-xs text-amber-900 space-y-2 list-decimal ml-4">
             <li>In the Apps Script Editor, look at the toolbar.</li>
             <li>Select the function <b>"TRIGGER_AUTH_POPUP"</b> from the dropdown.</li>
             <li>Click the <b>▶ Run</b> button.</li>
             <li>A popup will appear saying <b>"Authorization Required"</b>. Click <b>"Review Permissions"</b> and accept everything.</li>
          </ol>
        </div>
      </div>
    </div>
  );
};
