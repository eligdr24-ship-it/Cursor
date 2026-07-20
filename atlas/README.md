# Project Atlas — Preview

An institutional-style equity research system built around the Atlas master prompt. It evaluates whether a business could be an exceptional long-term (10–15 year) compounder — and rejects everything else.

This is the **preview version**: the full framework, UI, and API are in place, running on two fully-worked sample reports. Plug in an LLM API key to unlock live analysis of any ticker.

## Run it

```bash
cd atlas
node server.js
# open http://localhost:4000
```

No dependencies. Requires Node 18+.

## Two modes

| Mode | How | What you get |
|------|-----|--------------|
| **Demo** (default) | Just run it | Two complete sample reports: ASML (PASS, 82/100) and Peloton (REJECT, 18/100). The system refuses to fabricate research for other tickers. |
| **Live** | Set `OPENAI_API_KEY` or `ANTHROPIC_API_KEY` | Type any ticker; the full Atlas master prompt runs against the model and returns a structured report that is saved to `data/reports/` and appears in Coverage. |

```bash
OPENAI_API_KEY=sk-... node server.js
# or
ANTHROPIC_API_KEY=sk-ant-... node server.js
```

Optional: `ATLAS_PORT`, `ATLAS_OPENAI_MODEL`, `ATLAS_ANTHROPIC_MODEL`.

## What the preview demonstrates

- **The full report structure** — all 14 deliverables from the master prompt: executive summary, thesis, business overview, industry analysis, competitive position, management review, financial analysis, hidden assets, risks, bull/base/bear, valuation, metrics to monitor, what would change your mind, and a 0–100 conviction rating.
- **Decision gates as hard filters** — five pass/fail gates rendered with reasons. Peloton's report shows how a company gets rejected even when the stock is cheap.
- **Anti-hype filter** — each of the four hype flags is explicitly evaluated (note ASML's "thesis already widely accepted" flag is TRIGGERED, which is why its conviction is 82 and not 95).
- **The 20-position test** — every report ends with an explicit answer to the portfolio question.
- **Structured output** — reports are strict JSON (`prompts/atlas-master-prompt.md` defines the schema), so they can be screened, sorted, and compared, not just read.

## API

| Endpoint | Description |
|----------|-------------|
| `GET /api/status` | Mode (demo/live) and report count |
| `GET /api/reports` | Coverage list, sorted by conviction |
| `GET /api/reports/:ticker` | Full report JSON |
| `POST /api/analyze` `{"ticker":"ASML"}` | Return existing report, or run live analysis (`"force": true` to regenerate) |
| `GET /api/prompt` | The master prompt (also viewable in the UI) |

## Roadmap to the full system

1. **Financial data layer** — pull real fundamentals (revenue, margins, ROIC, FCF, balance sheet) from a data provider so the model reasons over actual numbers instead of its training memory.
2. **Multi-pass pipeline** — separate research passes (business, financials, management, hidden assets) followed by a devil's-advocate pass that attacks the thesis before the final verdict.
3. **Screening funnel** — batch mode: feed in a universe (e.g. an index), auto-reject on decision gates, and surface only the survivors.
4. **Monitoring** — track "Key Metrics to Monitor" per report and flag when a "What Would Change My Mind" condition triggers.
5. **Report history** — re-run analyses quarterly and diff conviction over time.
