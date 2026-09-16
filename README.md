# AI Drug Optimization Agent Prototype

A front-end research prototype for an **AI Drug Optimization Agent**: a conversational interface that orchestrates multi-step molecular optimization workflows through a typed **service abstraction layer**.

This repository is intended for academic demonstration and architecture review. It shows how an agent-style UI can drive structured optimization pipelines (structure image, SMILES, and target/PDB entry points) while remaining replaceable at the service boundary.

> **Important:** All current “backend” capabilities are **mock interfaces**. No live large language models, RAG indexes, ADMET predictors, docking engines, or generative chemistry services are shipped or called. Delays and result payloads are simulated for interaction design and workflow evaluation.

---

## Goals

| Goal | What this prototype provides |
|------|------------------------------|
| Agent interaction design | Chat sessions, quick-start actions, streaming-style status, and structured result cards |
| Workflow architecture | A workflow engine that emits typed events across stages (parse → assess → retrieve → propose) |
| Service abstraction | Stable TypeScript interfaces for LLM, molecule parsing, ADMET, knowledge retrieval, and docking/generation |
| Future integration path | Mock factories that can be swapped for real LLM / RAG / drug-model HTTP clients without rewriting the chat UI |

---

## Scope (what is and is not implemented)

### Implemented (front-end prototype)

- Marketing homepage (hero, feature tabs, demo modal)
- Mock authentication (register / login via `localStorage`; no server accounts)
- Agent chat UI with conversation list, delete, and welcome quick actions
- Three **simulated** optimization workflows with stage progress and result cards
- Injectable mock service registry used by the workflow runner

### Not implemented (future work)

- Real LLM inference or tool-calling backends
- Real RAG / literature retrieval over a curated corpus
- Real ADMET, docking, or molecule-generation models
- Persistent multi-user database or production auth
- Regulatory or clinical decision support

---

## Agent workflow architecture

User messages and quick actions enter a **workflow engine**. The engine advances through stages and publishes UI events (status labels, thinking accordion, molecule/ADMET/route/candidate cards). Stage work is delegated to a **service abstraction layer**; today every service returns mock data with short artificial latency.

```text
User input (chat / quick action)
        │
        ▼
┌───────────────────────────┐
│  Agent workflow engine    │  stage orchestration + WorkflowEvent stream
└─────────────┬─────────────┘
              │
              ▼
┌───────────────────────────┐
│  Service abstraction      │  shared request/response TypeScript types
└─────────────┬─────────────┘
              │
              ▼
┌───────────────────────────┐
│  Mock service adapters    │  current implementation (local only)
│  (LLM · parse · ADMET ·   │
│   knowledge · docking)    │
└───────────────────────────┘
              │
              ▼  (future)
┌───────────────────────────┐
│  Real backends            │  LLM APIs, RAG, QSAR/ADMET, docking, generators
└───────────────────────────┘
```

### Entry workflows (mock)

1. **Structure image** — mock uploaded structure → parse → ADMET-style assessment → optimization routes  
2. **SMILES** — property-focused path (e.g. metabolic stability / hepatotoxicity framing)  
3. **Target / PDB** — mock pocket / target context → candidate proposals → affinity + ADMET-style panels  

These paths demonstrate **agent orchestration**, not validated scientific prediction.

---

## Service abstraction layer

Services live under:

`src/components/sites/.../chat/workflow/services/`

| Interface (conceptual) | Role today (mock) | Intended future integration |
|------------------------|-------------------|-----------------------------|
| LLM service | Intent / step labels / route text | Chat, planning, or structured-generation APIs |
| Molecule parsing | Image / SMILES / target parse stubs | OCSR, cheminformatics toolkits, PDB loaders |
| ADMET prediction | Fixed demo property panels | QSAR / ADMET model endpoints |
| Knowledge retrieval | Similar molecules & literature stubs | Embedding search / RAG over domain corpora |
| Docking / generation | Candidate lists & affinity stubs | Docking engines / generative chemistry APIs |

Registration is centralized (e.g. `createDrugAgentServices`). Replacing a mock factory with an HTTP client that implements the same types is the intended integration path; the chat shell and event stream can remain unchanged.

---

## Technology stack

- **Next.js** (App Router)
- **React** + **TypeScript**
- **Tailwind CSS**

---

## Project layout

```text
src/
  app/                 # Routes: /, /login, /chat
  components/sites/    # Homepage, auth, chat, workflow UI + mock services
  lib/                 # Client auth helpers
public/
  sites/               # Static images, videos, fonts
docs/
  screenshots/         # Optional release screenshots (not required to run the app)
```

---

## Installation

**Requirements:** Node.js **20+** (see `engines` in `package.json`).

```bash
git clone https://github.com/qqlang1114/drug-agent-clone.git
cd drug-agent-clone
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run typecheck` | TypeScript check |
| `npm run lint` | ESLint |

---

## Usage (prototype walkthrough)

1. Open the homepage at `http://localhost:3000`.
2. Register or log in (mock auth: username length ≥ 2, password length ≥ 4; credentials stay in the browser).
3. You are redirected to `/chat` with a **new empty** conversation when arriving from homepage entry links.
4. On the welcome screen, use one of the three **quick actions** to start a mock workflow:
   - Structure-image optimization (includes a demo molecule attachment)
   - SMILES property optimization
   - Target / PDB-oriented generation
5. Observe simulated agent stages and structured result cards. Sidebar history stores prior sessions in `localStorage` for the signed-in mock user.

Homepage feature buttons only navigate to chat; they do **not** start workflows or inject molecules.

---

## Screenshots

Optional images for GitHub / reports may be placed under `docs/screenshots/`:

| Screen | Suggested file |
|--------|----------------|
| Homepage | [`docs/screenshots/homepage.png`](docs/screenshots/homepage.png) |
| Login | [`docs/screenshots/login.png`](docs/screenshots/login.png) |
| Chat | [`docs/screenshots/chat.png`](docs/screenshots/chat.png) |
| Workflow run | [`docs/screenshots/workflow.png`](docs/screenshots/workflow.png) |

Capture notes: [`docs/screenshots/README.md`](docs/screenshots/README.md).

---

## Future work

1. Implement real clients behind the existing service interfaces (LLM, parsing, ADMET, RAG/knowledge, docking/generation).
2. Wire authentication and session persistence to a proper backend if multi-user deployment is required.
3. Add evaluation harnesses (latency, schema validation, scientific offline metrics) once real models are connected.

Until then, treat all optimization outputs as **illustrative UI fixtures**.

---

## License

MIT — see [LICENSE](LICENSE).
