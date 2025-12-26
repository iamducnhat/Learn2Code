# Learn2Code - System Design Document

> A web application that helps users deeply understand programming code by explaining it in their own words.

---

## 1. LEARNING FLOW

### Complete User Journey

```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐    ┌──────────────┐
│  Landing    │───▶│  Language    │───▶│  Difficulty │───▶│  Code        │
│  Page       │    │  Selection   │    │  Selection  │    │  Presentation│
└─────────────┘    └──────────────┘    └─────────────┘    └──────────────┘
                                                                  │
      ┌───────────────────────────────────────────────────────────┘
      ▼
┌─────────────┐    ┌──────────────┐    ┌─────────────┐    ┌──────────────┐
│  Unit       │───▶│  User        │───▶│  AI         │───▶│  Feedback    │
│  Display    │    │  Explanation │    │  Evaluation │    │  Display     │
└─────────────┘    └──────────────┘    └─────────────┘    └──────────────┘
                                                                  │
      ┌───────────────────────────────────────────────────────────┘
      ▼
┌─────────────┐    ┌──────────────┐
│  Next Unit  │───▶│  Progress    │
│  or Summary │    │  Dashboard   │
└─────────────┘    └──────────────┘
```

### Step-by-Step Flow

#### 1.1 Landing Page
- **Display**: App title "Learn2Code" with tagline
- **CTA**: "Let's get started" button
- **Optional**: Brief 3-step explanation of how it works
- **No login required** for first experience (guest mode)

#### 1.2 Language Selection
- **Options**: C, Python, C++, Java (as shown in mockup)
- **Visual**: Color-coded buttons (cyan=C, green=Python, purple=C++, yellow=Java)
- **Multi-select**: Users can select multiple languages to learn
- **Recommendation badge**: "Start here" for Python beginners

#### 1.3 Difficulty Selection
- Three tiers: Beginner → Intermediate → Advanced
- **Smart default**: Auto-suggest based on selected language
- Brief description of what each level covers

#### 1.4 Code Presentation
```
┌─────────────────────────────────────────────────────┐
│  Code Snippet #1: Hello World                       │
│  Language: C  |  Difficulty: Beginner  |  Units: 4  │
├─────────────────────────────────────────────────────┤
│  1 │ #include <stdio.h>          ← HIGHLIGHTED      │
│  2 │                                                │
│  3 │ int main() {                                   │
│  4 │     printf("Hello, World!");                   │
│  5 │     return 0;                                  │
│  6 │ }                                              │
├─────────────────────────────────────────────────────┤
│  Unit 1 of 4: Explain what this line does          │
│  ┌───────────────────────────────────────────────┐  │
│  │ Type your explanation here...                 │  │
│  └───────────────────────────────────────────────┘  │
│  [Skip] [Hint] [Submit]                             │
└─────────────────────────────────────────────────────┘
```

#### 1.5 Question Generation
- Current unit is **visually highlighted** in the code
- Context lines shown but dimmed
- Question prompt: "Explain what this line/block does in plain English"
- **Hint system**: Available after 30 seconds or on request

#### 1.6 User Input
- Multi-line text area (min 10 chars, max 500 chars)
- Character counter visible
- "I don't know" option (counts as skip, shows explanation)
- Voice input option (accessibility)

#### 1.7 AI Evaluation
- Loading state: "Analyzing your explanation..."
- 1-3 second processing time
- No page reload (async evaluation)

#### 1.8 Feedback Display
```
┌─────────────────────────────────────────────────┐
│  ✓ Correct!                                     │
│  ───────────────────────────────────────────    │
│  Your explanation captures the key concept.     │
│                                                 │
│  Reference explanation:                         │
│  "This line includes the standard input/output  │
│   library, which provides functions like        │
│   printf() for displaying text on screen."     │
│                                                 │
│  [Continue to Next Unit →]                      │
└─────────────────────────────────────────────────┘
```

