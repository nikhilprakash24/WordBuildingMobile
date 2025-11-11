# CXI - Networked Word Building Game

A real-time multiplayer word-building mobile game with live visuals, themed categories, and a flexible rule system.

## 🎮 Project Overview

CXI is a networked mobile game where players build words based on themes and categories. The game features:

- **Real-time Multiplayer**: 2-8 players per game session
- **Live Visual Feedback**: Smooth animations and visual effects
- **Themed Categories**: Countries, Animals, Food, Technology, and more
- **Flexible Rule System**: Pre-configured rules with customization and override capabilities
- **Cross-Platform**: iOS and Android support via React Native

## 📁 Project Structure

```
WordBuildingMobile/
├── mobile/              # React Native mobile app
├── server/              # Node.js + Socket.io backend
├── shared/              # Shared types and constants
├── docs/                # Documentation
├── CXI_MASTER_PLAN.md   # Complete development plan
├── PROGRESS_LOG.md      # Detailed progress tracking
└── DECISIONS_LOG.md     # Architecture decision records
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI (for mobile development)
- iOS Simulator (Mac) or Android Emulator

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd WordBuildingMobile
```

2. **Install Mobile Dependencies**
```bash
cd mobile
npm install
```

3. **Install Server Dependencies**
```bash
cd ../server
npm install
```

### Running the Application

#### Start the Backend Server

```bash
cd server
npm run dev
```

Server will start on http://localhost:3000

#### Start the Mobile App

```bash
cd mobile
npm start
```

This will open Expo DevTools. You can then:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app on physical device

## 🧪 Testing

### Mobile Tests
```bash
cd mobile
npm test                # Run tests once
npm run test:watch      # Watch mode
npm run test:coverage   # Coverage report
```

### Server Tests
```bash
cd server
npm test                # Run tests once
npm run test:watch      # Watch mode
npm run test:coverage   # Coverage report
```

## 🏗️ Development Phases

**Current Phase**: Phase 0 - Foundation & Setup ✅

See [CXI_MASTER_PLAN.md](./CXI_MASTER_PLAN.md) for the complete development roadmap.

### Phase Overview

- **Phase 0**: Foundation & Setup ✅ COMPLETE
- **Phase 1**: Core Word Building (Offline)
- **Phase 2**: Rule Engine
- **Phase 3**: Backend & Networking
- **Phase 4**: Client Networking Integration
- **Phase 5**: Visual Polish & Animations
- **Phase 6**: Advanced Features
- **Phase 7**: Testing & Optimization

## 🛠️ Technology Stack

### Mobile (Frontend)
- **Framework**: React Native + Expo
- **Language**: TypeScript
- **State Management**: Zustand + React Query
- **Animations**: React Native Reanimated 2
- **Networking**: Socket.io Client
- **Testing**: Jest + React Native Testing Library

### Backend (Server)
- **Runtime**: Node.js
- **Framework**: Express
- **Real-time**: Socket.io
- **Language**: TypeScript
- **Testing**: Jest + Supertest

### Shared
- **Type Safety**: Shared TypeScript types
- **Constants**: Shared configuration values

## 📚 Documentation

- **[Master Plan](./CXI_MASTER_PLAN.md)**: Complete project architecture and roadmap
- **[Progress Log](./PROGRESS_LOG.md)**: Detailed task-by-task progress
- **[Decisions Log](./DECISIONS_LOG.md)**: Architecture decision records (ADRs)

## 🎯 Key Features

### Game Mechanics
- Word building with theme/category constraints
- Real-time word validation
- Scoring system with bonuses
- Multiple game phases (Lobby → Config → Playing → Scoring)

### Networking
- Room-based multiplayer
- Real-time state synchronization
- Reconnection handling
- Low-latency updates

### Rule System
- JSON-based rule definitions
- Pre-configured rule sets
- Custom rule creation
- Override capability per game

### Visual Design
- 60fps animations
- Theme-based visual treatments
- Live feedback for actions
- Smooth state transitions

## 🔧 Scripts

### Mobile
```bash
npm start           # Start Expo dev server
npm run android     # Start on Android
npm run ios         # Start on iOS
npm test            # Run tests
npm run lint        # Lint code
npm run format      # Format code with Prettier
```

### Server
```bash
npm run dev         # Start development server
npm run build       # Build for production
npm start           # Start production server
npm test            # Run tests
npm run lint        # Lint code
npm run format      # Format code with Prettier
```

## 🤝 Contributing

This is an experimental autonomous development project. See the master plan for the full development approach.

## 📊 Project Status

**Phase 0 Complete** ✅

- [x] Project structure created
- [x] TypeScript configured
- [x] Testing framework set up
- [x] ESLint + Prettier configured
- [x] Mobile app skeleton
- [x] Backend server skeleton
- [x] Shared types defined
- [x] Documentation framework established

**Next**: Phase 1 - Core Word Building (Offline)

## 📝 License

MIT

## 👥 Team

Developed autonomously by Claude (AI) as an experiment in unguided software development.

---

**Last Updated**: 2025-11-11
**Version**: 0.1.0 (Phase 0 Complete)
