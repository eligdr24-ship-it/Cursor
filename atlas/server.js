/*
 * Project Atlas — preview server (zero dependencies, Node 18+)
 *
 * Modes:
 *  - demo: serves pre-written sample reports (ASML, PTON) and clearly refuses
 *          to fabricate research for unknown tickers.
 *  - live: if OPENAI_API_KEY or ANTHROPIC_API_KEY is set, runs the full Atlas
 *          master prompt against the model and stores the structured report.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.ATLAS_PORT || 4000;
const ROOT = __dirname;
const PUBLIC_DIR = path.join(ROOT, 'public');
const REPORTS_DIR = path.join(ROOT, 'data', 'reports');
const PROMPT_PATH = path.join(ROOT, 'prompts', 'atlas-master-prompt.md');

const OPENAI_KEY = process.env.OPENAI_API_KEY || '';
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY || '';
const OPENAI_MODEL = process.env.ATLAS_OPENAI_MODEL || 'gpt-4o';
const ANTHROPIC_MODEL = process.env.ATLAS_ANTHROPIC_MODEL || 'claude-sonnet-4-20250514';

fs.mkdirSync(REPORTS_DIR, { recursive: true });

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.md': 'text/markdown; charset=utf-8'
};

function send(res, status, body, type = 'application/json; charset=utf-8') {
  const data = typeof body === 'string' ? body : JSON.stringify(body);
  res.writeHead(status, { 'Content-Type': type, 'Cache-Control': 'no-store' });
  res.end(data);
}

function safeTicker(raw) {
  const t = String(raw || '').trim().toUpperCase().replace(/[^A-Z0-9.\-]/g, '');
  return t.length >= 1 && t.length <= 12 ? t : null;
}

function listReports() {
  return fs.readdirSync(REPORTS_DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => {
      try {
        const r = JSON.parse(fs.readFileSync(path.join(REPORTS_DIR, f), 'utf8'));
        return {
          ticker: r.ticker,
          company: r.company,
          verdict: r.verdict,
          convictionRating: r.convictionRating,
          oneLiner: r.oneLiner,
          mode: r.mode || 'demo',
          generatedAt: r.generatedAt || null
        };
      } catch { return null; }
    })
    .filter(Boolean)
    .sort((a, b) => b.convictionRating - a.convictionRating);
}

function readReport(ticker) {
  const file = path.join(REPORTS_DIR, ticker.toLowerCase().replace(/[^a-z0-9.\-]/g, '') + '.json');
  if (!file.startsWith(REPORTS_DIR)) return null;
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function saveReport(report) {
  const file = path.join(REPORTS_DIR, report.ticker.toLowerCase() + '.json');
  fs.writeFileSync(file, JSON.stringify(report, null, 2));
}

// ---------- live LLM analysis ----------

async function callOpenAI(systemPrompt, userPrompt) {
  const resp = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${OPENAI_KEY}` },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      temperature: 0.3,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ]
    })
  });
  if (!resp.ok) throw new Error(`OpenAI ${resp.status}: ${(await resp.text()).slice(0, 400)}`);
  const data = await resp.json();
  return data.choices[0].message.content;
}

async function callAnthropic(systemPrompt, userPrompt) {
  const resp = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: ANTHROPIC_MODEL,
      max_tokens: 8000,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }]
    })
  });
  if (!resp.ok) throw new Error(`Anthropic ${resp.status}: ${(await resp.text()).slice(0, 400)}`);
  const data = await resp.json();
  return data.content.map(c => c.text || '').join('');
}

function extractJson(text) {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error('Model did not return JSON');
  return JSON.parse(text.slice(start, end + 1));
}

async function runLiveAnalysis(ticker, company) {
  const systemPrompt = fs.readFileSync(PROMPT_PATH, 'utf8');
  const userPrompt =
    `Analyze the following public company using the full Project Atlas framework.\n` +
    `Ticker: ${ticker}\nCompany: ${company || '(resolve from ticker)'}\n\n` +
    `Return ONLY the JSON object described in the Output Format section.`;

  const raw = OPENAI_KEY
    ? await callOpenAI(systemPrompt, userPrompt)
    : await callAnthropic(systemPrompt, userPrompt);

  const report = extractJson(raw);
  report.ticker = safeTicker(report.ticker) || ticker;
  report.generatedAt = new Date().toISOString();
  report.mode = 'live';
  saveReport(report);
  return report;
}

// ---------- request handling ----------

function readBody(req) {
  return new Promise((resolve, reject) => {
    let buf = '';
    req.on('data', c => {
      buf += c;
      if (buf.length > 1e6) { reject(new Error('body too large')); req.destroy(); }
    });
    req.on('end', () => {
      try { resolve(buf ? JSON.parse(buf) : {}); } catch (e) { reject(e); }
    });
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const p = url.pathname;

  try {
    if (p === '/api/status') {
      return send(res, 200, {
        liveMode: Boolean(OPENAI_KEY || ANTHROPIC_KEY),
        provider: OPENAI_KEY ? 'openai' : ANTHROPIC_KEY ? 'anthropic' : null,
        reportCount: listReports().length
      });
    }

    if (p === '/api/prompt') {
      return send(res, 200, fs.readFileSync(PROMPT_PATH, 'utf8'), MIME['.md']);
    }

    if (p === '/api/reports' && req.method === 'GET') {
      return send(res, 200, { reports: listReports() });
    }

    const reportMatch = p.match(/^\/api\/reports\/([A-Za-z0-9.\-]{1,12})$/);
    if (reportMatch && req.method === 'GET') {
      const report = readReport(reportMatch[1]);
      return report ? send(res, 200, report) : send(res, 404, { error: 'No report for this ticker yet.' });
    }

    if (p === '/api/analyze' && req.method === 'POST') {
      const body = await readBody(req);
      const ticker = safeTicker(body.ticker);
      if (!ticker) return send(res, 400, { error: 'Provide a valid ticker (1-12 chars, letters/digits).' });

      const existing = readReport(ticker);
      if (existing && !body.force) return send(res, 200, existing);

      if (OPENAI_KEY || ANTHROPIC_KEY) {
        const report = await runLiveAnalysis(ticker, body.company);
        return send(res, 200, report);
      }

      // Demo mode: never fabricate research.
      return send(res, 422, {
        error: 'demo-mode',
        message:
          `No API key configured, so Atlas will not fabricate research for ${ticker}. ` +
          `The preview includes two fully-worked sample reports (ASML — PASS, PTON — REJECT). ` +
          `Set OPENAI_API_KEY or ANTHROPIC_API_KEY to enable live analysis of any ticker.`
      });
    }

    // static files
    let filePath = p === '/' ? '/index.html' : p;
    filePath = path.normalize(path.join(PUBLIC_DIR, filePath));
    if (!filePath.startsWith(PUBLIC_DIR)) return send(res, 403, { error: 'forbidden' });
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
      return res.end(fs.readFileSync(filePath));
    }
    return send(res, 404, { error: 'not found' });
  } catch (err) {
    return send(res, 500, { error: String(err.message || err) });
  }
});

server.listen(PORT, () => {
  console.log(`Project Atlas preview running at http://localhost:${PORT}`);
  console.log(`Live analysis: ${OPENAI_KEY || ANTHROPIC_KEY ? 'ENABLED (' + (OPENAI_KEY ? 'OpenAI' : 'Anthropic') + ')' : 'disabled — demo mode (set OPENAI_API_KEY or ANTHROPIC_API_KEY)'}`);
});
