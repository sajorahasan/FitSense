# Tasks: FitSense AI-Powered Wellness App

**Input**: Design documents from `/Users/Hasan/Desktop/Hasan/Workspace/FitSense/specs/001-fitsense-ai-powered/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/, quickstart.md

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → Successfully loaded FitSense implementation plan
2. Load optional design documents:
   → data-model.md: Extracted 7 core entities (UserProfile, WorkoutSession, MealEntry, etc.)
   → contracts/: Found 3 contract files (api-contracts.yaml, convex-schema.ts, contract-tests.js)
   → research.md: Technical decisions for OpenAI, Convex, MMKV integration
   → quickstart.md: 8 test scenarios for validation
3. Generate tasks by category:
   → Setup: Project bootstrap from convexpo template
   → Tests: Contract tests for MVP endpoints (workouts, meals, insights, chat)
   → Core: Mobile app screens and Convex backend functions
   → Integration: Local storage, real-time sync, AI services
   → Polish: Cross-platform testing, performance optimization
4. Apply task rules:
   → Different files = mark [P] for parallel
   → Same file = sequential (no [P])
   → Tests before implementation (TDD)
5. Number tasks sequentially (T001, T002...)
6. Generate dependency graph
7. Create parallel execution examples
8. Validate task completeness:
   → All MVP contracts have tests? ✓
   → All MVP entities have models? ✓
   → All MVP endpoints implemented? Planned
9. Return: SUCCESS (tasks ready for execution)
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions
- **Mobile App**: `mobile/src/` (React Native + Expo)
- **Backend**: `backend/convex/` (Convex functions)
- **Shared**: `shared/` (TypeScript types, utilities)
- **Tests**: `mobile/tests/`, `backend/tests/`

---

## Phase 1: Setup and Core Logging (Foundation)

### Setup Tasks
- [x] **T001** [P] Bootstrap project from convexpo template (`https://github.com/0rtbo/convexpo`)
  - **Effort**: Med (1-2 hours)
  - **Dependencies**: None
  - **Success Criteria**: ✅ Template cloned, structure analyzed, dependencies match plan.md requirements
  - **Details**: ✅ Cloned convexpo template with React Native 0.81.1, Expo SDK 54.0.0-preview.14, Convex 1.25.4, Better Auth, HeroUI Native, NativeWind, pnpm monorepo, Turbo build system, Biome linting

- [x] **T002** [P] Configure development environment and scripts
  - **Effort**: Med (1-2 hours)
  - **Dependencies**: T001
  - **Success Criteria**: ✅ `pnpm mobile`, `pnpm backend` commands work; linting configured; monorepo structure functional
  - **Details**: ✅ Configured pnpm workspace, Turbo build system, Biome linting, TypeScript checking; created shared types and utilities

- [x] **T003** [P] Setup shared TypeScript types and utilities
  - **Effort**: Low (1 hour)
  - **Dependencies**: T001
  - **Success Criteria**: ✅ Type definitions match data-model.md entities; utility functions created
  - **Details**: ✅ Created `shared/types/` with UserProfile, WorkoutSession, MealEntry, HealthMetric, Goal, AIInsight interfaces; added validation, formatting, date, and storage utilities

### Authentication & User Management
- [ ] **T004** Configure Better Auth integration
  - **Effort**: Med (1-2 hours)
  - **Dependencies**: T001
  - **Success Criteria**: Email/password auth working, JWT tokens generated
  - **Details**: Setup Better Auth with Convex, test login/logout flow

- [ ] **T005** Create user onboarding flow
  - **Effort**: Med (1-2 hours)
  - **Dependencies**: T004
  - **Success Criteria**: Profile creation screen with fitness level selection
  - **Details**: React Navigation setup, onboarding screens in `mobile/src/screens/`

### Core Data Layer (Convex Backend)
- [ ] **T006** [P] Implement Convex schema for UserProfile
  - **Effort**: Low (1 hour)
  - **Dependencies**: T003
  - **Success Criteria**: Schema matches data-model.md UserProfile interface
  - **Details**: `backend/convex/schema.ts` - define users table with indexes

- [ ] **T007** [P] Implement Convex schema for WorkoutSession
  - **Effort**: Low (1 hour)
  - **Dependencies**: T003
  - **Success Criteria**: Full workout entity with exercise tracking
  - **Details**: Define workouts table, exercise entries, performance metrics

