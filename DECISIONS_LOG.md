# CXI Word Building Game - Architecture Decision Records (ADR)

**Purpose**: Document all significant architectural and technical decisions made during development.

**Format**: Each ADR includes:
- **Date**
- **Decision**
- **Context** (Why we needed to make this decision)
- **Options Considered**
- **Decision Made**
- **Rationale** (Why this option was chosen)
- **Consequences** (Trade-offs and implications)
- **Status** (Proposed/Accepted/Superseded)

---

## ADR-001: Mobile Framework Selection
**Date**: 2025-11-11
**Status**: Accepted

### Context
Need to choose a mobile development framework for cross-platform iOS and Android support.

### Options Considered
1. **React Native + Expo**
2. **React Native (bare)**
3. **Flutter**
4. **Native iOS + Android (separate codebases)**

### Decision Made
React Native + Expo

### Rationale
- **Single Codebase**: Shared code between iOS and Android reduces development time
- **Expo Benefits**: Simplified development workflow, OTA updates, easier testing
- **Performance**: React Native Reanimated 2 can achieve 60fps animations
- **Networking**: Excellent Socket.io support for real-time multiplayer
- **Developer Experience**: Hot reload, extensive tooling, large community
- **Quick Iteration**: Expo Go allows instant testing without builds

### Consequences
**Positive**:
- Faster development velocity
- Easier maintenance
- Cross-platform consistency
- Rich ecosystem of libraries

**Negative**:
- ~100-200ms performance overhead vs native
- Limited access to some native APIs (can eject if needed)
- Larger app bundle size than pure native

**Mitigation**:
- Use React Native Reanimated for performance-critical animations
- Profile and optimize early
- Can eject from Expo if we hit limitations

---

## ADR-002: Backend Technology Stack
**Date**: 2025-11-11
**Status**: Accepted

### Context
Need real-time multiplayer backend with low latency and good scalability.

### Options Considered
1. **Node.js + Socket.io**
2. **Python + Django Channels**
3. **Go + Gorilla WebSocket**
4. **Firebase Realtime Database**

### Decision Made
Node.js + Express + Socket.io with MongoDB and Redis

### Rationale
- **Real-time**: Socket.io is battle-tested for real-time bidirectional communication
- **JavaScript/TypeScript**: Shared language with frontend reduces context switching
- **Scalability**: Can scale horizontally with Redis for session management
- **Ecosystem**: Excellent libraries for all needed functionality
- **Development Speed**: Fast to prototype and iterate
- **Fallback Support**: Socket.io auto-fallbacks (WebSocket → HTTP long-polling)

### Consequences
**Positive**:
- Fast development with shared TypeScript
- Excellent real-time performance
- Easy to deploy and scale
- Large community and documentation

**Negative**:
- Node.js single-threaded (use clustering for CPU-intensive tasks)
- JavaScript performance limitations vs Go/Rust

**Mitigation**:
- Use Redis for session state (enables horizontal scaling)
- Optimize hot paths
- Consider microservices for CPU-intensive tasks if needed

---

## ADR-003: State Management Strategy
**Date**: 2025-11-11
**Status**: Accepted

### Context
Need to manage both local app state and server-synchronized game state.

### Options Considered
1. **Zustand + React Query**
2. **Redux Toolkit + RTK Query**
3. **MobX**
4. **Jotai + SWR**

### Decision Made
Zustand for local state + React Query for server state

### Rationale
**Zustand**:
- Minimal boilerplate
- Simple API with hooks
- Excellent TypeScript support
- No Provider hell
- Small bundle size (~1KB)

**React Query**:
- Purpose-built for server state
- Automatic caching and invalidation
- Optimistic updates (crucial for real-time feel)
- Built-in retry and error handling

### Consequences
**Positive**:
- Clean separation of concerns (local vs server state)
- Less boilerplate than Redux
- Better performance (no unnecessary re-renders)
- Easier to test

**Negative**:
- Less structure than Redux (need discipline)
- Smaller community than Redux

**Mitigation**:
- Establish clear patterns in documentation
- Use TypeScript to enforce structure

---

## ADR-004: Animation Library Selection
**Date**: 2025-11-11
**Status**: Accepted

### Context
Need smooth 60fps animations for word building feedback and visual effects.

### Options Considered
1. **React Native Reanimated 2**
2. **React Native Animated (built-in)**
3. **Lottie**
4. **React Spring**

### Decision Made
React Native Reanimated 2 (with Lottie for complex pre-made animations)

### Rationale
- **Performance**: Runs on UI thread (true 60fps possible)
- **Gesture Handling**: Integrated with React Native Gesture Handler
- **Layout Animations**: Built-in support for layout transitions
- **Developer Experience**: Worklet-based API is powerful and flexible
- **Lottie Integration**: Can use Lottie for complex designer-created animations

### Consequences
**Positive**:
- Smooth, native-quality animations
- No bridge overhead for animations
- Gesture-driven interactions possible
- Professional visual polish

**Negative**:
- Steeper learning curve (worklets concept)
- More complex than basic Animated API

**Mitigation**:
- Create reusable animation components
- Document common patterns
- Start simple and progressively enhance

---

## ADR-005: Testing Strategy
**Date**: 2025-11-11
**Status**: Accepted

