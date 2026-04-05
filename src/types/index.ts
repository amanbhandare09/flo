// src/types/index.ts

export type TransactionType = 'income' | 'expense';

export type Category =
  | 'Food' | 'Transport' | 'Shopping' | 'Entertainment'
  | 'Health' | 'Utilities' | 'Rent' | 'Salary'
  | 'Freelance' | 'Investment' | 'Other';

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: Category;
  date: string;        // ISO 8601
  note?: string;
  createdAt: string;
}

export interface Goal {
  id: string;
  label: string;
  category?: Category;  // null = overall savings goal
  targetAmount: number;
  month: string;        // '2026-04'
}

export interface MonthSummary {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  savingsRate: number;  // percentage
}