import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transaction } from '../types';
import { seedTransactions } from '../utils/seedData';

interface TransactionStore {
  transactionsByUser: Record<string, Transaction[]>;
  seededUsers: string[];
  getTransactions: (userId: string) => Transaction[];
  addTransaction: (userId: string, t: Omit<Transaction, 'id' | 'createdAt'>) => void;
  updateTransaction: (userId: string, id: string, data: Partial<Transaction>) => void;
  deleteTransaction: (userId: string, id: string) => void;
  initSeed: (userId: string) => void;
}

export const useTransactionStore = create<TransactionStore>()(
  persist(
    (set, get) => ({
      transactionsByUser: {},
      seededUsers: [],

      getTransactions: (userId) => {
        return get().transactionsByUser[userId] ?? [];
      },

      initSeed: (userId) => {
        if (!get().seededUsers.includes(userId)) {
          set(state => ({
            transactionsByUser: {
              ...state.transactionsByUser,
              [userId]: seedTransactions,
            },
            seededUsers: [...state.seededUsers, userId],
          }));
        }
      },

      addTransaction: (userId, t) => set(state => {
        const existing = state.transactionsByUser[userId] ?? [];
        return {
          transactionsByUser: {
            ...state.transactionsByUser,
            [userId]: [{
              ...t,
              id: Date.now().toString(),
              createdAt: new Date().toISOString(),
            }, ...existing],
          },
        };
      }),

      updateTransaction: (userId, id, data) => set(state => {
        const existing = state.transactionsByUser[userId] ?? [];
        return {
          transactionsByUser: {
            ...state.transactionsByUser,
            [userId]: existing.map(t => t.id === id ? { ...t, ...data } : t),
          },
        };
      }),

      deleteTransaction: (userId, id) => set(state => {
        const existing = state.transactionsByUser[userId] ?? [];
        return {
          transactionsByUser: {
            ...state.transactionsByUser,
            [userId]: existing.filter(t => t.id !== id),
          },
        };
      }),
    }),
    {
      name: 'flo-transactions-v3',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);