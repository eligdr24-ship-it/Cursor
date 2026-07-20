/* Project Atlas — preview dashboard */

const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

let activeTicker = null;

// ---------- init ----------

async function init() {
  const status = await fetch('/api/status').then(r => r.json()).catch(() => null);
  const badge = $('#modeBadge');
  if (status && status.liveMode) {
    badge.textContent = `LIVE · ${status.provider}`;
    badge.classList.add('live');
  } else {
    badge.textContent = 'DEMO MODE';
    badge.classList.add('demo');
  }
  const fromHash = location.hash.replace('#', '').toUpperCase();
  await loadCoverage(fromHash || null);
}

async function loadCoverage(selectTicker) {
  const data = await fetch('/api/reports').then(r => r.json());
  const list = $('#coverageList');
  $('#coverageCount').textContent = data.reports.length;
  list.innerHTML = data.reports.map(r => `
    <button class="coverage-item${r.ticker === activeTicker ? ' active' : ''}" data-ticker="${esc(r.ticker)}">
      <span class="tk">${esc(r.ticker)}</span>
      <span class="co">${esc(r.company)}</span>
      <span class="verdict-chip ${r.verdict === 'PASS' ? 'pass' : 'reject'}">${esc(r.verdict)} ${r.convictionRating}</span>
    </button>
  `).join('');
  list.querySelectorAll('.coverage-item').forEach(btn =>
    btn.addEventListener('click', () => openReport(btn.dataset.ticker)));
  if (selectTicker) openReport(selectTicker);
}

// ---------- analyze ----------

$('#analyzeForm').addEventListener('submit', async e => {
  e.preventDefault();
  const ticker = $('#tickerInput').value.trim().toUpperCase();
  if (!ticker) return;
  const note = $('#analyzeNote');
  note.classList.remove('error');
  note.innerHTML = '<span class="spinner"></span>Running the Atlas framework… (live runs take 30–90s)';
  try {
    const resp = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ticker })
    });
    const data = await resp.json();
    if (!resp.ok) {
      note.classList.add('error');
      note.textContent = data.message || data.error || 'Analysis failed.';
      return;
    }
    note.textContent = '';
    await loadCoverage(data.ticker);
  } catch (err) {
    note.classList.add('error');
    note.textContent = 'Request failed: ' + err.message;
  }
});

// ---------- prompt modal ----------

$('#promptBtn').addEventListener('click', async () => {
  $('#promptModal').hidden = false;
  const txt = await fetch('/api/prompt').then(r => r.text());
  $('#promptText').textContent = txt;
});
$('#promptClose').addEventListener('click', () => { $('#promptModal').hidden = true; });
$('#promptModal').addEventListener('click', e => { if (e.target.id === 'promptModal') $('#promptModal').hidden = true; });

// ---------- report rendering ----------

