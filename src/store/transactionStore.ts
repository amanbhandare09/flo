import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transaction } from '../types';
import { seedTransactions } from '../utils/seedData';

interface TransactionStore {
  transactions: Transaction[];
  hasSeeded: boolean;
  addTransaction: (t: Omit<Transaction, 'id' | 'createdAt'>) => void;
  updateTransaction: (id: string, data: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  initSeed: () => void;
}

export const useTransactionStore = create<TransactionStore>()(
  persist(
    (set, get) => ({
      transactions: [],
      hasSeeded: false,

      initSeed: () => {
        if (!get().hasSeeded) {
          set({ transactions: seedTransactions, hasSeeded: true });
        }
      },

      addTransaction: (t) => set(state => ({
        transactions: [{
          ...t, id: Date.now().toString(), createdAt: new Date().toISOString()
        }, ...state.transactions]
      })),

      updateTransaction: (id, data) => set(state => ({
        transactions: state.transactions.map(t => t.id === id ? { ...t, ...data } : t)
      })),

      deleteTransaction: (id) => set(state => ({
        transactions: state.transactions.filter(t => t.id !== id)
      })),
    }),
    { name: 'flo-transactions', storage: createJSONStorage(() => AsyncStorage) }
  )
);