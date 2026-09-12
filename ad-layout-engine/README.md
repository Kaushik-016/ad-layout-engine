# Adaptive Layout Engine

> **A constraint-based ad layout engine that automatically adapts one creative across multiple advertising surfaces — without relying on a separate hard-coded template for every size.**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7.x-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Vitest](https://img.shields.io/badge/Vitest-5.x-6E9F18?logo=vitest&logoColor=white)](https://vitest.dev/)
[![Tests](https://img.shields.io/badge/tests-22%20passing-brightgreen)](#testing)
[![Performance](https://img.shields.io/badge/layout%20generation-%3C0.02ms%20avg-brightgreen)](#performance)

---

## 🎯 What is this?

Digital advertising creatives are rarely displayed at the same dimensions in which they were originally designed.

A single creative may need to appear as a:

- square social post
- vertical story
- landscape card
- leaderboard banner
- skyscraper
- mobile banner
- or an arbitrary custom size

Simply scaling the original composition is often not enough. Extreme aspect ratios can make text unreadable, create excessive empty space, or force important elements into poor positions.

**Adaptive Layout Engine** approaches this as a layout-generation problem.

Instead of asking:

> "How do I scale this ad?"

the engine asks:

> **"Given this ad's semantic elements, constraints, priorities, and target surface, what is the best valid arrangement?"**

The system generates multiple layout candidates, scores them, rejects invalid arrangements, and selects the best-scoring candidate.

---

## 🚀 Live Demo

**[Try the Adaptive Layout Engine](https://ad-layout-engine-omega.vercel.app/)**

The application is deployed on Vercel and can be used directly in the browser.

- Create an ad from custom headline, subtext, and CTA content
- Select predefined advertising surfaces
- Test custom dimensions
- Generate adaptive layouts automatically
- Compare how the same creative behaves across different aspect ratios

---

## ✨ Core Idea

The engine represents an advertisement as **semantic elements** rather than treating it as one indivisible image.

For example:

```text
Advertisement
│
├── Headline      → high priority
├── Image         → important visual
├── Supporting    → optional
├── CTA           → high priority
└── Logo          → optional / important
```

Each element carries constraints such as:

```ts
{
  minWidth: 100,
  minHeight: 30,
  lockAspectRatio: false,
  canHide: false
}
```

This allows the engine to make deliberate trade-offs when space becomes limited.

### The key design principle

> **Flexible visual elements can adapt to available space, while fixed-readability text elements are protected by minimum size constraints.**

That distinction is central to the system.

---

# 🧠 How the Algorithm Works

The layout engine follows a deterministic pipeline:

```text
                 ┌─────────────────┐
                 │   Ad + Surface  │
                 └────────┬────────┘
                          │
                          ▼
                ┌───────────────────┐
                │ Candidate         │
                │ Generation        │
                └─────────┬─────────┘
                          │
              ┌───────────┴───────────┐
              ▼                       ▼
     ┌────────────────┐      ┌────────────────┐
     │ Vertical Stack │      │ Horizontal Row │
     └───────┬────────┘      └───────┬────────┘
             │                       │
             └───────────┬───────────┘
                         ▼
                ┌───────────────────┐
                │ Constraint &      │
                │ Quality Scoring   │
                └─────────┬─────────┘
                          │
                          ▼
                ┌───────────────────┐
                │ Validate / Reject │
                │ Invalid Candidates│
                └─────────┬─────────┘
                          │
                          ▼
                ┌───────────────────┐
                │ Highest-Scoring   │
                │ Valid Layout      │
                └───────────────────┘
```

---

## 1. Semantic Ad Model

An ad is represented using an `Ad` object containing semantic elements.

Current element types include:

- `headline`
- `image`
- `subtext`
- `cta`
- `logo`

Each element has:

| Property | Purpose |
|---|---|
| `type` | Semantic role of the element |
| `content` | Text or image source |
| `priority` | Relative importance |
| `minWidth` | Minimum usable width |
| `minHeight` | Minimum usable height |
| `lockAspectRatio` | Whether aspect ratio should be preserved |
| `canHide` | Whether the element may be removed |

This gives the layout engine enough information to make controlled decisions instead of blindly scaling everything.

---

# 2. Candidate Generation

For every target surface, the engine generates candidate arrangements using layout strategies.

## Vertical Stack

The vertical strategy is suitable for square and portrait-oriented surfaces.

A simplified arrangement is:

```text
┌──────────────────────┐
│                      │
│      HEADLINE        │
│      Subtext         │
│                      │
│        IMAGE         │
│                      │
│       [ CTA ]        │
│                      │
└──────────────────────┘
```

The strategy considers:

- available width
- available height
- padding
- element dimensions
- spacing
- minimum constraints
- surface geometry

---

## Horizontal Row

The horizontal strategy is useful for wide surfaces such as leaderboard banners.

Conceptually:

```text
┌──────────────────────────────────────────────┐
│ HEADLINE / SUBTEXT                [ CTA ]    │
└──────────────────────────────────────────────┘
```

For very constrained horizontal surfaces, optional supporting content can be removed rather than forcing every element into an unreadable composition.

---

# 3. Constraint-Based Scoring

Generated candidates are evaluated using `scoreLayout()`.

The scorer considers factors such as:

### Constraint satisfaction

Elements should remain above their minimum dimensions.

### Bounds

Elements should remain within the target surface.

### Priority

High-priority elements receive stronger protection from poor sizing.

### Surface usage

The composition should make useful use of the available space without overflowing.

Conceptually:

```text
Layout Score
    =
    Base Score
    - Constraint Penalties
    - Overflow Penalties
    - Priority/Size Penalties
    + Surface-Usage Reward
```

The engine then selects the highest-scoring valid candidate.

---

# 4. Progressive Degradation

The engine does not immediately throw away the original composition when a surface becomes difficult.

Instead, it progressively degrades the layout.

### General strategy

```text
Preferred arrangement
        ↓
Reduce unnecessary spacing
        ↓
Use available flexible space
        ↓
Preserve minimum readable text sizes
        ↓
Hide optional content if necessary
        ↓
Preserve critical content
```

For example, on an extremely short banner, the engine can prioritize:

```text
HEADLINE                              CTA
```

while allowing optional supporting text to disappear.

This is preferable to shrinking every element until the entire creative becomes technically "fitted" but practically unreadable.

---

# Why Constraint-Based Instead of Template-Based?

A traditional implementation might define a template for every supported surface:

```text
SquareTemplate
StoryTemplate
LeaderboardTemplate
SkyscraperTemplate
MobileBannerTemplate
...
```

That can produce polished results for known formats, but it becomes increasingly difficult to maintain when arbitrary dimensions are introduced.

This project instead models the problem as:

> **Given arbitrary dimensions and semantic constraints, generate and evaluate possible compositions.**

### Advantages

- supports custom dimensions
- fewer hard-coded layouts
- explicit trade-offs
- deterministic behavior
- easier testing
- easier benchmarking
- layout decisions can be inspected
- new strategies can be added independently

### Trade-off

Constraint-based generation is more general, but its visual quality depends heavily on the heuristics and scoring function.

A template-based system can be more visually polished for a small set of known surfaces, while this approach prioritizes **generalization and explainability**.

---

# 🆚 Adaptive Layout vs Naive Scaling

The project includes a naive baseline to make this comparison measurable.

## Naive baseline

The baseline:

1. starts with a fixed base creative
2. calculates a uniform scale factor
3. scales the elements proportionally
4. preserves the original composition

This is simple and fast, but it does not understand semantic importance.

For example, scaling a complete creative down to a `320 × 50` mobile banner can make the headline and CTA too small while leaving optional supporting content competing for the same limited space.

## Adaptive approach

The adaptive engine instead:

- understands semantic roles
- respects minimum dimensions
- considers element priorities
- generates alternative arrangements
- hides optional content when required
- scores candidates before selecting one

The result is **recomposition instead of blind scaling**.

---

# 📐 Supported Surfaces

The application currently provides six predefined advertising surfaces:

| Surface | Dimensions |
|---|---:|
| Square Post | `300 × 300` |
| Instagram Story | `200 × 400` |
| Leaderboard Banner | `468 × 60` |
| Skyscraper | `120 × 400` |
| Landscape Card | `400 × 220` |
| Mobile Banner | `320 × 50` |

The interface also supports **custom width and height**, allowing the engine to be evaluated beyond predefined formats.

---

# 🧪 Testing

The project currently has **22 automated tests**, and the latest test run completed successfully:

```text
Test Files  3 passed (3)
Tests       22 passed (22)
```

### Test suites

```text
src/tests/layoutEngine.test.ts
src/tests/adaptiveBenchmark.test.ts
src/tests/performance.test.ts
```

---

## Layout Engine Tests

```text
20 tests passed
```

These validate the core layout-generation behavior and constraints.

---

# 📊 Adaptive vs Baseline Benchmark

The benchmark compares the adaptive engine with the naive proportional baseline across six representative surfaces.

| Surface | Adaptive | Baseline | Improvement |
|---|---:|---:|---:|
| 400 × 400 | 88.00 | 104.78 | -16.78 |
| 390 × 844 | 88.00 | 77.21 | **+10.79** |
| 768 × 1024 | 88.00 | 103.59 | -15.59 |
| 1080 × 1080 | 88.00 | 104.78 | -16.78 |
| 1080 × 1920 | 88.00 | 102.69 | -14.69 |
| 1440 × 900 | 88.00 | 102.99 | -14.99 |

### What does this tell us?

The benchmark is intentionally reported without hiding the negative cases.

The current heuristic scorer performs better than the baseline on the constrained `390 × 844` portrait surface, while the naive baseline receives higher raw scores on several larger surfaces.

This exposes an important limitation of the current scoring model:

> **The current scorer still places substantial weight on geometric coverage, meaning that a proportionally scaled composition can sometimes receive a higher raw score even when adaptive recomposition has better semantic/readability characteristics.**

This is valuable from an R&D perspective because it identifies a concrete next step: **improve the scoring function so that readability, hierarchy, and semantic preservation are rewarded more strongly than simple geometric coverage.**

The benchmark therefore acts not only as a performance check, but also as a way to identify weaknesses in the current heuristic model.

---

# ⚡ Performance

The performance test performs **1,000 layout generations per surface**.

| Surface | Runs | Average | Minimum | Maximum |
|---|---:|---:|---:|---:|
| 400 × 400 | 1,000 | 0.0186 ms | 0.0046 ms | 2.3024 ms |
| 390 × 844 | 1,000 | 0.0106 ms | 0.0049 ms | 0.6831 ms |
| 768 × 1024 | 1,000 | 0.0056 ms | 0.0036 ms | 0.5742 ms |
| 1080 × 1080 | 1,000 | 0.0046 ms | 0.0031 ms | 0.1848 ms |
| 1080 × 1920 | 1,000 | 0.0037 ms | 0.0031 ms | 0.2029 ms |
| 1440 × 900 | 1,000 | 0.0047 ms | 0.0033 ms | 0.2006 ms |

### Observation

Average layout generation remains extremely small across all tested surfaces, ranging from:

**0.0037 ms → 0.0186 ms**

This is useful for an interactive application because the core layout computation is lightweight and does not require a network request or model inference.

---

# 🏗️ Architecture

The project is organized around a separation between:

1. **Ad representation**
2. **Layout generation**
3. **Layout scoring**
4. **Rendering**
5. **Testing / benchmarking**

```text
src/
├── components/
│   ├── AdCard.tsx
│   ├── AdSurface.tsx
│   ├── Navbar.tsx
│   ├── RealArtwork.tsx
│   └── SmartAdSurface.tsx
│
├── data/
│   ├── sampleAd.ts
│   └── surfacePresets.ts
│
├── engine/
│   ├── generateLayout.ts
│   ├── naiveLayout.ts
│   ├── naturalSize.ts
│   ├── scoreLayout.ts
│   ├── stackElements.ts
│   ├── types.ts
│   └── strategies/
│       ├── horizontalRow.ts
│       └── verticalStack.ts
│
├── tests/
│   ├── adaptiveBenchmark.test.ts
│   ├── layoutEngine.test.ts
│   └── performance.test.ts
│
├── types/
│   └── ad.ts
│
├── App.tsx
└── main.tsx
```

### Core data flow

```text
Ad Definition
      │
      ▼
generateLayout()
      │
      ├───────────────┐
      ▼               ▼
Vertical Strategy   Horizontal Strategy
      │               │
      └───────┬───────┘
              ▼
       Candidate Layouts
              │
              ▼
         scoreLayout()
              │
              ▼
       Validity Filtering
              │
              ▼
      Best Candidate Selected
              │
              ▼
        SmartAdSurface
              │
              ▼
       Rendered Advertisement
```

---

# 🎨 Application Workflow

The UI is designed around a simple workflow:

```text
Choose an ad
     ↓
Choose a surface
     ↓
Generate adaptive layout
     ↓
Inspect the result
     ↓
Compare / test another surface
```

The project also supports entering new:

- headline
- subtext
- CTA

through the application interface.

The same underlying layout system can then be used to adapt the resulting creative.

---

# 🔬 R&D Design Decisions

## Deterministic core

The core engine is deterministic.

For the same:

```text
ad + target width + target height
```

the engine generates the same candidates and makes the same selection.

This makes the system reproducible and easier to debug.

---

## Semantic priorities

A headline and CTA should not necessarily be treated the same way as a logo or supporting text.

Priorities provide a mechanism for expressing this difference explicitly.

---

## Minimum readability floors

The engine does not treat "fits inside the rectangle" as equivalent to "works as an advertisement."

Text has minimum size constraints so that it is not endlessly shrunk simply to make every element fit.

---

## Optional content is a controlled escape hatch

The `canHide` property provides an explicit mechanism for degradation.

Instead of arbitrary deletion, the engine knows which elements are allowed to disappear.

---

## Engine and AI are decoupled

The core system does not depend on an external AI API.

This is intentional.

A future AI layer can provide better semantic suggestions without making the deterministic layout engine dependent on network availability, API limits, or model output.

---

# ⚠️ Known Limitations

### 1. Extreme aspect ratios

Dimensions such as:

```text
700 × 40
100 × 800
2000 × 200
```

can create layouts where simple geometric heuristics are insufficient to produce a design that a human designer would consider ideal.

---

### 2. Heuristic scoring

The current scorer is primarily geometric and constraint-based.

The benchmark demonstrates that the scoring function does not yet consistently correlate with perceived visual quality.

A future scorer should reward:

- readability
- hierarchy
- whitespace balance
- alignment
- visual saliency
- semantic importance

more strongly.

---

### 3. Browser text metrics

The engine estimates natural element sizes rather than relying entirely on final browser font metrics.

Actual rendered text can therefore differ slightly from the estimates.

---

### 4. Limited candidate strategies

The current candidate-generation system focuses on:

- vertical stacking
- horizontal rows

More sophisticated compositions could improve visual quality for complex creatives.

---

### 5. No automatic creative decomposition

The current system expects semantic elements to be available.

It does not yet take an arbitrary flattened advertisement and automatically discover:

- headline
- subtext
- CTA
- logo
- image regions
- text-safe regions

---

# 🚀 Future Work

## 1. Automatic Image-to-Layout Decomposition

A future version could accept a flattened advertisement and infer its structure automatically.

A possible pipeline:

```text
Flattened Advertisement
          │
          ▼
         OCR
          │
          ▼
   Text Classification
          │
          ▼
 Region / Object Detection
          │
          ▼
 Semantic Element Extraction
          │
          ▼
 Constraint Generation
          │
          ▼
 Adaptive Layout Engine
```

This would allow the system to transform existing creatives without requiring manually defined semantic elements.

---

## 2. AI-Assisted Priority Inference

An optional AI layer could analyze the ad content and suggest initial priorities.

For example:

```text
Headline        → Priority 1
CTA             → Priority 1
Supporting text → Priority 3
Logo            → Priority 2
```

The important architectural decision would be to keep this layer **outside the core engine**.

The deterministic engine would continue to work with sensible defaults even if the AI service is unavailable.

This creates a low-risk **AI-assisted** workflow rather than making the entire application dependent on an LLM.

---

## 3. Improved Visual Scoring

The next generation of the scorer could incorporate:

- text readability
- visual hierarchy
- whitespace balance
- alignment
- contrast
- image saliency
- perceptual similarity

This would help bridge the gap between geometric validity and actual design quality.

---

## 4. More Candidate Strategies

Additional strategies could include:

```text
Split Image / Text
Overlay
Asymmetric Composition
Corner CTA
Centered Composition
Multi-Column
```

The existing candidate → score → select architecture makes this extensible.

---

# 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **React** | Application UI |
| **TypeScript** | Type-safe application and engine implementation |
| **Vite** | Development and production tooling |
| **Vitest** | Automated testing and benchmarking |
| **Lucide React** | UI icons |

The core adaptive layout engine is implemented locally in TypeScript and does not require an external AI service.

---

# 💻 Getting Started

## Prerequisites

- Node.js
- npm

## Installation

```bash
git clone <repository-url>
cd ad-layout-engine
npm install
```

## Start development server

```bash
npm run dev
```

Open the local URL displayed by Vite.

---

# 🧪 Run Tests

Run the complete test suite:

```bash
npm run test
```

Expected result for the current version:

```text
Test Files  3 passed (3)
Tests       22 passed (22)
```

---

# 🏭 Production Build

Create the production build:

```bash
npm run build
```

---

# 🔎 Lint

Run the project's lint checks:

```bash
npm run lint
```

---

# 📁 Important Engine Files

| File | Responsibility |
|---|---|
| `generateLayout.ts` | Main layout generation flow |
| `scoreLayout.ts` | Candidate scoring |
| `naiveLayout.ts` | Proportional baseline |
| `naturalSize.ts` | Natural element sizing |
| `stackElements.ts` | Element stacking / composition |
| `horizontalRow.ts` | Horizontal candidate strategy |
| `verticalStack.ts` | Vertical candidate strategy |
| `types.ts` | Engine-level types |

---

# 📈 Current Project Status

### Implemented

- [x] Semantic ad element model
- [x] Constraint-based layout generation
- [x] Candidate generation
- [x] Vertical layout strategy
- [x] Horizontal layout strategy
- [x] Priority-aware scoring
- [x] Minimum size constraints
- [x] Optional element hiding
- [x] Progressive degradation
- [x] Naive proportional baseline
- [x] Adaptive-vs-baseline benchmark
- [x] Performance benchmark
- [x] Automated test suite
- [x] Six predefined surfaces
- [x] Custom dimensions
- [x] Built-in creatives
- [x] User-created ad content

### Planned

- [ ] Automatic image-to-layout decomposition
- [ ] OCR-based semantic extraction
- [ ] AI-assisted priority inference
- [ ] Saliency-aware image placement
- [ ] Improved visual-quality scoring
- [ ] Additional layout-generation strategies

---

# 🎓 R&D Takeaway

The project explores a practical question:

> **Can a single advertising creative be automatically recomposed across arbitrary surfaces while preserving the elements that matter most?**

The current implementation demonstrates a deterministic answer using:

**semantic elements → constraints → candidate generation → scoring → progressive degradation → best valid layout**

The most important trade-off is between **generalization and visual sophistication**.

Hard-coded templates can be highly polished for a small number of known formats. A constraint-based system is more general and explainable, but requires increasingly sophisticated scoring heuristics to match human design judgment.

The benchmark results make that trade-off visible and provide a concrete direction for future research.

---

## 👨‍💻 Project

**Adaptive Layout Engine**

Built as an R&D-oriented exploration of responsive advertising composition, constraint-based optimization, and automated creative adaptation.