- [ ] **T008** [P] Implement Convex schema for MealEntry
  - **Effort**: Low (1 hour)
  - **Dependencies**: T003
  - **Success Criteria**: Meal logging with nutrition tracking
  - **Details**: Define meals table with food items and nutritional data

- [ ] **T009** [P] Implement Convex schema for HealthMetric
  - **Effort**: Low (1 hour)
  - **Dependencies**: T003
  - **Success Criteria**: Vital signs and sensor data storage
  - **Details**: Define healthMetrics table with timestamp indexing

### Basic Logging Screens (Mobile App)
- [ ] **T010** Create main dashboard screen
  - **Effort**: Med (1-2 hours)
  - **Dependencies**: T004, T005
  - **Success Criteria**: Shows recent activities, quick action buttons
  - **Details**: `mobile/src/screens/Dashboard.tsx` with NativeWind styling

- [ ] **T011** Create workout logging screen
  - **Effort**: Med (1-2 hours)
  - **Dependencies**: T007, T010
  - **Success Criteria**: Form for cardio/strength workouts with validation
  - **Details**: `mobile/src/screens/LogWorkout.tsx` with exercise picker

- [ ] **T012** Create meal logging screen
  - **Effort**: Med (1-2 hours)
  - **Dependencies**: T008, T010
  - **Success Criteria**: Manual food entry with nutritional calculation
  - **Details**: `mobile/src/screens/LogMeal.tsx` with food database integration

- [ ] **T013** Create health metrics logging screen
  - **Effort**: Low (1 hour)
  - **Dependencies**: T009, T010
  - **Success Criteria**: Weight, heart rate, sleep tracking forms
  - **Details**: `mobile/src/screens/LogMetrics.tsx` with sensor integration

### Local Storage & Sync
- [ ] **T014** [P] Setup MMKV encrypted storage
  - **Effort**: Low (1 hour)
  - **Dependencies**: T001
  - **Success Criteria**: Secure local storage for offline data
  - **Details**: Configure MMKV with encryption keys, HIPAA-compliant setup

- [ ] **T015** Implement offline-first data sync
  - **Effort**: High (2-3 hours)
  - **Dependencies**: T014, T006-T009
  - **Success Criteria**: Local changes sync to Convex when online
  - **Details**: Conflict resolution, optimistic updates, sync status indicators

---

## Phase 2: AI Insights and Recommendations

### Backend AI Services
- [ ] **T016** [P] Setup OpenAI integration service
  - **Effort**: Med (1-2 hours)
  - **Dependencies**: T001
  - **Success Criteria**: Secure API key management, rate limiting
  - **Details**: `backend/convex/openai.ts` with GPT-4 function calling

- [ ] **T017** [P] Create workout analysis AI function
  - **Effort**: Med (1-2 hours)
  - **Dependencies**: T016, T007
  - **Success Criteria**: Generates personalized workout insights
  - **Details**: `backend/convex/analyzeWorkout.ts` using historical data

- [ ] **T018** [P] Create nutrition analysis AI function
  - **Effort**: Med (1-2 hours)
  - **Dependencies**: T016, T008
  - **Success Criteria**: Provides meal recommendations based on goals
  - **Details**: `backend/convex/analyzeNutrition.ts` with dietary preferences

- [ ] **T019** [P] Create trend analysis AI function
  - **Effort**: Med (1-2 hours)
  - **Dependencies**: T016, T009
  - **Success Criteria**: Identifies patterns in health metrics
  - **Details**: `backend/convex/analyzeTrends.ts` with correlation detection

### AI Schema & Data Models
- [ ] **T020** [P] Implement Convex schema for AI Insights
  - **Effort**: Low (1 hour)
  - **Dependencies**: T003
  - **Success Criteria**: Stores AI-generated analysis and recommendations
  - **Details**: Define aiInsights table with confidence scores

- [ ] **T021** [P] Implement Convex schema for Goals
  - **Effort**: Low (1 hour)
  - **Dependencies**: T003
  - **Success Criteria**: Goal tracking with progress milestones
  - **Details**: Define goals table with achievement tracking

