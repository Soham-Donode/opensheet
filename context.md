# Product Requirements Document (PRD)  
**Opensheet – Unified DSA Practice & Tracking Platform**

**Version**: 1.0 (MVP-focused, updated March 2026)  
**Status**: Pre-development  
**Target Launch**: MVP in 6–10 weeks from start  
**Objective**: Build the cleanest, free, personal DSA interview-prep tracker that solves tab fatigue by merging & tracking multiple popular problem lists in one place.

### 1. Product Overview

**Problem**  
Software engineering interview candidates juggle 5–10 different curated DSA lists (NeetCode 150, Striver A2Z/SDE Sheet, Love Babbar 450, Apna College, Blind 75, etc.), leading to:  
- dozens of open tabs  
- duplicate problems solved multiple times  
- no unified progress view  
- no easy way to combine favorite sheets  
- weak habit formation (streaks, notes, weak-topic focus)

**Solution**  
AlgoMerge is a **free forever**, modern web app that:  
- Maintains one global, deduplicated problem dictionary  
- Lets users subscribe to popular sheets  
- Merges any combination of sheets intelligently  
- Tracks personal progress across all subscribed/merged lists  
- Provides clean topic-wise progress visualization  
- (later) adds streaks, custom sheets, personal notes

**Core Value Proposition**  
One beautiful dashboard instead of ten spreadsheets / Notion pages / browser tabs.

**Target Users**  
- College students & recent grads preparing for internships & placements  
- Working professionals switching jobs (FAANG / high-scale Indian startups)  
- Self-learners following Striver / NeetCode roadmaps

### 2. Success Metrics (MVP)

- Personal usage: creator solves ≥300 problems through the product  
- Retention: ≥40% of users return on ≥5 different days in first 30 days  
- Feature usage: ≥60% of active users merge at least two sheets  
- Qualitative: users say “this replaced my Notion + multiple tabs” in feedback

### 3. MVP Scope – Phase 1 (Must Have)

**3.1 Global Problem Dictionary**  
- Single source of truth for DSA problems  
- Fields per problem: title, url (unique), difficulty (Easy/Medium/Hard), topics (multi-select array)  
- Initial size: ~350–500 manually curated high-value problems (intersection + union of top sheets)  
- No automatic scraping → manual seed + future moderated community additions

**3.2 Predefined Sheets**  
- Static curated lists from popular creators  
- Examples (at launch):  
  - NeetCode 150  
  - Striver SDE Sheet (~180)  
  - Striver A2Z (step-by-step)  
  - Blind 75  
  - Love Babbar 450 (core subset)  
  - Apna College DSA Sheet  
- Each sheet has: name, description, creator credit, list of problem URLs

**3.3 Sheet Subscription & Progress Tracking**  
- User can “subscribe” to one or more predefined sheets  
- Progress is tracked per user × problem (not per sheet)  
- Statuses: todo / in_progress / solved / skipped  
- Solved timestamp recorded  
- Dashboard shows:  
  - Overall completion %  
  - Per-topic progress bars (Array 68%, DP 42%, Graph 19%, etc.)  
  - Unified list of all problems from subscribed sheets (deduplicated)

**3.4 Merging Engine (v1 – Simple & Reliable)**  
- User selects 2+ sheets → system generates merged view  
- Deduplication: by canonical URL  
- Conflict resolution rules:  
  - Title → most common or lexicographically first  
  - Difficulty → easiest rating wins  
  - Topics → union of all tags  
- Sorting: group by topic → within topic by difficulty → within difficulty by title  
- Shows stats: total unique problems, overlap count, new problems added per sheet

**3.5 UI/UX Requirements**  
- Modern, clean, responsive (mobile-first for daily use)  
- shadcn/ui components: data tables, progress bars, modals, cards, dropdowns  
- Dark mode support  
- Fast loading (problems load in <1s, no full-page reloads on filter/change)  
- Accessible (ARIA labels on interactive elements)

### 4. Non-Functional Requirements (MVP)

- **Cost**: zero ongoing cost at <5,000 MAU  
- **Performance**: <2 s page load, <500 ms action response  
- **Security**: users can only read/write their own progress  
- **Data privacy**: minimal PII (only Clerk email/username if provided)  
- **Availability**: Vercel + Supabase free tier SLA sufficient  
- **Browser support**: latest Chrome, Firefox, Safari, Edge

### 5. Out of Scope for MVP (Phase 2+)

- User-created custom sheets  
- Public sharing of custom sheets  
- Streak / heatmap visualization  
- Per-problem markdown notes  
- Advanced merging (tag weighting, weak-first ordering, difficulty normalization)  
- Community problem / sheet contributions  
- Leaderboards / social features  
- Mobile app / PWA install prompt  
- Export to PDF / CSV

### 6. Constraints & Mitigations

- **Legal / Maintenance** — no scraping; manual curation only at launch  
- **Auth complexity** — use native Clerk + Supabase third-party integration (2025–2026 standard)  
- **Database size** — keep notes & heavy fields out of MVP  
- **Merging edge cases** — start with very conservative conflict rules; improve iteratively  
- **Motivation to finish** — product must solve creator’s personal pain first (merged sheet + clean tracker)

### 7. Launch Acceptance Criteria

- Can log in with Google / email  
- Can see and subscribe to at least 4 popular sheets  
- Can mark problems solved / in progress  
- Can merge 2+ sheets and see clean deduplicated list  
- Topic progress bars update correctly  
- All data stays private per user  
- App looks good on phone & desktop  
- Loads fast enough for daily use

This PRD keeps the scope tight, realistic, and laser-focused on delivering the core value: **one beautiful place to track all your DSA practice**.

Let me know which section you want to expand / refine next (e.g. detailed user flows, sheet list priorities, dashboard wireframe ideas, etc.).