#### 1.9 Progress Tracking
- Progress bar: "3/4 units completed"
- Accuracy score: "85% correct"
- Streak indicator: "🔥 3 correct in a row"
- Session summary at end of each snippet

---

## 2. CODE SPLITTING LOGIC

### 2.1 Splitting Strategies

#### Line-Based Splitting
Used for simple statements where one line = one concept.

```c
printf("Hello");  // Single unit
```

#### Semantic Block Splitting
Groups related lines into logical teaching units.

```c
// Block: Loop structure
for (int i = 0; i < 10; i++) {
    printf("%d\n", i);
}
```

### 2.2 Unit Types Taxonomy

| Unit Type | Description | Example |
|-----------|-------------|---------|
| `include` | Library import | `#include <stdio.h>` |
| `function_signature` | Function definition line | `int main()` |
| `variable_declaration` | Variable creation | `int x = 5;` |
| `variable_assignment` | Value assignment | `x = 10;` |
| `function_call` | Calling a function | `printf("Hi");` |
| `loop_structure` | For/while/do-while | `for(...)` block |
| `conditional` | If/else/switch | `if(...) {...}` |
| `return_statement` | Return value | `return 0;` |
| `pointer_operation` | Pointer usage | `int *p = &x;` |
| `array_operation` | Array access/modify | `arr[0] = 1;` |
| `struct_definition` | Struct declaration | `struct Point {...}` |
| `comment_block` | (excluded from questions) | `// comment` |

### 2.3 Output JSON Format

```json
[
  {
    "id": 1,
    "code": "#include <stdio.h>",
    "line_start": 1,
    "line_end": 1,
    "unit_type": "include",
    "reference_explanation": "This line tells the compiler to include the standard input/output library. This library contains functions like printf() that let us display text on the screen.",
    "difficulty": "beginner",
    "key_concepts": ["library", "include", "stdio", "preprocessor"],
    "common_misconceptions": ["This is not executable code - it's a preprocessor directive"]
  },
  {
    "id": 2,
    "code": "int main() {",
    "line_start": 3,
    "line_end": 3,
    "unit_type": "function_signature",
    "reference_explanation": "This line declares the main function, which is the entry point of every C program. 'int' means this function will return an integer value. The empty parentheses () mean this function takes no input parameters.",
    "difficulty": "beginner",
    "key_concepts": ["main function", "entry point", "return type", "parameters"],
    "common_misconceptions": ["main() is not optional - every C program must have it"]
  },
  {
    "id": 3,
    "code": "printf(\"Hello, World!\\n\");",
    "line_start": 4,
    "line_end": 4,
    "unit_type": "function_call",
    "reference_explanation": "This line calls the printf function to display the text 'Hello, World!' on the screen. The \\n at the end creates a new line after the text, like pressing Enter.",
    "difficulty": "beginner",
    "key_concepts": ["printf", "function call", "string", "newline character"],
    "common_misconceptions": ["printf doesn't automatically add a new line - you must include \\n"]
  },
  {
    "id": 4,
    "code": "return 0;",
    "line_start": 5,
    "line_end": 5,
    "unit_type": "return_statement",
    "reference_explanation": "This line ends the main function and returns the value 0 to the operating system. Returning 0 typically means the program ran successfully without errors.",
    "difficulty": "beginner",
    "key_concepts": ["return", "exit code", "success indicator"],
    "common_misconceptions": ["0 means success, not failure - non-zero values indicate errors"]
  }
]
```

### 2.4 Avoiding Overwhelm

1. **Maximum 6 units per snippet** for beginners
2. **Semantic grouping**: Related lines are combined (e.g., for loop header + body)
3. **Progressive disclosure**: Advanced concepts hidden until user is ready
4. **Chunk size control**: No unit longer than 5 lines
5. **Familiar-first ordering**: Start with concepts similar to Python for C learners

