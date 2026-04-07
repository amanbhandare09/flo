// // src/hooks/useInsights.ts
// import { useMemo } from 'react';
// import { startOfWeek, subWeeks, isWithinInterval, endOfWeek } from 'date-fns';
// import { useTransactionStore } from '../store/transactionStore';
// import { Transaction, Category } from '../types';

// export function useInsights() {
//   const transactions = useTransactionStore((s) => s.transactions);
//   const expenses = transactions.filter((t) => t.type === 'expense');

//   const spendingByCategory = useMemo(() => {
//     const map: Partial<Record<Category, number>> = {};
//     expenses.forEach((t) => {
//       map[t.category] = (map[t.category] ?? 0) + t.amount;
//     });
//     return Object.entries(map)
//       .sort(([, a], [, b]) => b - a)
//       .map(([category, amount]) => ({ category, amount }));
//   }, [expenses]);

//   const thisWeekTotal = useMemo(() => {
//     const start = startOfWeek(new Date());
//     const end = endOfWeek(new Date());
//     return expenses
//       .filter((t) => isWithinInterval(new Date(t.date), { start, end }))
//       .reduce((sum, t) => sum + t.amount, 0);
//   }, [expenses]);

//   const lastWeekTotal = useMemo(() => {
//     const start = startOfWeek(subWeeks(new Date(), 1));
//     const end = endOfWeek(subWeeks(new Date(), 1));
//     return expenses
//       .filter((t) => isWithinInterval(new Date(t.date), { start, end }))
//       .reduce((sum, t) => sum + t.amount, 0);
//   }, [expenses]);

//   const topCategory = spendingByCategory[0] ?? null;

//   const weeklyChange = lastWeekTotal === 0 ? 0
//     : ((thisWeekTotal - lastWeekTotal) / lastWeekTotal) * 100;

//   return {
//     spendingByCategory,
//     thisWeekTotal,
//     lastWeekTotal,
//     topCategory,
//     weeklyChange,
//   };
// }