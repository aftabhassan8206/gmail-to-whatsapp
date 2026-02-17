
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
 * WA Visual Bridge - DEFINITIVE PATCH v6.4
 * 
 * TO FIX PERMISSIONS: 
 * 1. Update appsscript.json first.
 * 2. Select 'forceAuthorization' in the toolbar and click 'Run'.
 * 3. Grant permissions in the popup.
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
    
    var waUrl = "https://wa.me/?text=" + encodeURIComponent("Check out this email: " + e.parameters.subject);
    resSection.addWidget(CardService.newTextButton()
      .setText('SHARE TO WHATSAPP')
      .setOpenLink(CardService.newOpenLink().setUrl(waUrl)));

    return CardService.newActionResponseBuilder()
        .setNavigation(CardService.newNavigation().pushCard(resultCard.addSection(resSection).build()))
        .build();

  } catch (err) {
    return CardService.newActionResponseBuilder()
        .setNotification(CardService.newNotification().setText("Permission Fail: " + err.toString()))
        .build();
  }
}

/**
 * UTILITY: RUN THIS ONCE MANUALLY IN THE EDITOR
 * This forces Google to show you the "Review Permissions" popup.
 */
function forceAuthorization() {
  UrlFetchApp.fetch("${currentUrl}/");
  console.log("Authorization success!");
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
      {/* Manifest Section */}
      <div className="bg-red-600 p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden ring-4 ring-red-200">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
             <div className="w-2 h-2 rounded-full bg-white animate-ping"></div>
             <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Urgent: Manifest Fix</p>
          </div>
          <h3 className="text-2xl font-black mb-4 leading-tight">Step 1: Clean appsscript.json</h3>
          <p className="text-xs text-red-100 leading-relaxed mb-6">
            Your manifest might be corrupted. <b>Delete everything</b> in your <code>appsscript.json</code> and paste this fresh version.
          </p>
          
          <button 
            onClick={() => handleCopy(jsonManifest, 'json')}
            className="w-full py-4 bg-white text-red-600 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-gray-100 transition shadow-lg mb-4"
          >
            {copiedJson ? '✓ Copied Clean Manifest' : 'Copy appsscript.json (Clean)'}
          </button>
        </div>
      </div>

      {/* Code Section */}
      <div className="bg-green-600 p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
             <div className="w-2 h-2 rounded-full bg-white opacity-50"></div>
             <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Step 2: Script Logic</p>
          </div>
          <h3 className="text-2xl font-black mb-4 leading-none">Step 2: Update Code.gs</h3>
          <p className="text-xs text-green-100 leading-relaxed mb-6">
            Paste this into your <code>Code.gs</code>. It includes a <b>forceAuthorization</b> helper to fix the prompt issue.
          </p>
          <button 
            onClick={() => handleCopy(gsCode, 'gs')}
            className="w-full py-4 bg-white text-green-600 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-gray-100 transition shadow-lg"
          >
            {copiedGs ? '✓ Copied Logic' : 'Copy Code.gs'}
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl border-2 border-dashed border-gray-200 text-center">
         <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Final Step</p>
         <p className="text-xs text-gray-600">After pasting both, click <b>Run &gt; forceAuthorization</b> in the Apps Script editor to trigger the final permission popup.</p>
      </div>
    </div>
  );
};
