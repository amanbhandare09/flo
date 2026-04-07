# Flo — Personal Finance Companion

> A mobile app to track spending, set budget goals, and understand your daily money habits.

---

## 📱 Try the App

### Option 1 — Expo Go (Recommended — works instantly worldwide)

1. Install **Expo Go** on your phone → [Android](https://play.google.com/store/apps/details?id=host.exp.exponent) · [iOS](https://apps.apple.com/app/expo-go/id982107779)
2. Open Expo Go → tap **"Enter URL manually"**
3. Paste this link:

```
exp://u.expo.dev/007de063-cf75-4f09-82b3-fb20150d7c66?channel-name=main
```

**Or scan this QR code directly from your phone camera:**

<img src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=exp://u.expo.dev/007de063-cf75-4f09-82b3-fb20150d7c66?channel-name=main" alt="Expo Go QR Code" width="200" height="200"/>

> **Latest build:** [View on Expo Dashboard](https://expo.dev/accounts/amanb09/projects/flo-finance/updates/de2c71a2-a2ed-4c4a-957f-f7de48d06bdb)

---

### Option 2 — APK (Android direct install)

> [Download APK](https://expo.dev/accounts/amanb09/projects/flo-finance/builds)

Steps to install:
1. Download the `.apk` file on your Android phone
2. Go to **Settings → Install unknown apps** and allow installation
3. Tap the downloaded file to install

---

### Demo Account

| Field | Value |
|-------|-------|
| Email | `virat@flo.app` |
| Password | `vk@flo18` |

> The demo account comes pre-loaded with 4 months of transaction data (Jan–Apr 2026) so you can explore all features immediately.

---

## ✨ Features

### Core Features
- **Home Dashboard** — Balance overview, income vs expenses summary, spending by category chart, and a daily financial tip
- **Transaction Management** — Full CRUD: add, view, edit, and delete transactions with confirmation prompts
- **Month-grouped Statement** — Transactions grouped by month (January 2026, February 2026, etc.) with a net total per month
- **Smart Filtering & Search** — Search by category or note, filter by income/expense, sort by date or amount
- **Budget Shields** — Set monthly spending limits per category with visual progress bars and over-budget alerts
- **Insights Screen** — Week-over-week spending comparison, category breakdown with percentages, and monthly summary stats
- **Profile Screen** — User stats (total income, expenses, balance), app settings, and secure logout

### UX Details
- Personalised greeting based on time of day and logged-in user's name
- Haptic feedback on save and delete actions for a tactile experience
- Empty states with helpful prompts on every screen
- Delete confirmation alerts to prevent accidental data loss
- Per-user data isolation — multiple accounts on the same device each see only their own data
- Rich seed data on first login so evaluators immediately see a populated, interactive dashboard

### Auth
- Email/password signup and login with full form validation
- Real-time inline error messages
- Demo account for instant evaluation
- Per-user namespaced storage — architecture designed to map directly to a JWT-authenticated backend

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React Native (Expo SDK 54) |
| Language | TypeScript |
| Navigation | Expo Router v4 (file-based routing) |
| State Management | Zustand with persist middleware |
| Storage | AsyncStorage (offline-first) |
| Charts | Custom React Native components (no heavy libraries) |
| Icons | Expo Vector Icons (Ionicons) |
| Haptics | expo-haptics |

---

## 🚀 Run Locally

### Prerequisites
- Node.js 18+
- Expo Go on your phone ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) / [iOS](https://apps.apple.com/app/expo-go/id982107779))

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/amanb09/flo-finance.git
cd flo-finance

# 2. Install dependencies
npm install

# 3. Start the development server
npx expo start --clear

# 4. Scan the QR code shown in terminal with Expo Go
```

### Build APK (Android)

```bash
npm install -g eas-cli
eas login
eas build -p android --profile preview
# A download link is printed after ~15 minutes
```

---

## 🎨 Design Decisions

**Color Palette — Cyprus & Sand Dune**
- Primary: `#004643` (Cyprus green) — communicates trust and financial stability
- Background: `#F0EDE5` (Sand Dune) — warm, paper-like tone that is approachable and easy on the eyes
- Dark mode: `#0D1F1E` — deep forest tone for reduced eye strain

**Zustand over Redux**
Zustand's minimal API reduces boilerplate by ~60% for a focused single-user app while providing identical reactivity and persistence. Redux would add unnecessary complexity at this scale.

**Custom Charts over Libraries**
`react-native-gifted-charts` requires `expo-linear-gradient` as a peer dependency and adds significant bundle weight. Custom bar and progress charts built with standard `View` components achieve the same result with full theme control and zero dependency overhead.

**Per-user Data Isolation**
Transaction and goal stores are namespaced by `userId` in AsyncStorage (`transactionsByUser[userId]`). This ensures multiple accounts on the same device see only their own data — a pattern that maps directly to the planned NestJS + PostgreSQL backend where isolation is handled via `userId` foreign keys at the database level.

**Month-grouped Transactions**
Rather than a flat list, transactions are grouped by calendar month with a net balance per group. This makes financial patterns immediately visible without navigating to the Insights screen.

---

## 🔭 Roadmap

- [ ] **NestJS Backend** — REST API with JWT authentication and refresh token rotation
- [ ] **PostgreSQL via Supabase** — Cloud persistence and multi-device sync
- [ ] **AI Spending Analyst** — Claude API integration for personalised insights (*"You spend 3× more on weekends"*)
- [ ] **AI Financial Chat** — Ask natural language questions about your own money
- [ ] **Push Notifications** — Cron-based anomaly detection and budget limit alerts
- [ ] **Export to CSV/PDF** — Downloadable monthly statements
- [ ] **Recurring Transactions** — Auto-logging for subscriptions and salary
- [ ] **Multi-currency Support** — For international users

---

## 📝 License

Built for assessment purposes. Not intended for commercial distribution.