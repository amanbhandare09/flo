import { Transaction } from '../types';

export const seedTransactions: Transaction[] = [
  { id: '1', amount: 42000, type: 'income', category: 'Salary',
    date: '2026-04-01T09:00:00Z', note: 'April salary', createdAt: '2026-04-01T09:00:00Z' },
  { id: '2', amount: 450, type: 'expense', category: 'Food',
    date: '2026-04-02T13:00:00Z', note: 'Zomato lunch', createdAt: '2026-04-02T13:00:00Z' },
  { id: '3', amount: 280, type: 'expense', category: 'Transport',
    date: '2026-04-02T18:30:00Z', note: 'Uber to office', createdAt: '2026-04-02T18:30:00Z' },
  { id: '4', amount: 649, type: 'expense', category: 'Entertainment',
    date: '2026-04-03T10:00:00Z', note: 'Netflix', createdAt: '2026-04-03T10:00:00Z' },
  { id: '5', amount: 1200, type: 'expense', category: 'Shopping',
    date: '2026-04-03T15:00:00Z', note: 'Amazon order', createdAt: '2026-04-03T15:00:00Z' },
  { id: '6', amount: 5000, type: 'income', category: 'Freelance',
    date: '2026-04-03T17:00:00Z', note: 'UI design project', createdAt: '2026-04-03T17:00:00Z' },
  { id: '7', amount: 800, type: 'expense', category: 'Food',
    date: '2026-04-04T12:00:00Z', note: 'Grocery run', createdAt: '2026-04-04T12:00:00Z' },
  { id: '8', amount: 500, type: 'expense', category: 'Health',
    date: '2026-04-04T09:00:00Z', note: 'Pharmacy', createdAt: '2026-04-04T09:00:00Z' },
  { id: '9', amount: 3500, type: 'expense', category: 'Utilities',
    date: '2026-03-28T10:00:00Z', note: 'Electricity bill', createdAt: '2026-03-28T10:00:00Z' },
  { id: '10', amount: 15000, type: 'expense', category: 'Rent',
    date: '2026-03-31T10:00:00Z', note: 'Monthly rent', createdAt: '2026-03-31T10:00:00Z' },
];