---

## 3. AI PROMPTS

### 3.A Code → Teaching Units Prompt

```markdown
# SYSTEM PROMPT: Code Teaching Unit Generator

You are an expert programming instructor specializing in teaching beginners. Your task is to split source code into logical teaching units and create beginner-friendly explanations.

## INPUT
- Source code in {language}
- Target difficulty level: {difficulty}
- User's background: {background} (e.g., "Python programmer learning C")

## RULES

1. **Splitting Rules**:
   - Group semantically related lines together
   - Never split a loop or conditional across units
   - Include opening brace with declaration, closing brace as separate unit only if meaningful
   - Maximum 5 lines per unit for beginners, 10 for advanced
   - Skip empty lines and pure comment lines

2. **Explanation Rules**:
   - Use plain English, avoid jargon
   - If jargon is necessary, define it inline
   - Reference analogies to Python when user background is Python
   - Keep explanations under 50 words for beginners, 100 for advanced
   - Focus on WHAT and WHY, not just HOW

3. **Difficulty Adaptation**:
   - BEGINNER: Explain every concept, use analogies
   - INTERMEDIATE: Assume basic syntax knowledge, focus on nuances
   - ADVANCED: Assume proficiency, focus on edge cases and best practices

4. **Key Concepts Extraction**:
   - List 2-5 key concepts per unit
   - These are used for semantic matching during evaluation

## OUTPUT FORMAT

Return ONLY valid JSON array:
```json
[
  {
    "id": <sequential_number>,
    "code": "<exact_code_string>",
    "line_start": <number>,
    "line_end": <number>,
    "unit_type": "<type_from_taxonomy>",
    "reference_explanation": "<beginner_friendly_explanation>",
    "difficulty": "<beginner|intermediate|advanced>",
    "key_concepts": ["<concept1>", "<concept2>"],
    "common_misconceptions": ["<misconception1>"],
    "python_equivalent": "<optional: equivalent Python code if applicable>"
  }
]
```

## EXAMPLE INPUT

```c
#include <stdio.h>

int main() {
    int sum = 0;
    for (int i = 1; i <= 10; i++) {
        sum += i;
    }
    printf("Sum: %d\n", sum);
    return 0;
}
```

## EXAMPLE OUTPUT

[
  {
    "id": 1,
    "code": "#include <stdio.h>",
    "line_start": 1,
    "line_end": 1,
    "unit_type": "include",
    "reference_explanation": "This includes the standard input/output library, similar to Python's built-in print() being available by default. In C, we must explicitly import this library to use printf().",
    "difficulty": "beginner",
    "key_concepts": ["library import", "stdio.h", "preprocessor"],
    "common_misconceptions": ["Unlike Python, C requires explicit imports for basic I/O"],
    "python_equivalent": "# No import needed - print() is built-in"
  },
  ...
]

Now process this code:
```{language}
{code}
```
```

### 3.B User Explanation → Semantic Evaluation Prompt

