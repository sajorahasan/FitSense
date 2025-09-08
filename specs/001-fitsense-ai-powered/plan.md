# Implementation Plan: FitSense AI-Powered Wellness App

**Branch**: `001-fitsense-ai-powered` | **Date**: $(date +%Y-%m-%d) | **Spec**: `/Users/Hasan/Desktop/Hasan/Workspace/FitSense/specs/001-fitsense-ai-powered/spec.md`
**Input**: Feature specification from `/Users/Hasan/Desktop/Hasan/Workspace/FitSense/specs/001-fitsense-ai-powered/spec.md`

## Execution Flow (/plan command scope)
```
1. Load feature spec from Input path
   → Successfully loaded FitSense wellness app specification
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Resolved all tech stack choices from user arguments
   → Detected mobile app project type with backend integration
3. Evaluate Constitution Check section below
   → Architecture violations identified: multiple projects needed for mobile + backend
   → Documented in Complexity Tracking section
4. Execute Phase 0 → research.md
   → Generated research findings and resolved remaining unknowns
5. Execute Phase 1 → contracts, data-model.md, quickstart.md, agent-specific template file
   → Created data models, API contracts, and failing tests
   → Updated Cursor agent context with new tech stack
6. Re-evaluate Constitution Check section
   → Confirmed complexity justification for multi-project architecture
7. Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md)
   → Outlined TDD-based task generation strategy
8. STOP - Ready for /tasks command
```

**IMPORTANT**: The /plan command STOPS at step 7. Phases 2-4 are executed by other commands:
- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary
FitSense is a cross-platform wellness app implementing AI-powered health tracking with local-first architecture. React Native + Expo frontend integrates with Convex backend for real-time sync, featuring encrypted local storage via MMKV, OpenAI integration for personalized insights, and comprehensive accessibility features. The solution prioritizes user privacy, offline functionality, and scalable performance for health-conscious users across beginner to advanced fitness levels.

## Technical Context
**Language/Version**: TypeScript 5.x (React Native 0.81.1+, Node.js 18+)
**Primary Dependencies**: React Native 0.81.1+, Expo SDK 54.0.0-preview.14, Convex 1.25.4, React Navigation 7.x
**Storage**: Convex (cloud) + MMKV (encrypted local) for offline-first architecture
**Testing**: Jest + React Native Testing Library (unit), Detox (E2E), Postman/Newman (API contract)
**Target Platform**: iOS 15+, Android API 24+, Web (Expo web)
**Project Type**: Mobile + Backend (convexpo template provides complete monorepo structure)
**Performance Goals**: <100ms local queries, <2s AI responses, <500ms sync on reconnection
**Constraints**: Offline-capable, HIPAA-inspired security, GDPR compliance, <50MB app size
**Scale/Scope**: 10k+ users, 1M+ data points/month, real-time sync across devices
**Integration Requirements**: OpenAI API, Nutritionix API, Expo device sensors, Better Auth (all supported)

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Simplicity**:
- Projects: 2 (mobile + backend - justified for cross-platform mobile app)
- Using framework directly? (React Native + Expo without wrapper layers)
- Single data model? (Shared TypeScript interfaces across mobile/backend)
- Avoiding patterns? (Direct Convex queries, no Repository pattern overhead)

**Architecture**:
- EVERY feature as library? (Backend features as Convex functions, mobile features as React components)
- Libraries listed: mobile-app (React Native), backend-api (Convex), ai-service (OpenAI integration), storage-service (MMKV)
- CLI per library: [Convex CLI for backend, Expo CLI for mobile, custom scripts for deployment]
- Library docs: llms.txt format planned for each service

**Testing (NON-NEGOTIABLE)**:
- RED-GREEN-Refactor cycle enforced? (Contract tests written first, must fail before implementation)
- Git commits show tests before implementation? (Required for all features)
- Order: Contract→Integration→E2E→Unit strictly followed
- Real dependencies used? (Actual Convex backend, OpenAI API in tests)
- Integration tests for: new library contracts, API changes, cross-platform sync
- FORBIDDEN: Implementation before test, skipping RED phase

**Observability**:
- Structured logging included? (Winston for backend, React Native logs for mobile)
- Frontend logs → backend? (Error logs sync to Convex for analysis)
- Error context sufficient? (User ID, session context, error stack traces)

**Versioning**:
- Version number assigned? (1.0.0 for MVP)
- BUILD increments on every change? (Automated via CI/CD)
- Breaking changes handled? (Migration scripts, parallel API versions)

## Project Structure

