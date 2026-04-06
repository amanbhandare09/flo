import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

interface AuthStore {
  user: User | null;
  isLoggedIn: boolean;
  users: User[];
  login: (email: string, password: string) => { success: boolean; error?: string };
  signup: (name: string, email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isLoggedIn: false,

      // Pre-seeded demo account — always available
      users: [
        {
          id: 'demo-user-002',
          name: 'Virat Kohli',
          email: 'virat@flo.app',
          password: 'vk@flo18',
        },
      ],

      login: (email, password) => {
        const found = get().users.find(
          u =>
            u.email.toLowerCase() === email.toLowerCase() &&
            u.password === password
        );
        if (!found) {
          return { success: false, error: 'Invalid email or password' };
        }
        set({ user: found, isLoggedIn: true });
        return { success: true };
      },

      signup: (name, email, password) => {
        const exists = get().users.find(
          u => u.email.toLowerCase() === email.toLowerCase()
        );
        if (exists) {
          return { success: false, error: 'An account with this email already exists' };
        }
        const newUser: User = {
          id: `user-${Date.now()}`,
          name: name.trim(),
          email: email.toLowerCase().trim(),
          password,
        };
        set(state => ({
          users: [...state.users, newUser],
          user: newUser,
          isLoggedIn: true,
        }));
        return { success: true };
      },

      logout: () => set({ user: null, isLoggedIn: false }),
    }),
    {
      name: 'flo-auth',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);