```markdown
# SYSTEM PROMPT: Semantic Explanation Evaluator

You are an expert at evaluating whether a student's explanation demonstrates understanding of a code concept. You compare MEANING, not exact wording.

## INPUT
```json
{
  "code_unit": "<the code being explained>",
  "unit_type": "<type of code unit>",
  "reference_explanation": "<the correct explanation>",
  "key_concepts": ["<list of concepts that should be understood>"],
  "user_explanation": "<what the user wrote>",
  "difficulty_level": "<beginner|intermediate|advanced>",
  "language": "<programming language>"
}
```

## EVALUATION CRITERIA

### Correct (confidence 80-100)
- User demonstrates understanding of the core purpose
- May use different words but same meaning
- Covers at least 80% of key concepts
- Minor inaccuracies that don't affect understanding are OK

### Partially Correct (confidence 40-79)
- User understands some but not all key concepts
- Missing important details
- Has some correct ideas mixed with gaps
- Shows partial understanding that can be built upon

### Incorrect (confidence 0-39)
- Fundamental misunderstanding of the code's purpose
- Completely wrong explanation
- Describes something unrelated
- Empty or nonsensical response

## SEMANTIC MATCHING RULES

1. **Synonyms are acceptable**:
   - "prints" = "displays" = "outputs" = "shows"
   - "variable" = "value holder" = "storage"
   - "loop" = "repeat" = "iterate"

2. **Analogies count as correct**:
   - "It's like a container for numbers" ✓ (for variable)
   - "It's like a recipe instruction" ✓ (for function)

3. **Technical precision scales with difficulty**:
   - BEGINNER: Loose matching, analogies welcomed
   - INTERMEDIATE: Expect correct terminology
   - ADVANCED: Expect precise technical accuracy

4. **Do NOT penalize**:
   - Grammar mistakes
   - Spelling errors
   - Informal language
   - Different ordering of concepts

5. **DO penalize**:
   - Factually incorrect statements
   - Dangerous misunderstandings (e.g., "return 0 means error")
   - Missing critical concepts for the difficulty level

## OUTPUT FORMAT

Return ONLY valid JSON:
```json
{
  "result": "Correct | Partially Correct | Incorrect",
  "confidence_score": <0-100>,
  "reason": "<1-2 sentence explanation of the evaluation>",
  "matched_concepts": ["<concepts the user correctly identified>"],
  "missing_concepts": ["<important concepts the user missed>"],
  "misconceptions": ["<any incorrect beliefs detected>"],
  "encouragement": "<positive, constructive message>",
  "hint_for_retry": "<if not Correct, a hint without giving away the answer>"
}
```

## EXAMPLE

INPUT:
```json
{
  "code_unit": "for (int i = 0; i < 10; i++)",
  "unit_type": "loop_structure",
  "reference_explanation": "This creates a for loop that repeats 10 times. It starts a counter 'i' at 0, continues while i is less than 10, and adds 1 to i after each repetition.",
  "key_concepts": ["for loop", "initialization", "condition", "increment", "iteration count"],
  "user_explanation": "this makes the code run 10 times using i as a counter starting from zero",
  "difficulty_level": "beginner",
  "language": "C"
}
```

OUTPUT:
```json
{
  "result": "Correct",
  "confidence_score": 85,
  "reason": "The user correctly identified the loop runs 10 times and uses 'i' as a counter starting from 0. They captured the essential purpose.",
  "matched_concepts": ["for loop", "iteration count", "initialization"],
  "missing_concepts": ["increment mechanism (i++)"],
  "misconceptions": [],
  "encouragement": "Great job! You understood the main purpose of this loop.",
  "hint_for_retry": null
}
```

Now evaluate:
```json
{input_json}
```
```

---

## 4. FEEDBACK DESIGN

### 4.1 Immediate Feedback States

#### ✅ Correct
```
┌─────────────────────────────────────────────────────┐
│  ✅ Correct!                                        │
│                                                     │
│  "Great job! You understood the main purpose."      │
│                                                     │
│  📚 Reference explanation:                          │
│  [Shows full reference explanation]                 │
│                                                     │
│  💡 Did you know?                                   │
│  [Optional interesting fact about this concept]     │
│                                                     │
│  [Continue →]                                       │
└─────────────────────────────────────────────────────┘
```

#### 🟡 Partially Correct
```
┌─────────────────────────────────────────────────────┐
│  🟡 Partially Correct                               │
│                                                     │
│  You got the main idea! Here's what you missed:    │
│                                                     │
│  Missing concepts:                                  │
│  • The return value indicates program success       │
│  • 0 specifically means "no errors"                │
│                                                     │
│  Your explanation:                                  │
│  [User's text - highlighted gaps]                   │
│                                                     │
│  📚 Reference explanation:                          │
│  [Shows full reference explanation]                 │
│                                                     │
│  [Try Again] [Continue Anyway →]                    │
└─────────────────────────────────────────────────────┘
```

