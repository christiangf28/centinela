# Centinela — Predictive Clinical Management Platform

> Hospital intelligence platform for Chilean public hospitals. Monitors GES compliance, predicts clinical risk, and generates AI-powered executive reports.

## Overview

Centinela gives hospital directors and managers something Chilean public hospitals never had: **anticipation**. It predicts clinical risk, monitors GES guarantee compliance, and generates recommendations before problems occur.

**Demo login:** click the "Acceso demo →" button — no credentials needed.
> Or manually: `director@hospital.cl` / `demo1234` · Demo user: Dr. Frankenstein, Hospital de Curicó

## Features

| Module | Description |
|--------|-------------|
| **Dashboard** | Real-time KPIs, bed map by clinical complexity, historical LOS chart vs. DEIS/MINSAL benchmark |
| **Lista de Espera** | GES/non-GES patient queue with compliance % KPI, "expiring this week" alert banner, MINSAL export |
| **Predicción** | Deterministic LOS and ICU admission risk from diagnosis + comorbidities, AI-generated clinical narrative |
| **Reportes** | AI executive report generator with .txt export and email sending |
| **Datos** | Drag & drop CSV upload → privacy confirmation → AI analysis of historical datasets |

## Stack

- **React 19** + **Vite 8** — pure SPA, no backend
- **Claude API** (claude-sonnet-4-6) — AI narratives, GES analysis, executive reports
- Inline styles only — no UI library, DM Sans / DM Mono fonts
- All data hardcoded — ready for HL7/FHIR integration

## Getting Started

```bash
npm install
```

Create `.env` in the project root:

```
ANTHROPIC_API_KEY=your_key_here
```

```bash
npm run dev   # http://localhost:5173
npm run build
```

> The API key is read server-side via a Vite middleware — it is never exposed to the browser.

## Clinical Context

The platform targets the Chilean public hospital system regulated by **GES (Garantías Explícitas en Salud)**. GES guarantees legally mandate maximum wait times; non-compliance triggers financial penalties. Centinela surfaces compliance risk before deadlines are breached.

Terminology is deliberately aligned with Chilean regulatory language:
- `INCUMPLIMIENTO` — GES breach (not clinical risk)
- `SANCIÓN POSIBLE` — financial penalty imminent
- `EN RIESGO GES` — approaching deadline
- **Score de Complejidad Clínica** — based on diagnosis, age, comorbidities, and care unit (not an ML black box)

## Privacy

- Prediction and Reports: no patient identifiers are sent to the Claude API
- Wait List: only anonymized IDs (`p.id`) are used in prompts
- CSV upload: explicit privacy confirmation modal before sending to external API
- Compliant with Chilean Law 19.628 / 20.584

## Demo Datasets

In `public/datasets/` — drag them into the **Datos** tab:
- `pacientes_historicos.csv` — 50 patients with diagnosis, LOS, comorbidities, readmission, risk index
- `lista_espera_extendida.csv` — 30 GES/non-GES patients from real Santiago communities

## License

MIT