### Documentation (this feature)
```
/Users/Hasan/Desktop/Hasan/Workspace/FitSense/specs/001-fitsense-ai-powered/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root - convexpo template structure)
```
/Users/Hasan/Desktop/Hasan/Workspace/FitSense/
├── apps/                # Monorepo apps directory
│   └── native/          # React Native + Expo app (@fitsense/mobile)
│       ├── app/         # Expo Router screens and layouts
│       │   ├── _layout.tsx
│       │   ├── (root)/
│       │   │   ├── _layout.tsx
│       │   │   ├── (auth)/        # Authentication screens
│       │   │   │   ├── signin.tsx
│       │   │   │   ├── signup.tsx
│       │   │   │   └── (reset)/    # Password reset flows
│       │   │   └── (main)/        # Main app screens
│       │   │       ├── _layout.tsx
│       │   │       ├── index.tsx   # Dashboard
│       │   │       └── settings.tsx
│       ├── components/  # Reusable UI components
│       │   ├── app-text.tsx
│       │   ├── form.tsx
│       │   ├── screen-scroll-view.tsx
│       │   ├── theme-selector.tsx
│       │   └── theme-toggle.tsx
│       ├── contexts/    # React contexts
│       │   └── app-theme-context.tsx
│       ├── hooks/       # Custom React hooks
│       ├── lib/         # Utilities and integrations
│       │   ├── better-auth/    # Auth client setup
│       │   ├── constants.ts
│       │   ├── utils.ts
│       │   └── use-color-scheme.ts
│       ├── providers/   # React providers
│       │   └── ConvexProvider.tsx
│       ├── themes/      # Theme configurations
│       │   └── pastel-themes.ts
│       └── package.json
├── packages/            # Monorepo packages
│   └── backend/         # Convex backend package
│       ├── convex/      # Convex functions and schema
│       │   ├── _generated/     # Auto-generated types
│       │   ├── auth.config.ts  # Better Auth configuration
│       │   ├── auth.ts         # Auth functions
│       │   ├── schema.ts       # Database schema
│       │   ├── users.ts        # User management
│       │   ├── util.ts
│       │   └── lib/
│       │       ├── auth/       # Auth utilities
│       │       └── resend/     # Email integration
│       └── package.json
├── shared/              # Shared types and utilities (to be created)
│   ├── types/           # TypeScript interfaces
│   └── utils/           # Shared utilities
├── pnpm-workspace.yaml # Workspace configuration
├── turbo.json          # Build system configuration
├── package.json        # Root package.json
└── biome.json          # Linting configuration
```

**Structure Decision**: Mobile + Backend (convexpo template provides production-ready monorepo with pnpm, Turbo, and Biome)

## Phase 0: Outline & Research
1. **Extract unknowns from Technical Context** above:
   - OpenAI API integration patterns for health recommendations
   - Convex real-time sync performance with large datasets
   - MMKV encryption best practices for health data
   - Cross-platform accessibility implementation
   - Nutritionix API integration for meal recognition

2. **Generate and dispatch research agents**:
   ```
   For each unknown in Technical Context:
     Task: "Research OpenAI integration patterns for personalized health recommendations"
     Task: "Research Convex performance optimization for real-time health data sync"
     Task: "Research MMKV encryption for HIPAA-compliant local storage"
     Task: "Research cross-platform accessibility features in React Native"
     Task: "Research Nutritionix API integration for photo-based meal logging"
   ```

3. **Consolidate findings** in `research.md` using format:
   - Decision: [what was chosen]
   - Rationale: [why chosen]
   - Alternatives considered: [what else evaluated]

**Output**: research.md with all unknowns resolved

## Phase 1: Design & Contracts
*Prerequisites: research.md complete*

1. **Extract entities from feature spec** → `data-model.md`:
   - User Profile: authentication, preferences, health conditions
   - Workout Session: exercise details, performance metrics, mood tracking
   - Meal Entry: nutritional data, portions, photo references
   - Health Metric: vital signs, activity data, sensor readings
   - Goal: target definitions, progress tracking, achievements
   - AI Insight: analysis results, recommendations, correlations
   - Conversation Log: chat history, context preservation

2. **Generate API contracts** from functional requirements:
   - POST /workouts → Create workout session
   - GET /insights → Retrieve personalized insights
   - POST /chat → Send message to AI assistant
   - PUT /goals → Update goal progress
   - Output OpenAPI/Convex schema to `/contracts/`

3. **Generate contract tests** from contracts:
   - One test file per endpoint (Jest + Supertest for API)
   - Assert request/response schemas
   - Tests must fail (no implementation yet)

4. **Extract test scenarios** from user stories:
   - Beginner logging flow: Dashboard → Log Workout → AI Feedback
   - Advanced analytics: View Trends → Optimization Suggestions
   - Health manager: Meal Logging → Nutrition Insights → Privacy Controls

5. **Update agent file incrementally** (O(1) operation):
   - Run `/scripts/update-agent-context.sh cursor` for Cursor IDE
   - Add React Native, Expo, Convex, OpenAI integration patterns
   - Preserve existing tech stack entries
   - Keep under 150 lines for token efficiency

**Output**: data-model.md, /contracts/*, failing tests, quickstart.md, `.cursor/cursor-instructions.md`

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:
- Load `/templates/tasks-template.md` as base
- Generate tasks from Phase 1 design docs (contracts, data model, quickstart)
- Each contract → contract test task [P] (parallel execution)
- Each entity → model creation task [P]
- Each user story → integration test task
- Implementation tasks to make tests pass

**Ordering Strategy**:
- TDD order: Tests before implementation
- Dependency order: Models before services before UI
- Mark [P] for parallel execution (independent files)

**Estimated Output**: 30-40 numbered, ordered tasks in tasks.md

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation
*These phases are beyond the scope of the /plan command*

**Phase 3**: Task execution (/tasks command creates tasks.md)  
**Phase 4**: Implementation (execute tasks.md following constitutional principles)  
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

## Complexity Tracking
*Fill ONLY if Constitution Check has violations that must be justified*

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| 2 projects (mobile + backend) | Cross-platform mobile app requires separate mobile and backend codebases | Single project insufficient for React Native + Convex architecture |
| Multiple services (ai-service) | AI integration requires isolated service for security and scalability | Direct integration would expose API keys and complicate testing |
| Complex storage (Convex + MMKV) | Offline-first architecture requires dual storage strategy | Single storage solution cannot provide offline capability |

## Progress Tracking
*This checklist is updated during execution flow*

**Phase Status**:
- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [x] Phase 2: Task planning approach defined (/plan command)
- [x] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS (with documented complexity)
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved
- [x] Complexity deviations documented

---
*Based on Constitution v2.1.1 - See `/memory/constitution.md`*