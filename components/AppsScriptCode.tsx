
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
    "https://generativelanguage.googleapis.com/"
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
 * Visual Bridge - Direct API Rendering (NO EXTERNAL TABS)
 * Fixed 400 Error: uses "generationConfig" for REST compatibility.
 */

// 1. PASTE YOUR API KEY HERE
var GEMINI_API_KEY = "PASTE_YOUR_API_KEY_HERE";

function onGmailMessageOpen(e) {
  var builder = CardService.newCardBuilder();
  var section = CardService.newCardSection();
  var message = GmailApp.getMessageById(e.gmail.messageId);

  section.addWidget(CardService.newTextParagraph()
    .setText("<b>Visual Bridge Studio</b><br>Render this email as a professional visual card without leaving Gmail."));

  var action = CardService.newAction()
    .setFunctionName('generateVisualDirectly')
    .setParameters({
      'subject': message.getSubject(),
      'body': message.getPlainBody().substring(0, 2000)
    });

  section.addWidget(CardService.newTextButton()
    .setText('📸 GENERATE PNG DIRECTLY')
    .setOnClickAction(action)
    .setTextButtonStyle(CardService.TextButtonStyle.FILLED));

  return builder.addSection(section).build();
}

/**
 * Calls Gemini 2.5 Flash Image via REST to "render" the email content.
 */
function generateVisualDirectly(e) {
  if (GEMINI_API_KEY === "PASTE_YOUR_API_KEY_HERE" || !GEMINI_API_KEY) {
    return CardService.newActionResponseBuilder()
      .setNotification(CardService.newNotification().setText("Error: Missing API Key in Code.gs"))
      .build();
  }

  var prompt = "Act as a professional UI renderer. Convert this email into a high-fidelity visual summary card. " +
               "Subject: " + e.parameters.subject + ". " +
               "Content: " + e.parameters.body + ". " +
               "Design: Minimalist, clean vertical layout, professional typography.";

  var url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=" + GEMINI_API_KEY;
  
  // FIXED PAYLOAD: Using 'generationConfig' instead of 'config' for REST API
  var payload = {
    "contents": [{ "parts": [{ "text": prompt }] }],
    "generationConfig": { 
      "imageConfig": { 
        "aspectRatio": "9:16" 
      } 
    }
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
       throw new Error("API Error (" + resCode + "): " + (errorData.error ? errorData.error.message : resText));
    }

    var data = JSON.parse(resText);
    var base64Image = "";

    // Iterate through response parts to find image data
    var parts = data.candidates[0].content.parts;
    for (var i = 0; i < parts.length; i++) {
      if (parts[i].inlineData) {
        base64Image = parts[i].inlineData.data;
        break;
      }
    }

    if (!base64Image) throw new Error("No image data returned.");

    var imageUrl = "data:image/png;base64," + base64Image;
    var resultCard = CardService.newCardBuilder();
    var resSection = CardService.newCardSection();
    
    // Display the generated PNG directly in Gmail
    resSection.addWidget(CardService.newImage().setImageUrl(imageUrl));
    
    // Add Share Action
    var waUrl = "https://wa.me/?text=" + encodeURIComponent("Email Summary: " + e.parameters.subject);
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

function TRIGGER_AUTH_POPUP() {
  var testUrl = "https://generativelanguage.googleapis.com/v1beta/models?key=" + GEMINI_API_KEY;
  UrlFetchApp.fetch(testUrl, {"muteHttpExceptions": true});
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
          Whitelist the Google Generative AI domain so the Add-on can fetch images directly.
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
           <h3 className="text-xl font-black uppercase tracking-tight">Direct API Code</h3>
        </div>
        <p className="text-xs text-zinc-500 mb-8 leading-relaxed font-medium">
          Paste this into <code>Code.gs</code>. It uses Gemini as a remote renderer to return PNGs directly to Gmail.
        </p>
        <button 
          onClick={() => handleCopy(gsCode, 'gs')}
          className="w-full py-4 bg-emerald-500 text-black rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-emerald-400 transition shadow-lg shadow-emerald-500/10"
        >
          {copiedGs ? '✓ COPIED CODE' : 'Copy API Script'}
        </button>
      </div>
    </div>
  );
};