#### ❌ Incorrect
```
┌─────────────────────────────────────────────────────┐
│  ❌ Not quite right                                 │
│                                                     │
│  Don't worry - this is how we learn!               │
│                                                     │
│  💡 Hint:                                          │
│  "Think about what happens when the program        │
│   finishes running..."                              │
│                                                     │
│  [Try Again] [Show Answer]                         │
└─────────────────────────────────────────────────────┘
```

### 4.2 Feedback Principles

| Principle | Implementation |
|-----------|----------------|
| **Growth mindset** | Never say "Wrong!" - use "Not quite" or "Almost there" |
| **Show progress** | Highlight what WAS correct before showing gaps |
| **Encourage retry** | Max 3 attempts before showing answer |
| **No punishment** | Skipping doesn't affect overall score negatively |
| **Contextual hints** | Hints relate to the specific misconception |
| **Reference always shown** | After final attempt, always show the reference |

### 4.3 Retry Flow

```
Attempt 1 → Incorrect → Hint Level 1 (vague)
    ↓
Attempt 2 → Incorrect → Hint Level 2 (more specific)
    ↓
Attempt 3 → Incorrect → Show full answer + explanation
    ↓
Mark as "Needs Review" → Add to spaced repetition queue
```

---

## 5. DIFFICULTY LEVELS

### 5.1 Level Definitions

#### 🟢 Beginner
**Target**: First-time programmers or Python users learning C

**Included Concepts**:
- Variable declaration and assignment
- Basic data types (int, char, float)
- printf/scanf basics
- Simple if/else
- Basic for/while loops
- Simple functions with no parameters

**Excluded Concepts**:
- Pointers
- Memory allocation
- Structs
- File I/O
- Recursion
- Multi-dimensional arrays

**Code Characteristics**:
```c
// Max 15 lines
// Max 4 teaching units
// No nested structures
// Clear variable names
```

**Explanation Style**:
- Heavy use of analogies
- Python comparisons when applicable
- Define every technical term
- Max 40 words per explanation

#### 🟡 Intermediate
**Target**: Comfortable with basics, learning language-specific features

**Added Concepts**:
- Pointers (single level)
- Arrays
- Structs
- Functions with parameters/return
- String manipulation
- Basic file operations

**Code Characteristics**:
```c
// Max 30 lines
// Max 8 teaching units
// Single nesting allowed
// Standard naming conventions
```

**Explanation Style**:
- Assume basic terminology known
- Focus on "why" not just "what"
- Point out common bugs
- Max 70 words per explanation

#### 🔴 Advanced
**Target**: Preparing for professional code or interviews

**Added Concepts**:
- Double pointers
- Dynamic memory (malloc/free)
- Complex data structures
- Recursion
- Bitwise operations
- Preprocessor macros

**Code Characteristics**:
```c
// Max 50 lines
// Max 12 teaching units
// Multiple nesting
// Real-world patterns
```

**Explanation Style**:
- Technical precision required
- Edge cases discussed
- Performance implications
- Max 100 words per explanation

### 5.2 Adaptive Difficulty

```
User Performance Tracking:
├── Last 10 attempts accuracy
├── Time spent per unit
├── Retry frequency
└── Concept mastery map

Auto-adjustment Rules:
├── >90% accuracy for 5 snippets → Suggest level up
├── <50% accuracy for 3 snippets → Suggest level down
├── Specific concept <60% → Add targeted practice
└── Fast completion + high accuracy → Challenge mode
```

---

## 6. TECHNICAL ARCHITECTURE