### Context
Need comprehensive testing to ensure quality in autonomous development.

### Options Considered
1. **Jest + React Native Testing Library + Detox**
2. **Vitest + Testing Library + Maestro**
3. **Jest + Enzyme + Appium**

### Decision Made
Jest + React Native Testing Library + Detox + Supertest

### Rationale
- **Jest**: Industry standard, excellent TypeScript support, snapshot testing
- **React Native Testing Library**: Encourages testing user behavior, not implementation
- **Detox**: Gray box E2E testing, faster than black box (Appium)
- **Supertest**: Clean API testing for backend

### Test Coverage Goals
- Unit tests: >80% coverage for business logic
- Integration tests: All client-server interactions
- E2E tests: Critical user flows
- API tests: All backend endpoints

### Consequences
**Positive**:
- High confidence in code quality
- Catch regressions early
- Documentation through tests
- Safe refactoring

**Negative**:
- Slower initial development
- Test maintenance overhead

**Mitigation**:
- Write tests alongside features (not after)
- Focus on behavior over implementation
- Use snapshot tests judiciously

---

## ADR-006: Rule Engine Design
**Date**: 2025-11-11
**Status**: Accepted

### Context
Need flexible rule system with pre-configuration, customization, and override capabilities.

### Options Considered
1. **JSON-based declarative rules**
2. **Code-based rule classes**
3. **External rules engine (Drools-like)**

### Decision Made
JSON-based declarative rule schema with TypeScript validation

### Rationale
- **Flexibility**: Easy to add/modify rules without code changes
- **Serialization**: Rules can be saved, shared, transmitted over network
- **Validation**: TypeScript types ensure rule structure correctness
- **Versioning**: Rules can be versioned and migrated
- **UI-Friendly**: Easy to build rule builder UI from schema

### Rule Schema Example
```json
{
  "id": "no-proper-nouns",
  "name": "No Proper Nouns",
  "description": "Words must not be proper nouns",
  "type": "validation",
  "enabled": true,
  "overridable": true,
  "validator": "isNotProperNoun"
}
```

### Consequences
**Positive**:
- Non-developers can create rules
- Easy to test rule combinations
- Rules stored in database
- Can build sophisticated UI

**Negative**:
- Limited to pre-defined validator functions
- Can't express arbitrary logic

**Mitigation**:
- Provide rich set of validator primitives
- Allow rule composition
- Support custom JavaScript rules for advanced users

---

## ADR-007: Project Structure - Monorepo
**Date**: 2025-11-11
**Status**: Accepted

### Context
Need to organize mobile app, backend server, and shared code.

### Options Considered
1. **Monorepo (mobile + server + shared)**
2. **Separate repositories**
3. **Backend in mobile repo**

### Decision Made
Monorepo with three main directories: mobile/, server/, shared/

### Rationale
- **Shared Types**: TypeScript types shared between client and server
- **Atomic Changes**: Change API and client in single commit
- **Simplified Development**: Clone once, develop everywhere
- **Consistency**: Shared tooling, linting, testing configuration

### Consequences
**Positive**:
- Easier to keep client and server in sync
- Shared code reduces duplication
- Simplified CI/CD

**Negative**:
- Larger repository
- Need to manage separate package.jsons

**Mitigation**:
- Clear directory structure
- Workspace support (npm workspaces or yarn workspaces)
- Separate CI jobs for mobile and server

---

## ADR-008: Word Validation Approach
**Date**: 2025-11-11
**Status**: Proposed

### Context
Need reliable word validation for different themes/categories.

### Options Considered
1. **Online Dictionary API (e.g., Merriam-Webster, Oxford)**
2. **Offline word list (e.g., SCOWL, NLTK words)**
3. **Hybrid (offline with online fallback)**

### Decision Made
Start with offline word list, add online API as enhancement

### Rationale
- **Offline First**: Game playable without internet for single-player
- **Performance**: No API latency for validation
- **Cost**: Free, no API rate limits
- **Reliability**: No dependency on external service uptime
- **Extensibility**: Can add API later for rare words

### Word List Sources
- SCOWL (Spell Checker Oriented Word Lists)
- Category-specific lists (countries, animals, etc.)
- Custom additions

### Consequences
**Positive**:
- Fast validation (<10ms)
- Works offline
- No ongoing costs
- Deterministic behavior

**Negative**:
- Limited to pre-loaded words
- Larger app bundle size
- May miss obscure valid words

**Mitigation**:
- Use compressed word lists
- Allow manual word additions
- Add online fallback in Phase 6

---

## Decision Summary

| ADR | Decision | Status | Phase |
|-----|----------|--------|-------|
| 001 | React Native + Expo | Accepted | 0 |
| 002 | Node.js + Socket.io Backend | Accepted | 0 |
| 003 | Zustand + React Query | Accepted | 0 |
| 004 | React Native Reanimated 2 | Accepted | 0 |
| 005 | Jest + RTL + Detox Testing | Accepted | 0 |
| 006 | JSON-based Rule Engine | Accepted | 0 |
| 007 | Monorepo Structure | Accepted | 0 |
| 008 | Offline Word Validation | Proposed | 1 |

---

*New decisions will be added as development progresses.*
