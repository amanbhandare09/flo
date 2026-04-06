import { Transaction } from '../types';

export const seedTransactions: Transaction[] = [
  // ── JANUARY 2026 ──────────────────────────────
  {
    id: 's-jan-1', amount: 42000, type: 'income', category: 'Salary',
    date: '2026-01-01T09:00:00Z', note: 'January salary', createdAt: '2026-01-01T09:00:00Z',
  },
  {
    id: 's-jan-2', amount: 15000, type: 'expense', category: 'Rent',
    date: '2026-01-02T10:00:00Z', note: 'Monthly rent', createdAt: '2026-01-02T10:00:00Z',
  },
  {
    id: 's-jan-3', amount: 3200, type: 'expense', category: 'Food',
    date: '2026-01-05T13:00:00Z', note: 'Weekly groceries', createdAt: '2026-01-05T13:00:00Z',
  },
  {
    id: 's-jan-4', amount: 649, type: 'expense', category: 'Entertainment',
    date: '2026-01-06T10:00:00Z', note: 'Netflix subscription', createdAt: '2026-01-06T10:00:00Z',
  },
  {
    id: 's-jan-5', amount: 1800, type: 'expense', category: 'Shopping',
    date: '2026-01-10T15:00:00Z', note: 'Winter clothes', createdAt: '2026-01-10T15:00:00Z',
  },
  {
    id: 's-jan-6', amount: 450, type: 'expense', category: 'Transport',
    date: '2026-01-12T08:00:00Z', note: 'Monthly metro pass', createdAt: '2026-01-12T08:00:00Z',
  },
  {
    id: 's-jan-7', amount: 8000, type: 'income', category: 'Freelance',
    date: '2026-01-15T17:00:00Z', note: 'Logo design project', createdAt: '2026-01-15T17:00:00Z',
  },
  {
    id: 's-jan-8', amount: 2200, type: 'expense', category: 'Utilities',
    date: '2026-01-18T10:00:00Z', note: 'Electricity + internet', createdAt: '2026-01-18T10:00:00Z',
  },
  {
    id: 's-jan-9', amount: 900, type: 'expense', category: 'Health',
    date: '2026-01-22T11:00:00Z', note: 'Doctor visit', createdAt: '2026-01-22T11:00:00Z',
  },
  {
    id: 's-jan-10', amount: 600, type: 'expense', category: 'Food',
    date: '2026-01-25T19:00:00Z', note: 'Restaurant dinner', createdAt: '2026-01-25T19:00:00Z',
  },
  // ── FEBRUARY 2026 ─────────────────────────────
  {
    id: 's-feb-1', amount: 42000, type: 'income', category: 'Salary',
    date: '2026-02-01T09:00:00Z', note: 'February salary', createdAt: '2026-02-01T09:00:00Z',
  },
  {
    id: 's-feb-2', amount: 15000, type: 'expense', category: 'Rent',
    date: '2026-02-02T10:00:00Z', note: 'Monthly rent', createdAt: '2026-02-02T10:00:00Z',
  },
  {
    id: 's-feb-3', amount: 2800, type: 'expense', category: 'Food',
    date: '2026-02-04T13:00:00Z', note: 'Groceries', createdAt: '2026-02-04T13:00:00Z',
  },
  {
    id: 's-feb-4', amount: 3500, type: 'income', category: 'Freelance',
    date: '2026-02-08T17:00:00Z', note: 'React Native consulting', createdAt: '2026-02-08T17:00:00Z',
  },
  {
    id: 's-feb-5', amount: 1200, type: 'expense', category: 'Shopping',
    date: '2026-02-10T15:00:00Z', note: 'Valentine\'s gift', createdAt: '2026-02-10T15:00:00Z',
  },
  {
    id: 's-feb-6', amount: 649, type: 'expense', category: 'Entertainment',
    date: '2026-02-14T10:00:00Z', note: 'Netflix subscription', createdAt: '2026-02-14T10:00:00Z',
  },
  {
    id: 's-feb-7', amount: 350, type: 'expense', category: 'Transport',
    date: '2026-02-16T08:00:00Z', note: 'Cab rides', createdAt: '2026-02-16T08:00:00Z',
  },
  {
    id: 's-feb-8', amount: 2100, type: 'expense', category: 'Utilities',
    date: '2026-02-20T10:00:00Z', note: 'Monthly bills', createdAt: '2026-02-20T10:00:00Z',
  },
  {
    id: 's-feb-9', amount: 5000, type: 'income', category: 'Investment',
    date: '2026-02-25T14:00:00Z', note: 'Mutual fund returns', createdAt: '2026-02-25T14:00:00Z',
  },
  // ── MARCH 2026 ────────────────────────────────
  {
    id: 's-mar-1', amount: 42000, type: 'income', category: 'Salary',
    date: '2026-03-01T09:00:00Z', note: 'March salary', createdAt: '2026-03-01T09:00:00Z',
  },
  {
    id: 's-mar-2', amount: 15000, type: 'expense', category: 'Rent',
    date: '2026-03-02T10:00:00Z', note: 'Monthly rent', createdAt: '2026-03-02T10:00:00Z',
  },
  {
    id: 's-mar-3', amount: 3500, type: 'expense', category: 'Food',
    date: '2026-03-06T12:00:00Z', note: 'Groceries + dining', createdAt: '2026-03-06T12:00:00Z',
  },
  {
    id: 's-mar-4', amount: 12000, type: 'income', category: 'Freelance',
    date: '2026-03-10T17:00:00Z', note: 'App development project', createdAt: '2026-03-10T17:00:00Z',
  },
  {
    id: 's-mar-5', amount: 4500, type: 'expense', category: 'Shopping',
    date: '2026-03-15T15:00:00Z', note: 'Electronics accessories', createdAt: '2026-03-15T15:00:00Z',
  },
  {
    id: 's-mar-6', amount: 649, type: 'expense', category: 'Entertainment',
    date: '2026-03-16T10:00:00Z', note: 'Netflix subscription', createdAt: '2026-03-16T10:00:00Z',
  },
  {
    id: 's-mar-7', amount: 1500, type: 'expense', category: 'Health',
    date: '2026-03-18T11:00:00Z', note: 'Gym membership', createdAt: '2026-03-18T11:00:00Z',
  },
  {
    id: 's-mar-8', amount: 800, type: 'expense', category: 'Transport',
    date: '2026-03-20T08:00:00Z', note: 'Petrol + parking', createdAt: '2026-03-20T08:00:00Z',
  },
  {
    id: 's-mar-9', amount: 2500, type: 'expense', category: 'Utilities',
    date: '2026-03-25T10:00:00Z', note: 'Electricity bill', createdAt: '2026-03-25T10:00:00Z',
  },
  {
    id: 's-mar-10', amount: 700, type: 'expense', category: 'Food',
    date: '2026-03-28T19:00:00Z', note: 'Zomato orders', createdAt: '2026-03-28T19:00:00Z',
  },
  // ── APRIL 2026 ────────────────────────────────
  {
    id: 's-apr-1', amount: 42000, type: 'income', category: 'Salary',
    date: '2026-04-01T09:00:00Z', note: 'April salary', createdAt: '2026-04-01T09:00:00Z',
  },
  {
    id: 's-apr-2', amount: 15000, type: 'expense', category: 'Rent',
    date: '2026-04-02T10:00:00Z', note: 'Monthly rent', createdAt: '2026-04-02T10:00:00Z',
  },
  {
    id: 's-apr-3', amount: 450, type: 'expense', category: 'Food',
    date: '2026-04-02T13:00:00Z', note: 'Zomato lunch', createdAt: '2026-04-02T13:00:00Z',
  },
  {
    id: 's-apr-4', amount: 280, type: 'expense', category: 'Transport',
    date: '2026-04-02T18:30:00Z', note: 'Uber to office', createdAt: '2026-04-02T18:30:00Z',
  },
  {
    id: 's-apr-5', amount: 649, type: 'expense', category: 'Entertainment',
    date: '2026-04-03T10:00:00Z', note: 'Netflix subscription', createdAt: '2026-04-03T10:00:00Z',
  },
  {
    id: 's-apr-6', amount: 1200, type: 'expense', category: 'Shopping',
    date: '2026-04-03T15:00:00Z', note: 'Amazon order', createdAt: '2026-04-03T15:00:00Z',
  },
  {
    id: 's-apr-7', amount: 5000, type: 'income', category: 'Freelance',
    date: '2026-04-03T17:00:00Z', note: 'UI design project', createdAt: '2026-04-03T17:00:00Z',
  },
  {
    id: 's-apr-8', amount: 800, type: 'expense', category: 'Food',
    date: '2026-04-04T12:00:00Z', note: 'Grocery run', createdAt: '2026-04-04T12:00:00Z',
  },
  {
    id: 's-apr-9', amount: 500, type: 'expense', category: 'Health',
    date: '2026-04-04T09:00:00Z', note: 'Pharmacy', createdAt: '2026-04-04T09:00:00Z',
  },
  {
    id: 's-apr-10', amount: 3000, type: 'income', category: 'Freelance',
    date: '2026-04-06T17:00:00Z', note: 'Video editing gig', createdAt: '2026-04-06T17:00:00Z',
  },
];