import { Tabs } from 'expo-router';
import { useColorScheme, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../src/constants/colors';
import { useTransactionStore } from '../../src/store/transactionStore';

export default function TabLayout() {
  const scheme = useColorScheme();
  const C = Colors[scheme ?? 'light'];
  const transactions = useTransactionStore(s => s.transactions);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: C.primary,
        tabBarInactiveTintColor: C.subtext,
        tabBarStyle: {
          backgroundColor: C.tabBar,
          borderTopColor: C.border,
          borderTopWidth: 1,
          height: 72,
          paddingBottom: 12,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen name="index" options={{
        title: 'Home',
        tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
      }} />

      <Tabs.Screen name="transactions" options={{
        title: 'Transactions',
        tabBarIcon: ({ color, size, focused }) => (
          <View>
            <Ionicons name="list-outline" size={size} color={color} />
            {transactions.length > 0 && (
              <View style={[styles.badge, { backgroundColor: C.primary }]}>
                <Text style={styles.badgeText}>
                  {transactions.length > 99 ? '99+' : transactions.length}
                </Text>
              </View>
            )}
          </View>
        ),
      }} />

      <Tabs.Screen name="insights" options={{
        title: 'Insights',
        tabBarIcon: ({ color, size }) => <Ionicons name="bar-chart-outline" size={size} color={color} />,
      }} />

      <Tabs.Screen name="goals" options={{
        title: 'Goals',
        tabBarIcon: ({ color, size }) => <Ionicons name="shield-outline" size={size} color={color} />,
      }} />

      <Tabs.Screen name="settings" options={{
        title: 'Profile',
        tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />,
      }} />
    </Tabs>
  );
}


const styles = StyleSheet.create({
  badge: {
    position: 'absolute', top: -4, right: -8,
    minWidth: 16, height: 16, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3,
  },
  badgeText: { color: '#fff', fontSize: 9, fontWeight: '800' },
});