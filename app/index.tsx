import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { useAuthStore } from '../src/store/authStore';

export default function EntryScreen() {
  const router = useRouter();
  const isLoggedIn = useAuthStore(s => s.isLoggedIn);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoggedIn) {
        router.replace('/(tabs)');
      } else {
        router.replace('/login');
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Flo</Text>
      <Text style={styles.tagline}>Your money, simplified</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#004643',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    fontSize: 64,
    fontWeight: '800',
    color: '#F0EDE5',
    letterSpacing: -2,
  },
  tagline: {
    fontSize: 16,
    color: 'rgba(240,237,229,0.7)',
    marginTop: 8,
    letterSpacing: 1,
  },
});