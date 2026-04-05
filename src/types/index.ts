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
  date: string;
  note?: string;
  createdAt: string;
}

export interface Goal {
  id: string;
  label: string;
  category?: Category;
  targetAmount: number;
  currentAmount: number;
  month: string;
}