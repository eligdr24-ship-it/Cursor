const form = document.getElementById('researchForm');
const reportOutput = document.getElementById('reportOutput');
const loadSample = document.getElementById('loadSample');
const copyReport = document.getElementById('copyReport');
const printReport = document.getElementById('printReport');
const liveScore = document.getElementById('liveScore');
const liveDecision = document.getElementById('liveDecision');
const scoreRing = document.getElementById('scoreRing');

const weights = {
  growth: 12,
  margins: 9,
  roic: 13,
  fcf: 10,
  balance: 8,
  management: 13,
  tailwinds: 8,
  valuation: 12
};

const sample = {
  company: 'Copart',
  ticker: 'CPRT',
  overview: 'Online salvage vehicle auction marketplace serving insurers, dismantlers, rebuilders, dealers, and exporters. The business deserves to exist because it helps insurance companies dispose of total-loss vehicles efficiently while giving buyers broad digital access to inventory.',
  mispricing: 'The market may underappreciate the durability of the marketplace, owned yard infrastructure, international expansion runway, and countercyclical elements when vehicle losses rise.',
  moatEvidence: 'Two-sided marketplace liquidity, proprietary auction technology, insurance carrier integrations, nationwide yard network, operating history, and scale-driven buyer demand create replacement difficulty.',
  hiddenAssets: 'Owned and leased yard infrastructure, buyer data, international platform know-how, insurer relationships, and auction software could be worth more than a simple services multiple implies.',
  growthEngines: 'International auctions, expanded catastrophic-loss services, additional insurer relationships, and deeper digital tools for buyers and sellers.',
  managementNotes: 'Founder-influenced culture, conservative balance sheet, high reinvestment discipline, and a long record of expanding capacity ahead of demand.',
  risks: 'Insurer concentration, lower total-loss frequency, regulatory constraints on yards, international execution, competition from IAA/RB Global, and valuation compression.',
  changeMind: 'Sustained share loss with major insurance carriers, declining returns on new yards, weakening buyer liquidity, or capital allocation that materially reduces balance-sheet flexibility.',
  bull: 'Marketplace liquidity compounds globally, insurers continue outsourcing salvage disposal, international markets scale, and high ROIC reinvestment continues.',
  base: 'Steady domestic growth, selective international success, resilient margins, and continued cash generation support long-term compounding at a solid but lower rate.',
  bear: 'Growth slows as mature markets saturate, competition pressures pricing, international returns disappoint, and the valuation multiple normalizes.',
  metrics: 'Revenue growth by region, service gross margin, operating margin, ROIC, free cash flow conversion, yard capacity, insurer wins/losses, international revenue mix, and net cash.',
  sliders: {
    growth: 8,
    margins: 8,
    roic: 9,
    fcf: 8,
    balance: 9,
    management: 8,
    tailwinds: 7,
    valuation: 5
  },
  moats: ['network effects', 'distribution advantage', 'proprietary technology', 'mission-critical product'],
  hype: ['The thesis is already widely accepted.']
};