### 6.1 System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │   Next.js    │  │   Monaco     │  │   TailwindCSS        │  │
│  │   App Router │  │   Editor     │  │   + shadcn/ui        │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         BACKEND                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │   Next.js    │  │   Prisma     │  │   NextAuth.js        │  │
│  │   API Routes │  │   ORM        │  │   (Auth)             │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
┌──────────────────┐ ┌──────────────┐ ┌──────────────────────────┐
│   PostgreSQL     │ │    Redis     │ │   OpenAI / Claude API    │
│   (Supabase)     │ │   (Cache)    │ │   (AI Processing)        │
└──────────────────┘ └──────────────┘ └──────────────────────────┘
```

### 6.2 Technology Stack

| Layer | Technology | Justification |
|-------|------------|---------------|
| **Framework** | Next.js 14+ (App Router) | Full-stack, great DX, Vercel deployment |
| **Language** | TypeScript | Type safety, better IDE support |
| **Styling** | TailwindCSS + shadcn/ui | Rapid development, consistent design |
| **Code Editor** | Monaco Editor | VSCode-quality highlighting |
| **Database** | PostgreSQL (Supabase) | Reliable, free tier, real-time |
| **ORM** | Prisma | Type-safe queries, migrations |
| **Auth** | NextAuth.js | Easy OAuth, session management |
| **Cache** | Redis (Upstash) | AI response caching, rate limiting |
| **AI Provider** | OpenAI GPT-4o-mini / Claude 3 Haiku | Cost-effective, fast |
| **Hosting** | Vercel | Seamless Next.js deployment |

### 6.3 Data Models

```prisma
// prisma/schema.prisma

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  image         String?
  createdAt     DateTime  @default(now())
  
  attempts      Attempt[]
  progress      Progress[]
  preferences   UserPreferences?
}

model UserPreferences {
  id              String   @id @default(cuid())
  userId          String   @unique
  user            User     @relation(fields: [userId], references: [id])
  
  selectedLanguages String[] // ["c", "python"]
  difficultyLevel   String   @default("beginner")
  dailyGoal         Int      @default(5)
}

model CodeSnippet {
  id          String   @id @default(cuid())
  title       String
  description String?
  code        String   @db.Text
  language    String   // "c", "python", "cpp", "java"
  difficulty  String   // "beginner", "intermediate", "advanced"
  category    String?  // "loops", "functions", "pointers"
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  
  units       TeachingUnit[]
  attempts    Attempt[]
}

model TeachingUnit {
  id                    String   @id @default(cuid())
  snippetId             String
  snippet               CodeSnippet @relation(fields: [snippetId], references: [id])
  
  orderIndex            Int
  code                  String   @db.Text
  lineStart             Int
  lineEnd               Int
  unitType              String
  referenceExplanation  String   @db.Text
  keyConcepts           String[] // ["loop", "counter", "increment"]
  commonMisconceptions  String[]
  pythonEquivalent      String?
  
  attempts              Attempt[]
}

model Attempt {
  id              String   @id @default(cuid())
  userId          String
  user            User     @relation(fields: [userId], references: [id])
  snippetId       String
  snippet         CodeSnippet @relation(fields: [snippetId], references: [id])
  unitId          String
  unit            TeachingUnit @relation(fields: [unitId], references: [id])
  
  userExplanation String   @db.Text
  result          String   // "correct", "partial", "incorrect"
  confidenceScore Int
  matchedConcepts String[]
  missingConcepts String[]
  attemptNumber   Int      @default(1)
  timeSpentMs     Int?
  createdAt       DateTime @default(now())
}

model Progress {
  id              String   @id @default(cuid())
  userId          String
  user            User     @relation(fields: [userId], references: [id])
  
  language        String
  difficulty      String
  conceptsMastered String[]
  snippetsCompleted Int    @default(0)
  totalAttempts    Int     @default(0)
  correctAttempts  Int     @default(0)
  currentStreak    Int     @default(0)
  lastActivityAt   DateTime?
  
  @@unique([userId, language, difficulty])
}
```

### 6.4 API Endpoints

```typescript
// API Route Structure

