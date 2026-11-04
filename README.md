# BABEL – Language Deciphering & Knowledge Discovery Game

BABEL is an interactive game where players decode trivia questions written in foreign languages, using Power-up tools to unravel meaning — then answer with their knowledge.

## 🎮 Features (Sprint 1 MVP)

- **Language Expedition** – Journey through Finnish, Spanish, French, German & English
- **6 Power-ups** – Lexicon, Pattern Recognition, Grammar Decoder, Contextual Clue, Partial & Full Translation
- **Spaced Repetition** – Smart vocabulary review scheduling
- **Language Notebook** – Track every word discovered
- **Progress Dashboard** – Proficiency tracking, achievements, game history
- **Daily Challenge** – One shared question for all players

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite + Vanilla CSS |
| Backend (Sprint 2) | Python FastAPI |
| Database (Sprint 2) | SQLite → PostgreSQL |
| AI Engine (Sprint 3) | spaCy, scikit-learn |

## 🚀 Getting Started

```bash
# Install and run frontend
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

## 📂 Project Structure

```
Babel/
├── frontend/          # React Vite app (Sprint 1)
│   ├── src/
│   │   ├── pages/     # All screen components
│   │   ├── components/# Shared UI components
│   │   ├── data/      # Mock data
│   │   └── index.css  # Design system
│   └── ...
├── backend/           # FastAPI (Sprint 2 - coming soon)
└── OVERVIEW.md        # Full project specification
```

## 📅 Sprint Plan

- **Sprint 1 (Week 1):** React frontend with all screens ✅
- **Sprint 2 (Week 2):** FastAPI backend + SQLite DB
- **Sprint 3 (Week 3):** AI Engine (NLP, difficulty, spaced repetition)
