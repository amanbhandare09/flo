# Flo — Personal Finance Companion

> A clean, intuitive mobile app to track spending,
  set budgets, and understand your money habits.

## Demo
[Link to Expo Go QR / Video walkthrough]

## Features
- Dashboard with balance overview and spending chart
- Full transaction CRUD with swipe gestures
- Budget Shields — per-category monthly limits
- Insights with week-over-week comparison
- Dark mode
- Offline-first with AsyncStorage persistence
- Pre-seeded demo data on first launch

## Tech Stack
React Native · Expo · TypeScript · Zustand · AsyncStorage

## Architecture Decisions
- Zustand over Redux: simpler API, less boilerplate for this scale
- AsyncStorage: offline-first, no backend needed for a companion app
- Custom hooks for business logic: keeps screens clean and testable

## Setup
npx expo start → scan QR with Expo Go