// Code & Units
GET    /api/snippets                    // List snippets (filtered)
GET    /api/snippets/[id]              // Get snippet with units
POST   /api/snippets/[id]/generate     // Generate units via AI

// Learning Flow
POST   /api/evaluate                    // Evaluate user explanation
GET    /api/progress                    // Get user progress
POST   /api/attempts                    // Record attempt

// User
GET    /api/user/preferences           // Get preferences
PATCH  /api/user/preferences           // Update preferences
```

### 6.5 AI Cost Optimization

```typescript
// strategies/ai-optimization.ts

const AI_OPTIMIZATION_STRATEGIES = {
  // 1. Cache generated teaching units (they don't change)
  cacheUnits: {
    key: (snippetId: string) => `units:${snippetId}`,
    ttl: 60 * 60 * 24 * 30, // 30 days
  },
  
  // 2. Cache common evaluations
  cacheEvaluations: {
    key: (unitId: string, explanationHash: string) => 
      `eval:${unitId}:${explanationHash}`,
    ttl: 60 * 60 * 24 * 7, // 7 days
  },
  
  // 3. Use cheaper models for simple evaluations
  modelSelection: {
    simple: 'gpt-4o-mini',      // ~$0.15/1M tokens
    complex: 'gpt-4o',           // ~$2.50/1M tokens
    threshold: 0.7,              // Use complex if confidence < 0.7
  },
  
  // 4. Batch requests when possible
  batchEvaluations: {
    maxBatchSize: 5,
    timeoutMs: 100,
  },
  
  // 5. Pre-generate units for popular snippets
  preGeneration: {
    triggerViews: 10,
    languages: ['c', 'python'],
  },
};
```

**Estimated Costs (1000 daily users)**:
| Operation | Calls/Day | Tokens/Call | Cost/Day |
|-----------|-----------|-------------|----------|
| Unit Generation | 100 | 2000 | $0.03 |
| Evaluation | 5000 | 500 | $0.38 |
| **Total** | | | **~$12/month** |

---

## 7. MVP SCOPE (7-Day Plan)

### Day 1: Foundation
- [x] Project setup (Next.js, TypeScript, Tailwind)
- [x] Database schema (Prisma + Supabase)
- [x] Basic UI components (Button, Card, Input)
- [x] Landing page with "Get Started" flow
- **Deliverable**: Clickable landing page

### Day 2: Code Display
- [ ] Monaco Editor integration
- [ ] Syntax highlighting for C, Python
- [ ] Line highlighting component
- [ ] Code snippet display page
- **Deliverable**: Can view code with highlighting

### Day 3: AI Integration
- [ ] OpenAI API setup
- [ ] Unit generation prompt implementation
- [ ] Evaluation prompt implementation
- [ ] Basic caching with Redis
- **Deliverable**: AI generates units from code

### Day 4: Learning Flow
- [ ] Unit navigation (next/prev)
- [ ] User input form
- [ ] Submit and evaluate flow
- [ ] Feedback display components
- **Deliverable**: Complete single snippet flow

### Day 5: Progress & Data
- [ ] User authentication (NextAuth)
- [ ] Attempt recording
- [ ] Progress tracking
- [ ] Basic dashboard
- **Deliverable**: Logged-in experience

### Day 6: Content & Polish
- [ ] 10 beginner C snippets
- [ ] 10 beginner Python snippets
- [ ] Difficulty selection
- [ ] Mobile responsive fixes
- **Deliverable**: Usable content library

### Day 7: Testing & Deploy
- [ ] End-to-end testing
- [ ] Error handling
- [ ] Vercel deployment
- [ ] Basic analytics
- **Deliverable**: Live MVP

### MVP Cuts (If Time Limited)

| Feature | Priority | Cut? |
|---------|----------|------|
| User auth | High | Keep (use guest mode) |
| C + Python | High | Keep |
| C++ + Java | Medium | **CUT** |
| Progress dashboard | Medium | **CUT** (add later) |
| Difficulty levels | Medium | **CUT** (only beginner) |
| Hints system | Low | **CUT** |
| Voice input | Low | **CUT** |
| Spaced repetition | Low | **CUT** |

### Essential MVP Features
1. ✅ View code snippets
2. ✅ See highlighted teaching units
3. ✅ Write explanations
4. ✅ Get AI feedback
5. ✅ See correct answer
6. ✅ Move to next unit
7. ✅ Basic guest mode

---

## 8. EDUCATIONAL PRINCIPLES

### 8.1 Active Recall
**What**: Forcing retrieval of knowledge from memory strengthens learning.

**Implementation**:
- User must type explanation before seeing the answer
- No multiple choice (forces generation, not recognition)
- Spaced repetition for missed concepts (post-MVP)

**Evidence**: Karpicke & Roediger (2008) - Testing effect produces 50% better retention than re-reading.

### 8.2 Explanation-Based Learning (Self-Explanation Effect)
**What**: Explaining concepts in your own words deepens understanding.

**Implementation**:
- Free-form text input (not fill-in-blank)
- Semantic evaluation (meaning, not keywords)
- Encourage analogies and personal language

**Evidence**: Chi et al. (1994) - Self-explanation doubles learning gains vs. passive reading.

### 8.3 Error-Driven Feedback
**What**: Mistakes are learning opportunities when followed by immediate, specific feedback.

**Implementation**:
- Instant feedback after submission
- Specific missing concepts highlighted
- Misconceptions explicitly addressed
- Reference shown AFTER attempt (not before)

**Evidence**: Metcalfe (2017) - Errors followed by feedback produce better learning than errorless learning.

### 8.4 Desirable Difficulties
**What**: Challenges that slow learning initially but improve long-term retention.

**Implementation**:
- No comments in code (forces active processing)
- Must explain before seeing answer
- Increasing difficulty progression

**Evidence**: Bjork & Bjork (2011) - Difficulties that require effort improve durable learning.

### 8.5 Worked Examples → Problem Solving Transition
**What**: Beginners learn better from examples, experts from problem-solving.

**Implementation**:
- Beginner: Smaller units, more context
- Advanced: Larger blocks, less hand-holding
- Adaptive difficulty based on performance

**Evidence**: Kalyuga et al. (2003) - Expertise reversal effect in learning.

---

## Appendix: Sample Code Snippets

### Beginner C - Hello World
```c
#include <stdio.h>

