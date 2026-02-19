
import React, { useState } from 'react';

export const AppsScriptCode: React.FC = () => {
  const [copiedGs, setCopiedGs] = useState(false);

  const gsCode = `/**
 * Visual Bridge - Direct Rendering via Custom API
 * No AI. Uses Puppeteer on your backend service.
 */

// 1. UPDATE THIS TO YOUR DEPLOYED RENDERER URL
var RENDERER_SERVICE_URL = "https://your-renderer-service.a.run.app/render";

/**
 * Contextual trigger that runs when a Gmail message is opened.
 */
function onGmailMessageOpen(e) {
  var builder = CardService.newCardBuilder();
  var section = CardService.newCardSection();
  var message = GmailApp.getMessageById(e.gmail.messageId);

  section.addWidget(CardService.newTextParagraph()
    .setText("<b>Visual Bridge Studio</b><br>Render this email as a high-fidelity PNG for WhatsApp."));

  var action = CardService.newAction()
    .setFunctionName('renderEmailAsPng')
    .setParameters({
      'messageId': e.gmail.messageId
    });

  section.addWidget(CardService.newTextButton()
    .setText('📸 RENDER PNG IMAGE')
    .setOnClickAction(action)
    .setTextButtonStyle(CardService.TextButtonStyle.FILLED));

  return builder.addSection(section).build();
}

/**
 * Logic to fetch the PNG from your backend and update the sidebar.
 */
function renderEmailAsPng(e) {
  var message = GmailApp.getMessageById(e.parameters.messageId);
  var html = message.getBody();
  
  // Wrap with basic styles to ensure standard rendering
  var payload = {
    "html": "<html><head><style>body { margin: 0; padding: 20px; background: white; font-family: sans-serif; }</style></head><body>" + html + "</body></html>",
    "width": 600
  };

  var options = {
    "method": "post",
    "contentType": "application/json",
    "payload": JSON.stringify(payload),
    "muteHttpExceptions": true
  };

  try {
    var response = UrlFetchApp.fetch(RENDERER_SERVICE_URL, options);
    var resCode = response.getResponseCode();
    
    if (resCode !== 200) {
      throw new Error("Renderer Error (" + resCode + "): " + response.getContentText());
    }

    var result = JSON.parse(response.getContentText());
    var base64Image = result.image; // Expects a raw base64 string from server

    var resultCard = CardService.newCardBuilder();
    var resSection = CardService.newCardSection();
    
    // Display result directly in Gmail Sidebar
    resSection.addWidget(CardService.newImage()
      .setImageUrl("data:image/png;base64," + base64Image));
    
    var shareUrl = "https://wa.me/?text=" + encodeURIComponent("Check out this email summary card!");
    resSection.addWidget(CardService.newTextButton()
      .setText('SHARE ON WHATSAPP')
      .setOpenLink(CardService.newOpenLink().setUrl(shareUrl)));

    return CardService.newActionResponseBuilder()
        .setNavigation(CardService.newNavigation().pushCard(resultCard.addSection(resSection).build()))
        .build();

  } catch (err) {
    return CardService.newActionResponseBuilder()
        .setNotification(CardService.newNotification().setText("Error: " + err.toString()))
        .build();
  }
}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(gsCode);
    setCopiedGs(true);
    setTimeout(() => setCopiedGs(false), 2000);
  };

  return (
    <div className="bg-zinc-900 border border-white/5 p-10 rounded-[2.5rem] text-white shadow-2xl h-full flex flex-col group hover:border-blue-500/30 transition-all duration-500">
      <div className="flex items-center justify-between mb-8">
         <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg>
            </div>
            <h3 className="text-xl font-black uppercase tracking-tight">Apps Script</h3>
         </div>
         <span className="text-[10px] font-black text-zinc-600 bg-zinc-800 px-3 py-1 rounded-full uppercase tracking-widest group-hover:text-blue-400 transition">Code.gs</span>
      </div>
      
      <p className="text-[11px] text-zinc-400 mb-8 leading-relaxed font-medium">
        This is the core logic for your Google Add-on. Paste this into the Google Apps Script editor. 
        It handles the communication between Gmail and your rendering API.
      </p>
      
      <div className="bg-black/40 rounded-2xl p-6 mb-8 font-mono text-[10px] text-zinc-500 overflow-auto max-h-[300px] border border-white/5 scrollbar-thin scrollbar-thumb-zinc-800">
        <pre className="whitespace-pre">{gsCode}</pre>
      </div>
      
      <button 
        onClick={handleCopy}
        className={`mt-auto w-full py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 transform active:scale-[0.98] ${
          copiedGs ? 'bg-emerald-500 text-white' : 'bg-blue-600 text-white hover:bg-blue-500 shadow-xl shadow-blue-500/10'
        }`}
      >
        {copiedGs ? '✓ Copied to Clipboard' : 'Copy Code.gs'}
      </button>
    </div>
  );
};
