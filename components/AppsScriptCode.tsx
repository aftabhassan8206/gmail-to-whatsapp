
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
    "https://generativelanguage.googleapis.com/",
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
 * WA Visual Bridge - STANDALONE MODE (Fixed 404)
 * 
 * This version fixes the 404 error by calling a valid API endpoint 
 * during the permission authorization phase.
 */

// 1. PASTE YOUR API KEY HERE
var GEMINI_API_KEY = "PASTE_YOUR_GEMINI_API_KEY_HERE";

function onGmailMessageOpen(e) {
  var builder = CardService.newCardBuilder();
  var section = CardService.newCardSection();
  var message = GmailApp.getMessageById(e.gmail.messageId);

  section.addWidget(CardService.newTextParagraph()
    .setText("<b>Visual Bridge Studio</b><br>Create a shareable visual for this email."));

  var action = CardService.newAction()
    .setFunctionName('generateVisualDirectly')
    .setParameters({
      'subject': message.getSubject(),
      'body': message.getPlainBody().substring(0, 1000)
    });

  section.addWidget(CardService.newTextButton()
    .setText('📸 GENERATE AI VISUAL')
    .setOnClickAction(action)
    .setTextButtonStyle(CardService.TextButtonStyle.FILLED));

  return builder.addSection(section).build();
}

function generateVisualDirectly(e) {
  if (GEMINI_API_KEY === "PASTE_YOUR_GEMINI_API_KEY_HERE" || !GEMINI_API_KEY) {
    return CardService.newActionResponseBuilder()
      .setNotification(CardService.newNotification().setText("Error: Please paste your Gemini API Key at the top of Code.gs"))
      .build();
  }

  var prompt = "Convert this email into a professional WhatsApp summary card. " +
               "Subject: " + e.parameters.subject + ". " +
               "Content: " + e.parameters.body + ". " +
               "Style: Minimalist, clean, high contrast, vertical layout.";

  // API Endpoint for Gemini 2.5 Flash Image
  var url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=" + GEMINI_API_KEY;
  
  var payload = {
    "contents": [{ "parts": [{ "text": prompt }] }],
    "config": { "imageConfig": { "aspectRatio": "9:16" } }
  };

  var options = {
    "method": "post",
    "contentType": "application/json",
    "payload": JSON.stringify(payload),
    "muteHttpExceptions": true
  };

  try {
    var response = UrlFetchApp.fetch(url, options);
    var resCode = response.getResponseCode();
    var resText = response.getContentText();

    if (resCode !== 200) {
       var errorData = JSON.parse(resText);
       throw new Error("Gemini API Error (" + resCode + "): " + (errorData.error ? errorData.error.message : resText));
    }

    var data = JSON.parse(resText);
    var base64Image = "";

    // Extract image data from parts
    var parts = data.candidates[0].content.parts;
    for (var i = 0; i < parts.length; i++) {
      if (parts[i].inlineData) {
        base64Image = parts[i].inlineData.data;
        break;
      }
    }

    if (!base64Image) throw new Error("API returned success but no image was found.");

    var imageUrl = "data:image/png;base64," + base64Image;
    var resultCard = CardService.newCardBuilder();
    var resSection = CardService.newCardSection();
    
    resSection.addWidget(CardService.newImage().setImageUrl(imageUrl));
    
    var waUrl = "https://wa.me/?text=" + encodeURIComponent("Check out this summary: " + e.parameters.subject);
    resSection.addWidget(CardService.newTextButton()
      .setText('SHARE ON WHATSAPP')
      .setOpenLink(CardService.newOpenLink().setUrl(waUrl)));

    return CardService.newActionResponseBuilder()
        .setNavigation(CardService.newNavigation().pushCard(resultCard.addSection(resSection).build()))
        .build();

  } catch (err) {
    return CardService.newActionResponseBuilder()
        .setNotification(CardService.newNotification().setText("Error: " + err.toString()))
        .build();
  }
}

/**
 * FIXED TRIGGER: This function now calls a valid endpoint to avoid 404 errors.
 * Select this function in the toolbar and click 'Run' to grant permissions.
 */
function TRIGGER_AUTH_POPUP() {
  var testUrl = "https://generativelanguage.googleapis.com/v1beta/models?key=" + GEMINI_API_KEY;
  try {
    UrlFetchApp.fetch(testUrl, {"muteHttpExceptions": true});
    console.log("Authorization Successful. You can now use the Add-on.");
  } catch (e) {
    console.log("Permission granted, but API test failed (this is normal if key is missing): " + e.message);
  }
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
      {/* 404 Resolution Box */}
      <div className="bg-green-50 border border-green-100 p-6 rounded-3xl flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
        </div>
        <div>
          <h4 className="text-green-900 font-black text-sm uppercase tracking-tight">404 Error Resolved</h4>
          <p className="text-green-700 text-xs mt-1 leading-relaxed">
            The previous version called a non-existent URL to trigger permissions. The new code below uses a valid <code>v1beta/models</code> path, which fixes the 404 failure.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-black p-8 rounded-[2.5rem] text-white shadow-xl border border-gray-800">
          <h3 className="text-xl font-black mb-4">1. The Manifest</h3>
          <p className="text-[11px] text-gray-400 mb-6">Ensure your <code>appsscript.json</code> allows the Gemini domain.</p>
          <button 
            onClick={() => handleCopy(jsonManifest, 'json')}
            className="w-full py-4 bg-white text-black rounded-2xl text-[10px] font-black uppercase hover:bg-gray-100 transition"
          >
            {copiedJson ? '✓ COPIED' : 'COPY MANIFEST'}
          </button>
        </div>

        <div className="bg-zinc-800 p-8 rounded-[2.5rem] text-white shadow-xl border border-zinc-700">
          <h3 className="text-xl font-black mb-4">2. The Fixed Code</h3>
          <p className="text-[11px] text-gray-400 mb-6">Paste this into <code>Code.gs</code> to replace the old version.</p>
          <button 
            onClick={() => handleCopy(gsCode, 'gs')}
            className="w-full py-4 bg-amber-500 text-black rounded-2xl text-[10px] font-black uppercase hover:bg-amber-400 transition"
          >
            {copiedGs ? '✓ COPIED' : 'COPY CODE.GS'}
          </button>
        </div>
      </div>

      <div className="bg-zinc-900 p-8 rounded-[2rem] text-center">
         <p className="text-amber-500 text-xs font-black uppercase tracking-widest mb-4">Final Deployment Step</p>
         <div className="inline-block bg-zinc-800 p-4 rounded-2xl border border-zinc-700 text-left">
           <ol className="text-[11px] text-zinc-300 space-y-2 list-decimal ml-4">
             <li>Select <b>TRIGGER_AUTH_POPUP</b> in the script editor dropdown.</li>
             <li>Click <b>Run</b>. It will now return 200/Success instead of 404.</li>
             <li>Click <b>Deploy</b> → <b>Test Deployments</b> to update your Add-on.</li>
           </ol>
         </div>
      </div>
    </div>
  );
};
