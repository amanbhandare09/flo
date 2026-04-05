// src/store/transactionStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transaction } from '../types';
import { seedTransactions } from '../utils/seedData';

interface TransactionStore {
  transactions: Transaction[];
  hasSeeded: boolean;
  addTransaction: (t: Omit<Transaction, 'id' | 'createdAt'>) => void;
  updateTransaction: (id: string, t: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  seedIfEmpty: () => void;
}

export const useTransactionStore = create<TransactionStore>()(
  persist(
    (set, get) => ({
      transactions: [],
      hasSeeded: false,

      seedIfEmpty: () => {
        if (!get().hasSeeded) {
          set({ transactions: seedTransactions, hasSeeded: true });
        }
      },

      addTransaction: (t) => set((state) => ({
        transactions: [
          {
            ...t,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
          },
          ...state.transactions,
        ],
      })),

      updateTransaction: (id, updated) => set((state) => ({
        transactions: state.transactions.map((t) =>
          t.id === id ? { ...t, ...updated } : t
        ),
      })),

      deleteTransaction: (id) => set((state) => ({
        transactions: state.transactions.filter((t) => t.id !== id),
      })),
    }),
    {
      name: 'flo-transactions',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);