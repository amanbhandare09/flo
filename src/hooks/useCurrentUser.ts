import { useAuthStore } from '../store/authStore';
import { useTransactionStore } from '../store/transactionStore';
import { useGoalStore } from '../store/goalStore';

export function useCurrentUser() {
  const user = useAuthStore(s => s.user);
  const userId = user?.id ?? '';
  return { user, userId };
}

export function useUserTransactions() {
  const { userId } = useCurrentUser();
  const store = useTransactionStore();

  return {
    transactions: store.getTransactions(userId),
    addTransaction: (
      t: Omit<Parameters<typeof store.addTransaction>[1], never>
    ) => store.addTransaction(userId, t),
    updateTransaction: (
      id: string,
      data: Parameters<typeof store.updateTransaction>[2]
    ) => store.updateTransaction(userId, id, data),
    deleteTransaction: (id: string) =>
      store.deleteTransaction(userId, id),
    initSeed: () => store.initSeed(userId),
  };
}

export function useUserGoals() {
  const { userId } = useCurrentUser();
  const store = useGoalStore();

  return {
    goals: store.getGoals(userId),
    addGoal: (g: Parameters<typeof store.addGoal>[1]) =>
      store.addGoal(userId, g),
    updateGoal: (
      id: string,
      data: Parameters<typeof store.updateGoal>[2]
    ) => store.updateGoal(userId, id, data),
    deleteGoal: (id: string) => store.deleteGoal(userId, id),
    initSeed: () => store.initSeed(userId),
  };
}