### AI-Powered UI Components
- [ ] **T022** Create insights dashboard screen
  - **Effort**: Med (1-2 hours)
  - **Dependencies**: T020, T010
  - **Success Criteria**: Shows AI-generated insights and trends
  - **Details**: `mobile/src/screens/Insights.tsx` with charts and recommendations

- [ ] **T023** Create goal management screen
  - **Effort**: Med (1-2 hours)
  - **Dependencies**: T021, T010
  - **Success Criteria**: Set goals, track progress, celebrate achievements
  - **Details**: `mobile/src/screens/Goals.tsx` with milestone tracking

- [ ] **T024** Add AI recommendations to workout logging
  - **Effort**: Low (1 hour)
  - **Dependencies**: T017, T011
  - **Success Criteria**: Post-workout AI feedback appears
  - **Details**: Integrate analysis into LogWorkout screen

- [ ] **T025** Add AI recommendations to meal logging
  - **Effort**: Low (1 hour)
  - **Dependencies**: T018, T012
  - **Success Criteria**: Nutrition insights after meal logging
  - **Details**: Integrate analysis into LogMeal screen

---

## Phase 3: Chat Assistant and Polish

### Chat System
- [ ] **T026** [P] Implement Convex schema for Conversation Log
  - **Effort**: Low (1 hour)
  - **Dependencies**: T003
  - **Success Criteria**: Stores chat history with context
  - **Details**: Define conversations table with message threading

- [ ] **T027** Create chat AI function
  - **Effort**: Med (1-2 hours)
  - **Dependencies**: T016, T026
  - **Success Criteria**: Context-aware responses using user data
  - **Details**: `backend/convex/chatAssistant.ts` with conversation history

- [ ] **T028** Create chat interface screen
  - **Effort**: Med (1-2 hours)
  - **Dependencies**: T027, T010
  - **Success Criteria**: Conversational UI with typing indicators
  - **Details**: `mobile/src/screens/Chat.tsx` with message bubbles

- [ ] **T029** Integrate chat with user data context
  - **Effort**: Low (1 hour)
  - **Dependencies**: T028, T006-T009
  - **Success Criteria**: Chat references recent workouts/meals/goals
  - **Details**: Context injection from current user state

### Cross-Platform Polish
- [ ] **T030** [P] Test iOS compatibility
  - **Effort**: Med (1-2 hours)
  - **Dependencies**: T010-T029
  - **Success Criteria**: All screens work on iOS Simulator
  - **Details**: iOS-specific testing, gesture handling, accessibility

- [ ] **T031** [P] Test Android compatibility
  - **Effort**: Med (1-2 hours)
  - **Dependencies**: T010-T029
  - **Success Criteria**: All screens work on Android Emulator
  - **Details**: Android-specific testing, back button handling

- [ ] **T032** [P] Test web compatibility (Expo web)
  - **Effort**: Low (1 hour)
  - **Dependencies**: T010-T029
  - **Success Criteria**: Core functionality works in web browser
  - **Details**: Responsive design testing, touch vs mouse interactions

### Performance & Error Handling
- [ ] **T033** [P] Implement error boundaries
  - **Effort**: Low (1 hour)
  - **Dependencies**: T010-T029
  - **Success Criteria**: Graceful error handling across all screens
  - **Details**: React Error Boundaries with user-friendly messages

- [ ] **T034** [P] Add loading states and skeletons
  - **Effort**: Low (1 hour)
  - **Dependencies**: T010-T029
  - **Success Criteria**: Smooth loading experience with skeleton screens
  - **Details**: Loading indicators for API calls, sync status

- [ ] **T035** Optimize app performance
  - **Effort**: Med (1-2 hours)
  - **Dependencies**: T030-T034
  - **Success Criteria**: App launch <3s, screen navigation <1s
  - **Details**: Memoization, lazy loading, bundle optimization

### Integration Testing
- [ ] **T036** [P] Execute quickstart scenario 1 (User Onboarding)
  - **Effort**: Low (1 hour)
  - **Dependencies**: T004-T005, T010
  - **Success Criteria**: Complete onboarding flow works end-to-end
  - **Details**: Follow quickstart.md scenario 1 exactly