async function openReport(ticker) {
  const r = await fetch('/api/reports/' + encodeURIComponent(ticker)).then(x => x.ok ? x.json() : null);
  if (!r) return;
  activeTicker = ticker;
  history.replaceState(null, '', '#' + ticker);
  document.querySelectorAll('.coverage-item').forEach(b =>
    b.classList.toggle('active', b.dataset.ticker === ticker));

  $('#reportEmpty').hidden = true;
  const body = $('#reportBody');
  body.hidden = false;
  const isPass = r.verdict === 'PASS';
  const color = isPass ? '#3fb27f' : '#e0596b';

  body.innerHTML = `
    ${renderHead(r, isPass, color)}
    ${renderScores(r.scores)}
    ${renderGates(r.decisionGates)}
    ${renderFlags(r.antiHypeFlags)}
    ${r.unfairAdvantages?.length ? section('Unfair Advantages',
      `<div class="tags">${r.unfairAdvantages.map(a => `<span class="tag">${esc(a)}</span>`).join('')}</div>`) : ''}
    ${renderQA(r.researchQuestions)}
    ${renderSections(r.sections)}
    ${renderScenarios(r.scenarios)}
    ${r.keyMetricsToMonitor?.length ? section('Key Metrics to Monitor', checkList(r.keyMetricsToMonitor)) : ''}
    ${r.whatWouldChangeMyMind?.length ? section('What Would Change My Mind', checkList(r.whatWouldChangeMyMind)) : ''}
    ${r.portfolioQuestion ? `<div class="verdict-banner ${isPass ? 'pass' : 'reject'}">
      <strong>The 20-position test:</strong> ${esc(r.portfolioQuestion)}</div>` : ''}
  `;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function section(title, inner) {
  return `<div class="r-section"><h3>${esc(title)}</h3>${inner}</div>`;
}

function checkList(items) {
  return `<ul class="check-list">${items.map(i => `<li>${esc(i)}</li>`).join('')}</ul>`;
}

function renderHead(r, isPass, color) {
  const pct = Math.max(0, Math.min(100, r.convictionRating));
  const angle = -180 + (pct / 100) * 180;
  const rad = a => (a * Math.PI) / 180;
  const x = 75 + 62 * Math.cos(rad(angle));
  const y = 74 + 62 * Math.sin(rad(angle));
  const largeArc = 0;
  return `
  <div class="r-head">
    <div>
      <div class="r-title">${esc(r.company)}<span class="tk">${esc(r.ticker)}</span></div>
      <div class="r-oneliner">${esc(r.oneLiner)}</div>
      <div class="r-meta">${r.mode === 'live' ? 'LIVE ANALYSIS' : 'SAMPLE REPORT'}${r.generatedAt ? ' · ' + new Date(r.generatedAt).toLocaleDateString() : ''}</div>
    </div>
    <div class="gauge-wrap">
      <svg class="gauge" viewBox="0 0 150 82">
        <path d="M 13 74 A 62 62 0 0 1 137 74" fill="none" stroke="#22303f" stroke-width="10" stroke-linecap="round"/>
        <path d="M 13 74 A 62 62 0 ${largeArc} 1 ${x.toFixed(1)} ${y.toFixed(1)}" fill="none" stroke="${color}" stroke-width="10" stroke-linecap="round"/>
      </svg>
      <div class="gauge-num" style="color:${color}">${pct}</div>
      <div class="gauge-label">Conviction / 100</div>
      <div class="gauge-verdict"><span class="verdict-chip ${isPass ? 'pass' : 'reject'}">${esc(r.verdict)}</span></div>
    </div>
  </div>`;
}

function renderScores(scores) {
  if (!scores) return '';
  const labels = {
    businessQuality: 'Business Quality', moat: 'Competitive Moat', management: 'Management',
    financials: 'Financial Strength', valuation: 'Valuation', tailwinds: 'Industry Tailwinds',
    optionality: 'Optionality'
  };
  const items = Object.entries(scores).map(([k, v]) => `
    <div class="score-item">
      <div class="lbl">${esc(labels[k] || k)}</div>
      <div class="val">${Number(v).toFixed(0)}<span style="color:var(--ink-faint);font-size:12px">/10</span></div>
      <div class="score-bar"><i style="width:${Math.min(100, Number(v) * 10)}%"></i></div>
    </div>`).join('');
  return section('Evaluation Scores', `<div class="score-grid">${items}</div>`);
}

function renderGates(gates) {
  if (!gates?.length) return '';
  const rows = gates.map(g => `
    <div class="gate">
      <div class="gate-icon ${g.pass ? 'pass' : 'fail'}">${g.pass ? '✓' : '✗'}</div>
      <div>
        <div class="gate-name">${esc(g.gate)}</div>
        <div class="gate-note">${esc(g.note)}</div>
      </div>
    </div>`).join('');
  return section('Decision Gates', rows);
}

function renderFlags(flags) {
  if (!flags?.length) return '';
  const rows = flags.map(f => `
    <div class="flag">
      <span class="flag-state ${f.triggered ? 'on' : 'off'}">${f.triggered ? 'TRIGGERED' : 'CLEAR'}</span>
      <div class="flag-text">
        <div class="flag-name">${esc(f.flag)}</div>
        <div class="flag-note">${esc(f.note)}</div>
      </div>
    </div>`).join('');
  return section('Anti-Hype Filter', rows);
}

function renderQA(qs) {
  if (!qs?.length) return '';
  const rows = qs.map(q => `
    <div class="qa">
      <div class="q">${esc(q.question)}</div>
      <div class="a">${esc(q.answer)}</div>
    </div>`).join('');
  return section('The Five Research Questions', rows);
}

function renderSections(s) {
  if (!s) return '';
  const order = [
    ['executiveSummary', 'Executive Summary'],
    ['investmentThesis', 'Investment Thesis'],
    ['businessOverview', 'Business Overview'],
    ['industryAnalysis', 'Industry Analysis'],
    ['competitivePosition', 'Competitive Position'],
    ['managementReview', 'Management Review'],
    ['financialAnalysis', 'Financial Analysis'],
    ['hiddenAssets', 'Hidden Asset Analysis'],
    ['risks', 'Risks'],
    ['valuationAssessment', 'Valuation Assessment']
  ];
  return order
    .filter(([k]) => s[k])
    .map(([k, title]) => section(title, `<p>${esc(s[k])}</p>`))
    .join('');
}

function renderScenarios(sc) {
  if (!sc) return '';
  const card = (key, title) => {
    const s = sc[key];
    if (!s) return '';
    return `
      <div class="scenario ${key}">
        <h4>${title}</h4>
        <p>${esc(s.summary)}</p>
        <ul>${(s.drivers || []).map(d => `<li>${esc(d)}</li>`).join('')}</ul>
      </div>`;
  };
  return section('Bull / Base / Bear',
    `<div class="scenarios">${card('bull', 'Bull Case')}${card('base', 'Base Case')}${card('bear', 'Bear Case')}</div>`);
}

init();
