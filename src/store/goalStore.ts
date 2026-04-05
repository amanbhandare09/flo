import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Goal } from '../types';

interface GoalStore {
  goals: Goal[];
  hasSeeded: boolean;
  initSeed: () => void;
  addGoal: (g: Omit<Goal, 'id'>) => void;
  updateGoal: (id: string, data: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
}

const defaultGoals: Goal[] = [
  { id: 'g1', label: 'Food Budget', category: 'Food', targetAmount: 5000, currentAmount: 0, month: '2026-04' },
  { id: 'g2', label: 'Shopping Budget', category: 'Shopping', targetAmount: 4000, currentAmount: 0, month: '2026-04' },
  { id: 'g3', label: 'Monthly Savings Goal', category: undefined, targetAmount: 10000, currentAmount: 0, month: '2026-04' },
];

export const useGoalStore = create<GoalStore>()(
  persist(
    (set, get) => ({
      goals: [],
      hasSeeded: false,

      initSeed: () => {
        if (!get().hasSeeded) set({ goals: defaultGoals, hasSeeded: true });
      },

      addGoal: (g) => set(state => ({
        goals: [...state.goals, { ...g, id: Date.now().toString() }]
      })),

      deleteGoal: (id) => set(state => ({
        goals: state.goals.filter(g => g.id !== id)
      })),

      updateGoal: (id, data) => set(state => ({
        goals: state.goals.map(g => g.id === id ? { ...g, ...data } : g)
      })),
    }),
    { name: 'flo-goals', storage: createJSONStorage(() => AsyncStorage) }
  )
);