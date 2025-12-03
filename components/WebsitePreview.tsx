import React, { useMemo } from 'react';
import { WebsiteGeneration } from '../types';

interface WebsitePreviewProps {
  generation: WebsiteGeneration;
  accentColor?: string;
  direction?: 'rtl' | 'ltr';
}

const WebsitePreview: React.FC<WebsitePreviewProps> = ({ generation, accentColor = '#bf8339', direction = 'ltr' }) => {
  const keywords = Array.isArray(generation.seoKeywords)
    ? generation.seoKeywords
    : typeof generation.seoKeywords === 'string'
      ? generation.seoKeywords.split(',').map(k => k.trim()).filter(Boolean)
      : [];

  const srcDoc = useMemo(() => `<!DOCTYPE html>
  <html lang="en" dir="${direction}">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="description" content="${generation.metaDescription}" />
      <title>Website Preview</title>
      <style>
        :root {
          --accent: ${accentColor};
          --bg: ${direction === 'rtl' ? '#0c1b32' : '#0a1e3c'};
          --text: #e9ecf2;
          --card: rgba(255,255,255,0.05);
        }
        * { box-sizing: border-box; }
        body {
          margin: 0;
          font-family: 'Inter', 'Tajawal', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: radial-gradient(circle at 20% 20%, rgba(191,131,57,0.15), transparent 25%),
                      radial-gradient(circle at 80% 0%, rgba(191,131,57,0.25), transparent 35%),
                      linear-gradient(135deg, #0a1426, var(--bg));
          color: var(--text);
          min-height: 100vh;
        }
        .hero {
          padding: 48px 28px 32px;
          text-align: ${direction === 'rtl' ? 'right' : 'left'};
          max-width: 1100px;
          margin: 0 auto;
        }
        .label { text-transform: uppercase; letter-spacing: 3px; font-size: 12px; color: rgba(255,255,255,0.7); }
        h1 { margin: 12px 0 8px; font-size: clamp(32px, 3vw, 44px); color: var(--text); }
        .meta { color: rgba(255,255,255,0.75); line-height: 1.6; max-width: 900px; }
        .keywords { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 18px; }
        .pill { padding: 8px 12px; border-radius: 999px; border: 1px solid rgba(255,255,255,0.15); background: rgba(255,255,255,0.07); color: #fff; font-size: 13px; }
        .content-card {
          background: var(--card);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 26px;
          margin: 24px auto 60px;
          max-width: 1100px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.35);
        }
        .content-card h2, .content-card h3, .content-card h4 { color: var(--accent); margin-top: 0; }
        .content-card p { color: rgba(255,255,255,0.87); line-height: 1.7; }
        .content-card a { color: #7ec8ff; }
        .badge-row { display: flex; gap: 12px; margin-bottom: 12px; flex-wrap: wrap; }
        .badge { background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12); color: #fff; padding: 6px 10px; border-radius: 10px; font-size: 12px; }
        footer { max-width: 1100px; margin: 0 auto 28px; color: rgba(255,255,255,0.6); padding: 0 20px; }
      </style>
    </head>
    <body>
      <section class="hero">
        <div class="label">SEO WEBSITE DRAFT</div>
        <h1>${generation.version ? `Version ${generation.version}` : 'Live Draft'}</h1>
        <p class="meta">${generation.metaDescription}</p>
        <div class="keywords">
          ${keywords.map(k => `<span class="pill">${k}</span>`).join('')}
        </div>
      </section>

      <article class="content-card">
        <div class="badge-row">
          <span class="badge">Responsive Preview</span>
          <span class="badge">Ready to Publish</span>
        </div>
        ${generation.pageContent}
      </article>

      <footer>Generated with Postly-AI • Tailor the copy, then export or publish</footer>
    </body>
  </html>`, [accentColor, direction, generation.metaDescription, generation.pageContent, generation.seoKeywords, generation.version]);

  return (
    <iframe
      title={`Website preview version ${generation.version}`}
      srcDoc={srcDoc}
      className="w-full h-[720px] rounded-2xl border border-white/10 shadow-2xl overflow-hidden bg-black/40"
      sandbox="allow-same-origin"
    />
  );
};

export default WebsitePreview;