function field(name) {
  return form.elements[name];
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function clean(value, fallback = 'Needs further research.') {
  const text = String(value || '').trim();
  return text ? escapeHtml(text) : fallback;
}

function checkedValues(name) {
  return [...form.querySelectorAll(`input[name="${name}"]:checked`)].map(input => input.value);
}

function scoreInput(name) {
  return Number(field(name)?.value || 0);
}

function sentenceList(items, fallback = 'No durable advantage selected yet.') {
  if (!items.length) return fallback;
  if (items.length === 1) return items[0];
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
}

function splitBullets(value, fallback) {
  const lines = String(value || '')
    .split(/\n|;/)
    .map(line => line.trim())
    .filter(Boolean);
  const items = lines.length ? lines : [fallback];
  return `<ul>${items.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`;
}

function evidenceStrength(text, moatCount) {
  const words = String(text || '').trim().split(/\s+/).filter(Boolean).length;
  if (words >= 45 && moatCount >= 3) return 'Strong evidence';
  if (words >= 20 && moatCount >= 2) return 'Moderate evidence';
  if (words >= 8 || moatCount > 0) return 'Weak evidence';
  return 'Speculative';
}

function calculate() {
  const moatValues = checkedValues('moats');
  const hypeValues = checkedValues('hype');
  const weighted = Object.entries(weights).reduce((sum, [name, weight]) => {
    return sum + (scoreInput(name) / 10) * weight;
  }, 0);
  const moatScore = Math.min(15, moatValues.length * 2.6 + (String(field('moatEvidence').value).trim().length > 80 ? 4 : 0));
  const hiddenAssetScore = String(field('hiddenAssets').value).trim().length > 60 ? 5 : String(field('hiddenAssets').value).trim() ? 2 : 0;
  const baseScore = weighted + moatScore + hiddenAssetScore;
  const hypePenalty = hypeValues.length * 4;
  const gates = [];

  if (scoreInput('growth') < 5) gates.push('No credible long-term growth runway has been established.');
  if (moatValues.length < 2 && scoreInput('roic') < 7) gates.push('Durable competitive advantage is not yet proven.');
  if (scoreInput('management') < 5) gates.push('Management or capital allocation quality is below the Atlas threshold.');
  if (scoreInput('valuation') < 5) gates.push('Valuation leaves little apparent upside based on current inputs.');
  if (String(field('mispricing').value).trim().length < 40 && String(field('hiddenAssets').value).trim().length < 40) {
    gates.push('No clear market misconception or hidden value has been identified.');
  }

  const gatePenalty = gates.length * 8;
  const score = Math.max(0, Math.min(100, Math.round(baseScore - hypePenalty - gatePenalty)));

  let rating = 'Reject / research incomplete';
  if (score >= 90 && !gates.length) rating = 'Exceptional compounder candidate';
  else if (score >= 75 && gates.length <= 1) rating = 'High-quality, worth deep follow-up';
  else if (score >= 60) rating = 'Interesting but incomplete thesis';
  else if (score >= 40) rating = 'Watchlist only';

  let portfolioDecision = 'No';
  if (score >= 80 && !gates.length) portfolioDecision = 'Yes, candidate for deeper diligence';
  else if (score >= 60) portfolioDecision = 'Not yet';

  return { score, rating, gates, hypeValues, moatValues, portfolioDecision };
}

function updateLiveScore() {
  const { score, rating } = calculate();
  liveScore.textContent = score;
  scoreRing.style.setProperty('--score', score);
  liveDecision.textContent = rating;
}

function scoreBand(score) {
  if (score >= 90) return '90-100: exceptional compounder candidate';
  if (score >= 75) return '75-89: high-quality, worth deep follow-up';
  if (score >= 60) return '60-74: interesting but incomplete thesis';
  if (score >= 40) return '40-59: watchlist only';
  return 'Below 40: reject or research incomplete';
}

function generateReport(event) {
  event.preventDefault();
  const result = calculate();
  const company = clean(field('company').value, 'Unnamed company');
  const ticker = clean(field('ticker').value, 'Ticker not provided');
  const moatEvidence = field('moatEvidence').value;
  const evidence = evidenceStrength(moatEvidence, result.moatValues.length);
  const businessQuality = Math.round((scoreInput('growth') + scoreInput('margins') + scoreInput('roic') + scoreInput('fcf') + scoreInput('balance')) * 2);
  const valuationAttractiveness = Math.round(scoreInput('valuation') * 10);
  const moatText = sentenceList(result.moatValues.map(escapeHtml));
  const hypeText = result.hypeValues.length
    ? splitBullets(result.hypeValues.join('\n'), 'No anti-hype concerns selected.')
    : '<p>No explicit anti-hype red flags selected. Continue testing whether the thesis is already consensus.</p>';
  const gateWarnings = result.gates.length
    ? result.gates.map(gate => `<div class="gate-warning"><strong>Decision gate warning:</strong> ${escapeHtml(gate)}</div>`).join('')
    : '<p><span class="evidence-tag">All decision gates passed in preview</span></p>';

  reportOutput.innerHTML = `
    <h1>Project Atlas Research Report: ${company}</h1>
    <p class="report-meta">${ticker} · Preview generated ${new Date().toLocaleDateString()} · Evidence grade: ${evidence}</p>

    <div class="report-badge-row">
      <div class="report-badge"><span>Final conviction</span><strong>${result.score}/100</strong>${scoreBand(result.score)}</div>
      <div class="report-badge"><span>Portfolio decision</span><strong>${result.portfolioDecision}</strong>Would this deserve one of 20 long-term positions?</div>
      <div class="report-badge"><span>Rating</span><strong>${result.rating}</strong>Probability-weighted preview, not a trade call.</div>
    </div>

    ${gateWarnings}

    <h2>Executive Summary</h2>
    <p>${company} receives a preview conviction score of <strong>${result.score}/100</strong>. The current conclusion is <strong>${result.rating}</strong>. This report is based only on the evidence entered into the preview builder, so missing financial data, valuation inputs, and source citations should be treated as diligence gaps rather than facts.</p>

    <h2>Investment Thesis</h2>
    <p>${clean(field('mispricing').value)} For the company to be worth substantially more in 10-15 years, the growth runway must remain open, reinvestment must stay attractive, and the identified advantages must translate into durable free cash flow growth.</p>

    <h2>Business Overview</h2>
    <p>${clean(field('overview').value)}</p>

    <h2>Industry Analysis</h2>
    <p>Industry tailwind score: <strong>${scoreInput('tailwinds')}/10</strong>. The preview needs more source-backed evidence on end-market growth, cyclicality, regulation, customer budgets, and how industry structure affects long-term returns.</p>

    <h2>Competitive Position</h2>
    <p>Selected moat sources: <strong>${moatText}</strong>.</p>
    <p>${clean(moatEvidence, 'No moat evidence entered yet.')}</p>

    <h2>Management Review</h2>
    <p>Management score: <strong>${scoreInput('management')}/10</strong>. ${clean(field('managementNotes').value)}</p>

    <h2>Financial Analysis</h2>
    <div class="score-breakdown">
      <div class="score-item"><span>Business quality</span><strong>${businessQuality}/100</strong>Growth, margins, ROIC, FCF, balance sheet.</div>
      <div class="score-item"><span>Valuation attractiveness</span><strong>${valuationAttractiveness}/100</strong>Upside after considering execution risk.</div>
      <div class="score-item"><span>Evidence strength</span><strong>${evidence}</strong>Based on entered notes and moat support.</div>
    </div>
    <ul>
      <li>Growth runway: ${scoreInput('growth')}/10</li>
      <li>Margins / unit economics: ${scoreInput('margins')}/10</li>
      <li>ROIC / reinvestment: ${scoreInput('roic')}/10</li>
      <li>Free cash flow quality: ${scoreInput('fcf')}/10</li>
      <li>Balance sheet strength: ${scoreInput('balance')}/10</li>
    </ul>

    <h2>Hidden Asset Analysis</h2>
    <p>${clean(field('hiddenAssets').value)}</p>

    <h2>Second Growth Engines</h2>
    <p>${clean(field('growthEngines').value)}</p>

    <h2>Anti-Hype Filter</h2>
    ${hypeText}

    <h2>Risks</h2>
    ${splitBullets(field('risks').value, 'Risk work is incomplete. Add competitive, regulatory, financial, execution, and valuation risks.')}

    <h2>Bull / Base / Bear Case</h2>
    <div class="case-grid">
      <div class="case-card"><h3>Bull Case</h3><p>${clean(field('bull').value)}</p></div>
      <div class="case-card"><h3>Base Case</h3><p>${clean(field('base').value)}</p></div>
      <div class="case-card"><h3>Bear Case</h3><p>${clean(field('bear').value)}</p></div>
    </div>

    <h2>Valuation Assessment</h2>
    <p>Valuation upside score: <strong>${scoreInput('valuation')}/10</strong>. The preview can flag whether valuation appears attractive, but the full system should add current price, market cap, enterprise value, normalized earnings, free cash flow, ROIC, and scenario-based intrinsic value estimates.</p>

    <h2>Key Metrics to Monitor</h2>
    ${splitBullets(field('metrics').value, 'Metrics are not yet defined. Add operating, financial, and thesis-specific KPIs.')}

    <h2>What Would Change Your Mind</h2>
    <p>${clean(field('changeMind').value)}</p>

    <h2>Final Conviction Rating</h2>
    <p><strong>${result.score}/100</strong> — ${result.rating}. The strongest next step is to replace subjective scores with source-backed financials, filings, valuation assumptions, and disconfirming evidence.</p>
  `;

  updateLiveScore();
  reportOutput.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function populateSample() {
  Object.entries(sample).forEach(([key, value]) => {
    if (key === 'sliders' || key === 'moats' || key === 'hype') return;
    field(key).value = value;
  });

  form.querySelectorAll('input[type="checkbox"]').forEach(input => {
    input.checked = sample.moats.includes(input.value) || sample.hype.includes(input.value);
  });

  Object.entries(sample.sliders).forEach(([name, value]) => {
    field(name).value = value;
  });

  syncOutputs();
  updateLiveScore();
  document.getElementById('builder').scrollIntoView({ behavior: 'smooth' });
}

function syncOutputs() {
  form.querySelectorAll('input[type="range"]').forEach(input => {
    const output = form.querySelector(`[data-output="${input.name}"]`);
    if (output) output.textContent = input.value;
  });
}

function getReportText() {
  return reportOutput.innerText.trim();
}

form.addEventListener('submit', generateReport);
form.addEventListener('input', () => {
  syncOutputs();
  updateLiveScore();
});
form.addEventListener('reset', () => {
  window.setTimeout(() => {
    syncOutputs();
    updateLiveScore();
    reportOutput.innerHTML = '<p class="placeholder">Complete the form and generate a preview report. The output will appear here.</p>';
  }, 0);
});

loadSample.addEventListener('click', populateSample);
copyReport.addEventListener('click', async () => {
  const text = getReportText();
  if (!text || text.startsWith('Complete the form')) {
    alert('Generate a report before copying.');
    return;
  }
  try {
    await navigator.clipboard.writeText(text);
    copyReport.textContent = 'Copied';
    window.setTimeout(() => { copyReport.textContent = 'Copy'; }, 1200);
  } catch {
    alert('Copy failed. Select the report text and copy manually.');
  }
});
printReport.addEventListener('click', () => window.print());

syncOutputs();
updateLiveScore();