int main() {
    printf("Hello, World!\n");
    return 0;
}
```

### Beginner C - Variables
```c
#include <stdio.h>

int main() {
    int age = 25;
    float height = 1.75;
    char grade = 'A';
    
    printf("Age: %d\n", age);
    printf("Height: %.2f\n", height);
    printf("Grade: %c\n", grade);
    
    return 0;
}
```

### Beginner Python - Loop
```python
numbers = [1, 2, 3, 4, 5]
total = 0

for num in numbers:
    total = total + num

print("Sum:", total)
```

### Intermediate C - Pointers
```c
#include <stdio.h>

int main() {
    int x = 10;
    int *ptr = &x;
    
    printf("Value of x: %d\n", x);
    printf("Address of x: %p\n", &x);
    printf("Value of ptr: %p\n", ptr);
    printf("Value pointed by ptr: %d\n", *ptr);
    
    return 0;
}
```

---

## Quick Start Commands

```bash
# Create project
npx create-next-app@latest learn2code --typescript --tailwind --app

# Add dependencies
npm install @prisma/client @monaco-editor/react openai next-auth
npm install -D prisma

# Initialize Prisma
npx prisma init

# Run development
npm run dev
```

---

*Document Version: 1.0*  
*Last Updated: December 25, 2024*  
*Author: System Architect*
