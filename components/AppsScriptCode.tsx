
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
 * WA Visual Bridge - STANDALONE MODE (Vercel 401 Bypass)
 * 
 * This script calls Gemini API DIRECTLY from Google servers.
 * It does NOT need to call your Vercel URL, which fixes the "401 Authentication Required" error.
 */

// 1. PASTE YOUR API KEY HERE
var GEMINI_API_KEY = "PASTE_YOUR_GEMINI_API_KEY_HERE";

function onGmailMessageOpen(e) {
  var builder = CardService.newCardBuilder();
  var section = CardService.newCardSection();
  var message = GmailApp.getMessageById(e.gmail.messageId);

  section.addWidget(CardService.newTextParagraph()
    .setText("<b>Visual Bridge Standalone</b><br>Generate a visual directly using Google Gemini AI."));

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
  if (GEMINI_API_KEY === "PASTE_YOUR_GEMINI_API_KEY_HERE") {
    return CardService.newActionResponseBuilder()
      .setNotification(CardService.newNotification().setText("Error: Add your API Key to Code.gs"))
      .build();
  }

  var prompt = "Create a professional, modern infographic summary for this email. " +
               "Subject: " + e.parameters.subject + ". " +
               "Content: " + e.parameters.body + ". " +
               "Design: High contrast, clean fonts, vertical card layout.";

  // Calling Google Gemini API directly bypasses Vercel 401 errors
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
       throw new Error("API " + resCode + ": " + resText);
    }

    var data = JSON.parse(resText);
    var base64Image = "";

    // Extract the image from Gemini response
    var parts = data.candidates[0].content.parts;
    for (var i = 0; i < parts.length; i++) {
      if (parts[i].inlineData) {
        base64Image = parts[i].inlineData.data;
        break;
      }
    }

    if (!base64Image) throw new Error("Gemini returned no image.");

    var imageUrl = "data:image/png;base64," + base64Image;
    var resultCard = CardService.newCardBuilder();
    var resSection = CardService.newCardSection();
    
    resSection.addWidget(CardService.newImage().setImageUrl(imageUrl).setAltText("Email Visual"));
    
    var waUrl = "https://wa.me/?text=" + encodeURIComponent("Email Summary: " + e.parameters.subject);
    resSection.addWidget(CardService.newTextButton()
      .setText('SHARE ON WHATSAPP')
      .setOpenLink(CardService.newOpenLink().setUrl(waUrl)));

    return CardService.newActionResponseBuilder()
        .setNavigation(CardService.newNavigation().pushCard(resultCard.addSection(resSection).build()))
        .build();

  } catch (err) {
    return CardService.newActionResponseBuilder()
        .setNotification(CardService.newNotification().setText("Visual Fail: " + err.toString()))
        .build();
  }
}

/**
 * UTILITY: Run this once to fix permissions
 */
function TRIGGER_AUTH_POPUP() {
  UrlFetchApp.fetch("https://generativelanguage.googleapis.com/");
  console.log("Success: Permissions granted.");
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
      {/* Alert Box */}
      <div className="bg-red-50 border border-red-100 p-6 rounded-3xl flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
        </div>
        <div>
          <h4 className="text-red-900 font-black text-sm uppercase tracking-tight">401 Error Detected</h4>
          <p className="text-red-700 text-xs mt-1 leading-relaxed">
            Your Vercel deployment has <b>Authentication Protection</b> enabled. To fix this, we've switched the code to "Standalone Mode" which calls Google directly, bypassing your website entirely.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Manifest Section */}
        <div className="bg-black p-8 rounded-[2.5rem] text-white shadow-xl relative border border-gray-800">
          <div className="relative z-10">
            <h3 className="text-xl font-black mb-4">1. New Manifest</h3>
            <p className="text-[11px] text-gray-400 mb-6">
              Update <code>appsscript.json</code> to whitelist the Gemini API.
            </p>
            <button 
              onClick={() => handleCopy(jsonManifest, 'json')}
              className="w-full py-4 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition shadow-lg"
            >
              {copiedJson ? '✓ COPIED' : 'COPY MANIFEST'}
            </button>
          </div>
        </div>

        {/* Code Section */}
        <div className="bg-zinc-800 p-8 rounded-[2.5rem] text-white shadow-xl relative border border-zinc-700">
          <div className="relative z-10">
            <h3 className="text-xl font-black mb-4">2. Direct Logic</h3>
            <p className="text-[11px] text-gray-400 mb-6">
              Paste this into <code>Code.gs</code>. Add your key at the top.
            </p>
            <button 
              onClick={() => handleCopy(gsCode, 'gs')}
              className="w-full py-4 bg-amber-500 text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-400 transition shadow-lg"
            >
              {copiedGs ? '✓ COPIED' : 'COPY CODE.GS'}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 p-6 rounded-3xl border border-amber-200">
         <p className="text-[10px] font-black text-amber-800 uppercase tracking-widest mb-2">Final Step</p>
         <p className="text-xs text-amber-700 leading-relaxed">
           After updating the code, select <b>"TRIGGER_AUTH_POPUP"</b> in the editor toolbar and click <b>Run</b>. This will grant the Add-on permission to connect to Google's AI servers.
         </p>
      </div>
    </div>
  );
};
