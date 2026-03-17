# MedLab Academy 🔬
**HOSA Foundations of Medical Terminology — Interactive Training App**

Built with Python + Flask + Claude API. Same stack as Tongues.

---

## Project Structure

```
medlab-academy/
├── app.py                  ← Flask backend (2 AI routes)
├── requirements.txt
├── render.yaml             ← One-click Render deploy config
└── templates/
    └── index.html          ← Full game frontend
```

---

## Local Setup

### 1. Clone / create the repo
```bash
mkdir medlab-academy && cd medlab-academy
# copy all files in
```

### 2. Create a virtual environment
```bash
python3 -m venv venv
source venv/bin/activate        # Mac/Linux
venv\Scripts\activate           # Windows
```

### 3. Install dependencies
```bash
pip install -r requirements.txt
```

### 4. Set your API key
```bash
export ANTHROPIC_API_KEY=sk-ant-...     # Mac/Linux
set ANTHROPIC_API_KEY=sk-ant-...        # Windows
```

### 5. Run locally
```bash
python app.py
```
Open http://localhost:5000

---

## Deploy to Render

1. Push this folder to a new GitHub repo
2. Go to https://render.com → New → Web Service
3. Connect your GitHub repo
4. Render auto-detects `render.yaml` — click **Deploy**
5. Go to Environment → add `ANTHROPIC_API_KEY` = your key
6. Done! Live URL provided by Render

---

## API Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/` | GET | Serves the game |
| `/chat` | POST | Dr. Morph AI tutor responses |
| `/analyze-source` | POST | Extracts terms from pasted study material |

---

## Game Modes

- 🧬 **Word Builder** — Assemble medical terms from prefix/root/suffix parts
- 🔍 **Diagnosis Detective** — Clinical scenario MCQ
- ⚡ **Term Match** — Tap-to-pair matching game
- 🃏 **Flashcard Lab** — Flip cards, self-rate
- 📋 **Patient Story** — Fill-in-the-blank ER chart

## Features

- 3 difficulty levels (Easy / Medium / Hard)
- XP + level progression system
- Dr. Morph AI tutor (adapts to chat commands like "make it harder")
- Paste-in source material → AI extracts and indexes terms
- Built-in HOSA-aligned term bank for all 3 difficulties
