
import React, { useState, useEffect } from 'react';

export const AppsScriptCode: React.FC = () => {
  const [copiedGs, setCopiedGs] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);

  // Note: We no longer need the currentUrl for the API call in Standalone mode, 
  // but we keep it in the whitelist for the "Open App" functionality.
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
 * WA Visual Bridge - STANDALONE v7.0
 * NO BACKEND REQUIRED. This script calls Gemini directly.
 * 
 * SETUP:
 * 1. Paste your Gemini API Key in the variable below.
 * 2. Update appsscript.json with the provided manifest.
 */

var GOOGLE_API_KEY = "PASTE_YOUR_GEMINI_API_KEY_HERE";

function onGmailMessageOpen(e) {
  var builder = CardService.newCardBuilder();
  var section = CardService.newCardSection();
  var message = GmailApp.getMessageById(e.gmail.messageId);

  section.addWidget(CardService.newTextParagraph()
    .setText("<b>Visual Bridge Standalone</b><br>Generate a visual summary directly using Gemini AI."));

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
  if (GOOGLE_API_KEY === "PASTE_YOUR_GEMINI_API_KEY_HERE") {
    return CardService.newActionResponseBuilder()
      .setNotification(CardService.newNotification().setText("Error: Please add your API Key to Code.gs"))
      .build();
  }

  var prompt = "Create a professional infographic summary card for this email. " +
               "Subject: " + e.parameters.subject + ". " +
               "Content: " + e.parameters.body + ". " +
               "Style: Modern, vertical, high-contrast, professional fonts.";

  var url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=" + GOOGLE_API_KEY;
  
  var payload = {
    "contents": [{
      "parts": [{ "text": prompt }]
    }],
    "config": {
      "imageConfig": { "aspectRatio": "9:16" }
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
    var responseCode = response.getResponseCode();
    var responseText = response.getContentText();

    if (responseCode !== 200) {
       throw new Error("API Error " + responseCode + ": " + responseText);
    }

    var data = JSON.parse(responseText);
    var base64Image = "";

    // Find the image part in the response
    var parts = data.candidates[0].content.parts;
    for (var i = 0; i < parts.length; i++) {
      if (parts[i].inlineData) {
        base64Image = parts[i].inlineData.data;
        break;
      }
    }

    if (!base64Image) throw new Error("No image data returned from Gemini.");

    var imageUrl = "data:image/png;base64," + base64Image;
    var resultCard = CardService.newCardBuilder();
    var resSection = CardService.newCardSection();
    
    resSection.addWidget(CardService.newImage().setImageUrl(imageUrl));
    
    var waUrl = "https://wa.me/?text=" + encodeURIComponent("Check out this email: " + e.parameters.subject);
    resSection.addWidget(CardService.newTextButton()
      .setText('SHARE TO WHATSAPP')
      .setOpenLink(CardService.newOpenLink().setUrl(waUrl)));

    return CardService.newActionResponseBuilder()
        .setNavigation(CardService.newNavigation().pushCard(resultCard.addSection(resSection).build()))
        .build();

  } catch (err) {
    return CardService.newActionResponseBuilder()
        .setNotification(CardService.newNotification().setText("Visual Error: " + err.toString()))
        .build();
  }
}

function TRIGGER_AUTH_POPUP() {
  UrlFetchApp.fetch("https://generativelanguage.googleapis.com/");
  console.log("Permissions Active!");
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
      <div className="bg-zinc-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden border border-zinc-800">
        <div className="absolute top-0 right-0 p-4">
           <span className="text-[10px] font-black bg-amber-500 text-black px-2 py-1 rounded">V7.0 STANDALONE</span>
        </div>
        <div className="relative z-10">
          <h3 className="text-2xl font-black mb-4 flex items-center gap-3">
             <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm">1</span>
             Update Manifest
          </h3>
          <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
            Replace your <code>appsscript.json</code> with this. It whitelists <b>generativelanguage.googleapis.com</b> directly.
          </p>
          <button 
            onClick={() => handleCopy(jsonManifest, 'json')}
            className="w-full py-4 bg-amber-500 text-black rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-amber-400 transition shadow-lg"
          >
            {copiedJson ? '✓ COPIED MANIFEST' : 'COPY APPSSCRIPT.JSON'}
          </button>
        </div>
      </div>

      {/* Code Section */}
      <div className="bg-zinc-800 p-8 rounded-[2.5rem] text-white shadow-xl relative border border-zinc-700">
        <div className="relative z-10">
          <h3 className="text-2xl font-black mb-4 flex items-center gap-3">
             <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm">2</span>
             Update Code.gs
          </h3>
          <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
            Paste this into <code>Code.gs</code>. You must add your API Key on <b>Line 11</b>.
          </p>
          <button 
            onClick={() => handleCopy(gsCode, 'gs')}
            className="w-full py-4 bg-white text-black rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-gray-100 transition shadow-lg"
          >
            {copiedGs ? '✓ COPIED STANDALONE SCRIPT' : 'COPY CODE.GS'}
          </button>
        </div>
      </div>

      <div className="bg-amber-50 p-6 rounded-3xl border border-amber-200">
         <p className="text-[10px] font-black text-amber-800 uppercase tracking-widest mb-2">Why this fixes it:</p>
         <p className="text-xs text-amber-700 leading-relaxed">
           The <code>Unexpected token &lt;</code> error occurred because your script was trying to fetch a JSON API from your website URL, but received your website's <b>HTML code</b> instead. By calling Gemini directly from Apps Script, we bypass your website entirely for the image generation.
         </p>
      </div>
    </div>
  );
};
