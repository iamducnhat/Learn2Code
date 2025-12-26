# Learn2Code

A web application that helps users deeply understand programming code by explaining it in their own words.

## 🎯 Core Concept

- View code snippets in C, Python, C++, or Java (no comments)
- AI splits code into logical teaching units
- Explain each unit in plain English
- Get AI-powered semantic evaluation
- Learn through understanding, not memorization

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your OPENAI_API_KEY to .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Code Editor**: Monaco Editor
- **Database**: PostgreSQL (Prisma ORM)
- **AI**: OpenAI GPT-4o-mini

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Landing page
│   ├── learn/page.tsx     # Language & difficulty selection
│   └── practice/page.tsx  # Main learning interface
├── components/            # React components
│   ├── code-editor.tsx    # Monaco editor wrapper
│   ├── feedback-card.tsx  # Evaluation feedback display
│   ├── progress-bar.tsx   # Progress tracking
│   └── selectors.tsx      # Language/difficulty selectors
└── lib/
    ├── prompts/           # AI prompt templates
    │   ├── code-splitter.ts
    │   └── evaluation.ts
    ├── data/              # Sample snippets
    │   └── sample-snippets.ts
    └── services/          # AI service layer
        └── ai-service.ts
```

## 🎓 Learning Flow

1. **Landing** → "Let's get started"
2. **Language Selection** → Choose C, Python, C++, or Java
3. **Difficulty Selection** → Beginner, Intermediate, Advanced
4. **Code Presentation** → See code with highlighted teaching unit
5. **Explain** → Write what the code does in plain English
6. **Feedback** → Get AI evaluation with missing concepts
7. **Progress** → Move to next unit or retry

## 🧠 AI Prompts

Two production-ready prompts are included:

1. **Code Splitter** (`src/lib/prompts/code-splitter.ts`)
   - Splits code into semantic teaching units
   - Generates beginner-friendly explanations
   - Extracts key concepts for evaluation

2. **Evaluation** (`src/lib/prompts/evaluation.ts`)
   - Semantic comparison (meaning, not keywords)
   - Identifies matched/missing concepts
   - Provides constructive feedback and hints

## 📊 Database Schema

See `prisma/schema.prisma` for the complete data model including:
- Users & Preferences
- Code Snippets & Teaching Units
- Attempts & Progress tracking
- AI response caching

## 🔧 Environment Variables

```env
# Database
DATABASE_URL="postgresql://..."

# OpenAI
OPENAI_API_KEY="sk-..."

# Auth (optional)
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"
```

## 📚 Documentation

See [SYSTEM_DESIGN.md](./SYSTEM_DESIGN.md) for:
- Complete learning flow diagrams
- AI prompt specifications
- Feedback design guidelines
- Difficulty level definitions
- Technical architecture
- 7-day MVP plan
- Educational principles

## 🎨 Design

The UI follows the mockups with:
- Dark theme (#1a1a1a background)
- Primary accent: #00ff87 (green)
- Language colors: C (cyan), Python (green), C++ (purple), Java (yellow)
- Monospace font for code (JetBrains Mono)

## 📝 License

MIT
