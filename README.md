# Flo — Personal Finance Companion

> A clean, intuitive mobile app to track spending, set budget goals,
> and understand your daily money habits.

---

## 🚀 Try the App

### Option 1 — Expo Go (Instant, no install needed)
1. Install [Expo Go](https://expo.dev/go) on your phone.
2. Open this link directly on your mobile device:
   **[exp://u.expo.dev/007de063-cf75-4f09-82b3-fb20150d7c66](exp://u.expo.dev/007de063-cf75-4f09-82b3-fb20150d7c66)**
   
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
- **Home Dashboard** — Balance overview, income vs expenses,
  spending by category chart, daily financial tip
- **Transaction Management** — Full CRUD: add, view, edit,
  delete transactions with confirmation
- **Smart Filtering** — Search by category/note, filter by
  income/expense, sort by date or amount
- **Budget Shields** — Set monthly spending limits per category
  with visual progress tracking and over-budget alerts
- **Insights Screen** — Week-over-week comparison, category
  breakdown, monthly summary stats
- **Profile Screen** — User stats, settings, logout

### UX Details
- Personalised greeting based on time of day and user name
- Haptic feedback on save and delete actions
- Empty states with helpful prompts on every screen
- Delete confirmation alerts to prevent accidental loss
- Per-user data isolation — multiple accounts on same device
- Rich seed data on first login so evaluators see a live dashboard

### Auth
- Email/password signup and login
- Form validation with inline error messages
- Demo account with pre-filled credentials
- JWT-ready architecture (AsyncStorage token slot prepared)

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React Native (Expo SDK 51) |
| Language | TypeScript |
| Navigation | Expo Router (file-based) |
| State | Zustand with persist middleware |
| Storage | AsyncStorage (offline-first) |
| Charts | Custom React Native components (no library) |
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
git clone https://github.com/yourusername/flo-finance.git
cd flo-finance

# 2. Install dependencies
npm install

# 3. Start the development server
npx expo start --clear

# 4. Scan the QR code with Expo Go
```

### APK (Android)
```bash
npm install -g eas-cli
eas login
eas build -p android --profile preview
# Download link printed after ~15 mins
```

---

## 📁 Project Structure

flo/
├── app/                        # Expo Router screens
│   ├── (tabs)/                 # Bottom tab screens
│   │   ├── index.tsx           # Home dashboard
│   │   ├── transactions.tsx    # Transaction list + CRUD
│   │   ├── insights.tsx        # Spending insights
│   │   ├── goals.tsx           # Budget shields
│   │   └── settings.tsx        # Profile & settings
│   ├── add-transaction.tsx     # Add transaction modal
│   ├── edit-transaction.tsx    # Edit transaction modal
│   ├── login.tsx               # Login screen
│   ├── signup.tsx              # Signup screen
│   └── index.tsx               # Splash / entry router
└── src/
├── store/                  # Zustand state (user-scoped)
│   ├── authStore.ts
│   ├── transactionStore.ts
│   └── goalStore.ts
├── hooks/                  # Convenience hooks
│   └── useCurrentUser.ts   # User-scoped store access
├── utils/                  # Pure functions
│   ├── calculations.ts     # Balance, totals, insights logic
│   ├── formatters.ts       # Currency, date formatting
│   ├── helpers.ts          # Time of day, misc
│   └── seedData.ts         # Demo data for first launch
├── constants/
│   ├── colors.ts           # Cyprus/Sand Dune theme
│   └── categories.ts       # Category metadata
├── types/index.ts          # TypeScript interfaces
└── components/ui/
└── AppHeader.tsx       # Shared branded header

---

## 🎨 Design Decisions

**Color Palette — Cyprus & Sand Dune**  
Primary: `#004643` (Cyprus green) — communicates trust, stability  
Background: `#F0EDE5` (Sand Dune) — warm, approachable, easy on eyes  
Dark mode background: `#0D1F1E` — deep forest tone

**Why Zustand over Redux?**  
For a focused single-user app, Zustand's minimal API reduces
boilerplate by ~60% while providing the same reactivity. Redux
would add unnecessary complexity at this scale.

**Why no chart library?**  
`react-native-gifted-charts` requires `expo-linear-gradient`
and adds ~2MB to the bundle. Custom bar charts built with
`View` components achieve the same visual result with zero
dependencies and full theme control.

**Why AsyncStorage over SQLite?**  
For a portfolio app with <1000 transactions per user,
AsyncStorage is sufficient and simpler to reason about.
SQLite would be the right choice at production scale
(added as a future improvement in the roadmap).

**Per-user data isolation**  
Transaction and goal stores are namespaced by `userId`:
`transactionsByUser[userId]`. This ensures multiple accounts
on the same device see only their own data — a pattern that
maps directly to the planned NestJS backend where isolation
is handled at the DB level via `userId` foreign keys.

---

## 🔭 Roadmap (Next Steps)

- [ ] **NestJS Backend** — REST API with JWT authentication
- [ ] **PostgreSQL via Supabase** — Cloud persistence, multi-device sync
- [ ] **AI Spending Analyst** — Claude API integration for
      personalized insights ("You spend 3x more on weekends")
- [ ] **AI Financial Chat** — Ask questions about your own money in
      natural language ("Am I on track this month?")
- [ ] **Push Notifications** — Anomaly detection alerts via cron jobs
- [ ] **Export to CSV/PDF** — Monthly statement download
- [ ] **Recurring Transactions** — Auto-log subscriptions/salary
- [ ] **Multi-currency Support** — For international users

---

## 💡 Assumptions Made

1. Month scope is fixed to calendar month (not rolling 30 days)
2. Budget Shields track actual spending vs limit — not manual input
3. Seed data uses INR (₹) as the default currency
4. Dark/Light mode follows system setting (React Native best practice)
5. No email verification on signup — acceptable for a portfolio app;
   production would require OTP or magic link

---

