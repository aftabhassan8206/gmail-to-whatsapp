
import React, { useState } from 'react';

export const ServerCode: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const code = `const express = require('express');
const puppeteer = require('puppeteer');
const app = express();

// Increase limit for large email HTML payloads
app.use(express.json({ limit: '15mb' }));

/**
 * POST /render
 * Accepts { html: string, width: number }
 * Returns { image: string } (base64 PNG)
 */
app.post('/render', async (req, res) => {
  const { html, width = 600 } = req.body;
  
  if (!html) return res.status(400).send('Missing HTML payload');

  let browser;
  try {
    // Optimization for Cloud Run / Linux containers
    browser = await puppeteer.launch({
      headless: "new",
      args: [
        '--no-sandbox', 
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu'
      ]
    });
    
    const page = await browser.newPage();
    
    // Set standard email width
    await page.setViewport({ width: parseInt(width), height: 800 });
    
    // Set content and wait for images/fonts to stabilize
    await page.setContent(html, { 
      waitUntil: ['load', 'networkidle0'],
      timeout: 30000 
    });

    // Auto-calculate height based on rendered content
    const height = await page.evaluate(() => document.documentElement.offsetHeight);

    const base64Image = await page.screenshot({
      clip: { x: 0, y: 0, width: parseInt(width), height: Math.ceil(height) },
      type: 'png',
      encoding: 'base64'
    });

    res.json({ 
      success: true,
      image: base64Image,
      metadata: { height, width }
    });

  } catch (err) {
    console.error('Render failure:', err);
    res.status(500).json({ success: false, error: err.message });
  } finally {
    if (browser) await browser.close();
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(\`Rendering Service active on port \${PORT}\`));`;

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-zinc-900 border border-white/5 p-10 rounded-[2.5rem] text-white shadow-2xl h-full flex flex-col group hover:border-blue-500/30 transition-all duration-500">
      <div className="flex items-center justify-between mb-8">
         <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-blue-500 transition">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-7 0V4"/></svg>
            </div>
            <h3 className="text-xl font-black uppercase tracking-tight">Node.js API</h3>
         </div>
         <span className="text-[10px] font-black text-zinc-600 bg-zinc-800 px-3 py-1 rounded-full uppercase tracking-widest group-hover:text-blue-400 transition">Express + Puppeteer</span>
      </div>
      
      <p className="text-[11px] text-zinc-400 mb-8 leading-relaxed font-medium">
        Deploy this microservice to any hosting provider. It receives the email HTML, launches a headless browser, 
        takes a pixel-perfect screenshot, and returns the PNG buffer.
      </p>
      
      <div className="bg-black/40 rounded-2xl p-6 mb-8 font-mono text-[10px] text-zinc-500 overflow-auto max-h-[300px] border border-white/5 scrollbar-thin scrollbar-thumb-zinc-800">
        <pre className="whitespace-pre">{code}</pre>
      </div>
      
      <button 
        onClick={handleCopy}
        className={`mt-auto w-full py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 transform active:scale-[0.98] ${
          copied ? 'bg-emerald-500 text-white' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white border border-white/5'
        }`}
      >
        {copied ? '✓ Copied to Clipboard' : 'Copy Server Code'}
      </button>
    </div>
  );
};
