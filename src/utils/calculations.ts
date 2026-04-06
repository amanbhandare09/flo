import { Transaction } from '../types';
import {
  startOfWeek, endOfWeek, subWeeks,
  isWithinInterval, startOfMonth, format
} from 'date-fns';

export const getBalance = (transactions: Transaction[]) => {
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((s, t) => s + t.amount, 0);
  const expense = transactions
    .filter(t => t.type === 'expense')
    .reduce((s, t) => s + t.amount, 0);
  return { income, expense, balance: income - expense };
};

export const getThisMonthTransactions = (transactions: Transaction[]) => {
  const start = startOfMonth(new Date());
  return transactions.filter(t => new Date(t.date) >= start);
};

export const getSpendingByCategory = (transactions: Transaction[]) => {
  const expenses = transactions.filter(t => t.type === 'expense');
  const map: Record<string, number> = {};
  expenses.forEach(t => {
    map[t.category] = (map[t.category] ?? 0) + t.amount;
  });
  return Object.entries(map)
    .sort(([, a], [, b]) => b - a)
    .map(([category, amount]) => ({ category, amount }));
};

// ✅ FIXED: counts ALL transactions (income + expense) for weekly totals
export const getWeeklyTotals = (transactions: Transaction[]) => {
  // Only expenses for comparison (spending comparison makes more sense)
  const expenses = transactions.filter(t => t.type === 'expense');

  const thisStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const thisEnd = endOfWeek(new Date(), { weekStartsOn: 1 });
  const lastStart = startOfWeek(subWeeks(new Date(), 1), { weekStartsOn: 1 });
  const lastEnd = endOfWeek(subWeeks(new Date(), 1), { weekStartsOn: 1 });

  const thisWeek = expenses
    .filter(t => isWithinInterval(new Date(t.date), { start: thisStart, end: thisEnd }))
    .reduce((s, t) => s + t.amount, 0);

  const lastWeek = expenses
    .filter(t => isWithinInterval(new Date(t.date), { start: lastStart, end: lastEnd }))
    .reduce((s, t) => s + t.amount, 0);

  return { thisWeek, lastWeek };
};

// ✅ NEW: group transactions by month label
export const groupTransactionsByMonth = (transactions: Transaction[]) => {
  const groups: Record<string, Transaction[]> = {};

  transactions.forEach(t => {
    const key = format(new Date(t.date), 'MMMM yyyy'); // "April 2026"
    if (!groups[key]) groups[key] = [];
    groups[key].push(t);
  });

  // Sort groups newest first
  return Object.entries(groups).sort(([a], [b]) => {
    const dateA = new Date(groups[a][0].date);
    const dateB = new Date(groups[b][0].date);
    return dateB.getTime() - dateA.getTime();
  });
};