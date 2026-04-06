import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { Colors } from '../src/constants/colors';
import { useAuthStore } from '../src/store/authStore';
import { useUserTransactions, useUserGoals } from '../src/hooks/useCurrentUser';

function SeedHandler() {
  const user = useAuthStore(s => s.user);
  const { initSeed: seedTx } = useUserTransactions();
  const { initSeed: seedGoals } = useUserGoals();
  useEffect(() => {
    if (user?.id) { seedTx(); seedGoals(); }
  }, [user?.id]);
  return null;
}

export default function RootLayout() {
  const scheme = useColorScheme();
  const C = Colors[scheme ?? 'light'];
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <SeedHandler />
      <Stack screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: C.background },
        animation: 'fade',
      }}>
        <Stack.Screen name="index" options={{ animation: 'none' }} />
        <Stack.Screen name="login" options={{ animation: 'none' }} />
        <Stack.Screen name="signup" />
        <Stack.Screen name="(tabs)" options={{ animation: 'none' }} />
        <Stack.Screen
          name="add-transaction"
          options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
        />
        <Stack.Screen
          name="edit-transaction"
          options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}