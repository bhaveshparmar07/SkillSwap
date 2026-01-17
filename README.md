# SkillSwitch Frontend - React + Vite + TypeScript

A modern peer-to-peer skills exchange platform for students, built with React, TypeScript, and Google services.

## 🚀 Features

- **Firebase Authentication** - Google Sign-In and custom Student ID authentication
- **Google Gemini AI** - Intelligent tutor matching and recommendations
- **Google Maps** - Safe Zone visualization with geofencing
- **Material Design 3** - Beautiful, responsive UI with glassmorphism effects
- **Real-time Updates** - Firebase Firestore for live data sync
- **Google Analytics** - User behavior tracking and insights

## 📋 Prerequisites

- Node.js 18+ and npm
- Google Cloud Platform account with:
  - Firebase project
  - Google Maps API key
  - Gemini API key (optional)
  - Google Analytics (optional)

## 🛠️ Setup

1. **Clone and Install**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   
   Copy `.env.example` to `.env` and fill in your Google service credentials:

   ```bash
   cp .env.example .env
   ```

   Required variables:
   - `VITE_FIREBASE_*` - Firebase configuration
   - `VITE_GOOGLE_MAPS_API_KEY` - Google Maps API key
   - `VITE_GEMINI_API_KEY` - Gemini AI API key (optional)
   - `VITE_GA_MEASUREMENT_ID` - Google Analytics ID (optional)

3. **Run Development Server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:5173](http://localhost:5173)

4. **Build for Production**
   ```bash
   npm run build
   ```

## 🏗️ Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── Navbar.tsx
│   ├── SkillCard.tsx
│   ├── CoinBadge.tsx
│   └── ProtectedLayout.tsx
├── contexts/         # React contexts
│   └── AuthContext.tsx
├── lib/              # Utilities and services
│   ├── firebase.ts   # Firebase initialization
│   ├── gemini.ts     # Gemini AI integration
│   ├── analytics.ts  # Google Analytics
│   ├── api.ts        # Axios instance
│   └── queryClient.ts
├── pages/            # Application pages
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── Dashboard.tsx
│   ├── Search.tsx
│   └── Map.tsx
├── types/            # TypeScript type definitions
│   └── index.ts
├── App.tsx           # Main app with routing
└── main.tsx          # Entry point
```

## 🎨 Tech Stack

- **Framework**: React 19+ with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom utilities
- **Routing**: React Router DOM v6
- **State Management**: React Query + Context API
- **HTTP Client**: Axios
- **Google Services**:
  - Firebase (Auth, Firestore, Analytics)
  - Google Maps (@vis.gl/react-google-maps)
  - Gemini AI (@google/generative-ai)
- **UI Components**: Lucide React icons
- **Design**: Material Design 3 principles

## 🔑 Key Features

### Authentication
- Google Sign-In (one-click)
- Student ID registration with password
- Firebase Authentication integration
- Protected routes with auto-redirect

### Dashboard
- SkillCoin wallet display
- Verification status badge
- Active help requests list
- ID verification with drag & drop upload

### Tutor Search
- Gemini AI-powered intelligent matching
- Debounced search input
- Tutor profile cards
- Booking modal for help requests

### Safe Zone Map
- Google Maps integration
- 4 hardcoded safe zones
- Real-time user geolocation
- Geofence validation (100m radius)
- Distance calculation and visual feedback

## 📱 Responsive Design

The application is fully responsive with breakpoints for:
- Mobile (< 768px)
- Tablet (768px - 1024px)
- Desktop (> 1024px)

## 🔒 Security

- Firebase Authentication for secure user management
- JWT token handling via Firebase
- Protected routes with authentication checks
- HTTPS only in production

## 📊 Analytics

Google Analytics 4 integration tracks:
- Page views
- Tutor searches
- Session starts/completions
- Coin transactions
- Verification attempts

## 🚧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint (if configured)

### Code Style

- TypeScript strict mode enabled
- Functional components with hooks
- Custom CSS utilities for glass morphism effects
- Consistent component structure

## 🌐 Deployment

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy the `dist` folder to:
   - Firebase Hosting
   - Vercel
   - Netlify
   - Any static hosting service

3. Set environment variables in your hosting platform

## 📄 License

MIT

## 👥 Contributors

Built for the SkillSwitch hackathon project

## 🙏 Acknowledgments

- Google Cloud Platform for amazing services
- Material Design team for design guidelines
- React and Vite communities
