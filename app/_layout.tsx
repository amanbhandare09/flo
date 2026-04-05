import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useTransactionStore } from '../src/store/transactionStore';
import { useGoalStore } from '../src/store/goalStore';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { Colors } from '../src/constants/colors';

export default function RootLayout() {
  const initTransactions = useTransactionStore(s => s.initSeed);
  const initGoals = useGoalStore(s => s.initSeed);
  const scheme = useColorScheme();
  const C = Colors[scheme ?? 'light'];

  useEffect(() => {
    initTransactions();
    initGoals();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: C.background },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="index" options={{ animation: 'none' }} />
        <Stack.Screen name="login" options={{ animation: 'none' }} />
        <Stack.Screen name="signup" />
        <Stack.Screen name="(tabs)" options={{ animation: 'none' }} />
        <Stack.Screen
          name="add-transaction"
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}