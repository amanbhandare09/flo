# Flo — Personal Finance Companion

> A clean, intuitive mobile app to track spending, set budget goals,
> and understand your daily money habits.

---

## 🚀 Try the App

### Option 1 — Expo Go (Instant, no install needed)
1. Install [Expo Go](https://expo.dev/go) on your phone.
2. Open this link directly on your mobile device:
   **[exp://u.expo.dev/007de063-cf75-4f09-82b3-fb20150d7c66](exp://u.expo.dev/007de063-cf75-4f09-82b3-fb20150d7c66)**
   
   **Preview Application Update on Expo:**
   [View the latest deployment here](https://expo.dev/accounts/amanb09/projects/flo-finance/updates/de2c71a2-a2ed-4c4a-957f-f7de48d06bdb)
   
   **OR scan this QR code:**<br>
   <img src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=exp://u.expo.dev/007de063-cf75-4f09-82b3-fb20150d7c66" alt="Expo Go QR Code" width="200" height="200"/>

### Option 2 — APK (Android direct install)
*[Download APK from Expo Dashboard](https://expo.dev/accounts/amanb09/projects/flo-finance/builds)*
*(Note: Requires running `eas build -p android --profile preview` to generate the file).*

### Demo Account
| Field | Value |
|-------|-------|
| **Email** | virat@flo.app |
| **Password** | vk@flo18 |

---

## ✨ Features

### Core
- **Home Dashboard** — Balance overview, income vs expenses, spending by category chart, and daily financial tips.
- **Transaction Management** — Full CRUD: add, view, edit, and delete transactions with confirmation prompts.
- **Smart Filtering** — Search by category/note, filter by income/expense, and sort by date or amount.
- **Budget Shields** — Set monthly spending limits per category with visual progress tracking and over-budget alerts.
- **Insights Screen** — Week-over-week comparison, category breakdown, and monthly summary stats.
- **Profile Screen** — User stats, application settings, and secure logout.

### UX Details
- Personalised greeting based on time of day and user name.
- Haptic feedback on save and delete actions for a tactile experience.
- Empty states with helpful prompts on every screen to guide new users.
- Delete confirmation alerts to prevent accidental data loss.
- Per-user data isolation — support for multiple accounts on the same device.
- Rich seed data on first login so evaluators can immediately interact with a live dashboard.

### Auth
- Email/password signup and login.
- Form validation with real-time inline error messages.
- Demo account provided for instant evaluation.
- JWT-ready architecture with prepared AsyncStorage token slots.

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React Native (Expo SDK 54) |
| Language | TypeScript |
| Navigation | Expo Router (file-based) |
| State | Zustand with persist middleware |
| Storage | AsyncStorage (offline-first) |
| Charts | Custom React Native components (optimized, no heavy libraries) |
| Icons | Expo Vector Icons (Ionicons) |
| Haptics | expo-haptics |

---

## 🚀 Setup & Run

### Prerequisites
- Node.js 18+
- Expo Go app on your phone ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) / [iOS](https://apps.apple.com/app/expo-go/id982107779))

### Steps
```bash
# 1. Clone the repo
git clone [https://github.com/yourusername/flo-finance.git](https://github.com/yourusername/flo-finance.git)
cd flo-finance

# 2. Install dependencies
npm install

# 3. Start the development server
npx expo start --clear

# 4. Scan the QR code with Expo Go

APK (Android Build)

npm install -g eas-cli
eas login
eas build -p android --profile preview
# Download link will be generated after ~15 mins

🎨 Design Decisions
Color Palette — Cyprus & Sand Dune - Primary: #004643 (Cyprus green) — communicates trust and financial stability.

Background: #F0EDE5 (Sand Dune) — a warm, paper-like tone that is approachable and easy on the eyes.

Dark Mode: #0D1F1E — a deep forest tone for reduced eye strain.

State Management: Zustand over Redux For a focused personal finance app, Zustand's minimal API reduces boilerplate by ~60% while providing identical reactivity and persistence. It offers a cleaner developer experience without the complexity of Redux.

Custom Charts vs Libraries Standard libraries often require heavy peer dependencies. By building custom bar and progress charts with standard View components, we achieved full theme control and significantly smaller bundle sizes.

Data Persistence Transactions and goals are persisted locally using AsyncStorage. The stores are namespaced by userId, ensuring that data remains isolated even if multiple users share the same device.

🔭 Roadmap (Next Steps)
[ ] NestJS Backend — Implement a REST API with robust JWT authentication.

[ ] Cloud Sync — Integrate PostgreSQL via Supabase for multi-device data persistence.

[ ] AI Spending Analyst — Claude API integration for personalized spending insights.

[ ] Push Notifications — Automated anomaly detection and budget limit alerts.

[ ] Export Options — Generate and download monthly statements in CSV/PDF format.

[ ] Recurring Transactions — Automated logging for subscriptions and utility bills.

💡 Assumptions Made
Budget Scope: The budget "Shields" operate on a fixed calendar month basis.

Currency: Seed data and default formatting use INR (₹).

Theming: The app defaults to the system's Light/Dark mode setting for a native feel.

Offline Access: The app is designed to be functional offline, syncing only when a backend is integrated.

Security: No email verification is implemented for the portfolio version; production would require OTP/Magic Link.