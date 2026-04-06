import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Goal } from '../types';

const defaultGoals = (userId: string): Goal[] => [
  { id: `${userId}-g1`, label: 'Food Budget', category: 'Food',
    targetAmount: 5000, currentAmount: 0, month: '2026-04' },
  { id: `${userId}-g2`, label: 'Shopping Budget', category: 'Shopping',
    targetAmount: 4000, currentAmount: 0, month: '2026-04' },
  { id: `${userId}-g3`, label: 'Monthly Savings Goal', category: undefined,
    targetAmount: 10000, currentAmount: 0, month: '2026-04' },
];

interface GoalStore {
  goalsByUser: Record<string, Goal[]>;
  seededUsers: string[];
  getGoals: (userId: string) => Goal[];
  initSeed: (userId: string) => void;
  addGoal: (userId: string, g: Omit<Goal, 'id'>) => void;
  updateGoal: (userId: string, id: string, data: Partial<Goal>) => void;
  deleteGoal: (userId: string, id: string) => void;
}

export const useGoalStore = create<GoalStore>()(
  persist(
    (set, get) => ({
      goalsByUser: {},
      seededUsers: [],

      getGoals: (userId) => get().goalsByUser[userId] ?? [],

      initSeed: (userId) => {
        if (!get().seededUsers.includes(userId)) {
          set(state => ({
            goalsByUser: {
              ...state.goalsByUser,
              [userId]: defaultGoals(userId),
            },
            seededUsers: [...state.seededUsers, userId],
          }));
        }
      },

      addGoal: (userId, g) => set(state => {
        const existing = state.goalsByUser[userId] ?? [];
        return {
          goalsByUser: {
            ...state.goalsByUser,
            [userId]: [...existing, { ...g, id: Date.now().toString() }],
          },
        };
      }),

      updateGoal: (userId, id, data) => set(state => {
        const existing = state.goalsByUser[userId] ?? [];
        return {
          goalsByUser: {
            ...state.goalsByUser,
            [userId]: existing.map(g => g.id === id ? { ...g, ...data } : g),
          },
        };
      }),

      deleteGoal: (userId, id) => set(state => {
        const existing = state.goalsByUser[userId] ?? [];
        return {
          goalsByUser: {
            ...state.goalsByUser,
            [userId]: existing.filter(g => g.id !== id),
          },
        };
      }),
    }),
    {
      name: 'flo-goals-v2',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);