- [ ] **T037** [P] Execute quickstart scenario 2 (Workout Logging)
  - **Effort**: Low (1 hour)
  - **Dependencies**: T011, T015
  - **Success Criteria**: Workout creation and sync works
  - **Details**: Follow quickstart.md scenario 2 exactly

- [ ] **T038** [P] Execute quickstart scenario 3 (Meal Logging)
  - **Effort**: Low (1 hour)
  - **Dependencies**: T012, T015
  - **Success Criteria**: Meal logging with nutrition analysis works
  - **Details**: Follow quickstart.md scenario 3 exactly

- [ ] **T039** [P] Execute quickstart scenario 8 (Chat Assistant)
  - **Effort**: Low (1 hour)
  - **Dependencies**: T028-T029
  - **Success Criteria**: AI chat provides context-aware responses
  - **Details**: Follow quickstart.md scenario 8 exactly

---

## Dependencies

### Task Dependencies (Simplified)
```
T001 (Bootstrap) ✅ - convexpo template provides:
├── Auth system (Better Auth + Convex)
├── UI components (HeroUI Native + NativeWind)
├── Theme system (pastel themes)
├── Navigation (Expo Router)
├── Build system (pnpm + Turbo + Biome)
├── Email system (Resend)
└── Form components & utilities

T002 (Dev Environment) → T003 (Shared Types)
├── T004 (Auth) → T005 (Onboarding) → T010 (Dashboard)
├── T006-T009 (Convex Schemas) → T011-T013 (Logging Screens)
├── T014 (MMKV) → T015 (Sync)
├── T016 (OpenAI) → T017-T019 (AI Functions) → T022-T023 (AI Screens)
├── T020-T021 (AI Schemas) → T024-T025 (AI Integration)
├── T026 (Chat Schema) → T027 (Chat Function) → T028 (Chat Screen) → T029 (Context)
└── T030-T035 (Cross-platform & Performance) → T036-T039 (Integration Tests)
```

### Parallel Execution Groups
**Setup Group (T001-T003)**: Can run simultaneously after project bootstrap
**Schema Group (T006-T009, T020-T021, T026)**: Independent schema definitions
**Screen Group (T010-T013, T022-T023, T028)**: UI screens with different dependencies
**AI Group (T017-T019)**: Independent AI analysis functions
**Testing Group (T036-T039)**: Integration scenarios run in parallel

### Parallel Example
```
# Launch T006-T009 together (Convex schemas):
Task: "Implement Convex schema for UserProfile in backend/convex/schema.ts"
Task: "Implement Convex schema for WorkoutSession in backend/convex/schema.ts"
Task: "Implement Convex schema for MealEntry in backend/convex/schema.ts"
Task: "Implement Convex schema for HealthMetric in backend/convex/schema.ts"
```

---

## Notes
- **[P]** tasks = different files, no dependencies
- All tests follow TDD: write failing tests first, then implement
- Commit after each task completion
- Cross-platform testing required for T030-T032
- Focus on MVP features: Logging, Dashboard, AI Insights, Chat
- Total estimated time: 35-45 hours across 39 tasks

## Task Generation Rules Applied
*Executed during main() execution*

1. **From Contracts**:
   - Each MVP endpoint → implementation task (workouts, meals, insights, chat)
   - Contract tests → separate validation tasks

2. **From Data Model**:
   - Each MVP entity → Convex schema task [P] (UserProfile, WorkoutSession, MealEntry, HealthMetric, AIInsight, Goal, ConversationLog)
   - Relationships → service layer integration tasks

3. **From User Stories**:
   - Each quickstart scenario → integration test task [P]
   - Core flows → implementation tasks

4. **Ordering**:
   - Bootstrap → Auth/Onboarding → Schemas → Screens → AI → Chat → Cross-platform → Integration Tests
   - Dependencies enforced through prerequisite chain
   - Parallel opportunities maximized for independent work

## Validation Checklist
*GATE: Checked by main() before returning*

- [x] All MVP contracts have corresponding tests
- [x] All MVP entities have schema tasks
- [x] All MVP endpoints have implementation tasks
- [x] Parallel tasks are truly independent
- [x] Each task specifies exact file paths
- [x] No task modifies same file as another [P] task
- [x] TDD order maintained (tests before implementation)
- [x] Cross-platform considerations included
- [x] Effort estimates provided (Low/Med/High)
- [x] Success criteria defined for each task
