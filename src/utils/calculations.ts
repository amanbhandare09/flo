import { Transaction } from '../types';
import { startOfWeek, endOfWeek, subWeeks, isWithinInterval, startOfMonth } from 'date-fns';

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

export const getWeeklyTotals = (transactions: Transaction[]) => {
  const expenses = transactions.filter(t => t.type === 'expense');
  const thisStart = startOfWeek(new Date());
  const thisEnd = endOfWeek(new Date());
  const lastStart = startOfWeek(subWeeks(new Date(), 1));
  const lastEnd = endOfWeek(subWeeks(new Date(), 1));

  const thisWeek = expenses
    .filter(t => isWithinInterval(new Date(t.date), { start: thisStart, end: thisEnd }))
    .reduce((s, t) => s + t.amount, 0);

  const lastWeek = expenses
    .filter(t => isWithinInterval(new Date(t.date), { start: lastStart, end: lastEnd }))
    .reduce((s, t) => s + t.amount, 0);

  return { thisWeek, lastWeek };
};

export const getSpendingByCategory = (transactions: Transaction[]) => {
  const expenses = transactions.filter(t => t.type === 'expense');
  const map: Record<string, number> = {};
  expenses.forEach(t => { map[t.category] = (map[t.category] ?? 0) + t.amount; });
  return Object.entries(map)
    .sort(([, a], [, b]) => b - a)
    .map(([category, amount]) => ({ category, amount }));
};