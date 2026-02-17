
import React, { useState, useEffect } from 'react';

export const AppsScriptCode: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('https://your-deployed-app.vercel.app');

  useEffect(() => {
    if (typeof window !== 'undefined' && !window.location.hostname.includes('localhost')) {
      setCurrentUrl(window.location.origin);
    }
  }, []);

  const gsCode = `/**
 * WA Visual Bridge - HIGH FIDELITY INTEGRATED MODE
 * Version 6.0: Exact HTML Rendering via Backend
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
      'body': message.getPlainBody().substring(0, 3000) // Passing text or HTML
    });

  section.addWidget(CardService.newTextButton()
    .setText('📸 GENERATE EXACT VISUAL')
    .setOnClickAction(action)
    .setTextButtonStyle(CardService.TextButtonStyle.FILLED));

  return builder.addSection(section).build();
}

function renderExactVisualAction(e) {
  // 1. Show a loading notification
  var nav = CardService.newNavigation().pushCard(
    CardService.newCardBuilder()
      .addSection(CardService.newCardSection()
        .addWidget(CardService.newTextParagraph().setText("<b>🚀 Rendering High-Fidelity Visual...</b><br>Please wait a moment.")))
      .build()
  );

  // 2. Call your Vercel Render API
  // You need to deploy a serverless function at /api/render
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
    
    // The API should return a public URL or a persistent image link
    // Gmail Cards require a publicly accessible URL for Images
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

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-green-600 p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
             <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
             <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Full Fidelity Mode</p>
          </div>
          <h3 className="text-2xl font-black mb-4 leading-none">Exact Visual<br/>Rendering</h3>
          <p className="text-xs text-green-100 leading-relaxed mb-6">
            This mode uses your Vercel deployment as a <b>Server-Side Renderer</b>. It generates the exact HTML visual you saw before and sends it back to Gmail as a PNG.
          </p>
          <button 
            onClick={() => handleCopy(gsCode)}
            className="w-full py-4 bg-white text-green-600 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-gray-100 transition shadow-lg"
          >
            {copied ? 'Copied Integration Code!' : 'Copy Script for Code.gs'}
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-gray-100">
        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Next Step: Backend API</h4>
        <div className="space-y-3">
           <div className="flex gap-3">
              <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold">1</div>
              <p className="text-[11px] text-gray-500">Create a file <code>api/render.ts</code> in your project.</p>
           </div>
           <div className="flex gap-3">
              <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold">2</div>
              <p className="text-[11px] text-gray-500">Use a library like <code>puppeteer-core</code> or <code>satori</code> to render the HTML.</p>
           </div>
           <div className="flex gap-3">
              <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold">3</div>
              <p className="text-[11px] text-gray-500">Return the PNG image URL back to the Apps Script.</p>
           </div>
        </div>
      </div>
    </div>
  );
};
