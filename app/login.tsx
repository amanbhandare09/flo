import { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, Alert, useColorScheme, ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../src/store/authStore';
import { Colors } from '../src/constants/colors';

export default function LoginScreen() {
  const scheme = useColorScheme();
  const C = Colors[scheme ?? 'light'];
  const router = useRouter();
  const login = useAuthStore(s => s.login);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email';
    if (!password) e.password = 'Password is required';
    else if (password.length < 6) e.password = 'Minimum 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      const result = login(email, password);
      setLoading(false);
      if (result.success) {
        router.replace('/(tabs)');
      } else {
        Alert.alert('Login Failed', result.error);
      }
    }, 600);
  };

  const s = styles(C);

  return (
    <KeyboardAvoidingView
      style={s.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={s.header}>
          <Text style={s.logo}>Flo</Text>
          <Text style={s.tagline}>Welcome back 👋</Text>
          <Text style={s.subtitle}>Sign in to your account</Text>
        </View>

        {/* Form */}
        <View style={s.form}>
          <View style={s.fieldGroup}>
            <Text style={s.label}>Email</Text>
            <TextInput
              style={[s.input, errors.email && s.inputError]}
              placeholder="you@example.com"
              placeholderTextColor={C.subtext}
              value={email}
              onChangeText={t => { setEmail(t); setErrors(e => ({ ...e, email: undefined })); }}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {errors.email && <Text style={s.errorText}>{errors.email}</Text>}
          </View>

          <View style={s.fieldGroup}>
            <Text style={s.label}>Password</Text>
            <View style={[s.input, s.passwordRow, errors.password && s.inputError]}>
              <TextInput
                style={{ flex: 1, color: C.text, fontSize: 16 }}
                placeholder="••••••••"
                placeholderTextColor={C.subtext}
                value={password}
                onChangeText={t => { setPassword(t); setErrors(e => ({ ...e, password: undefined })); }}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Text style={{ color: C.subtext, fontSize: 13 }}>
                  {showPassword ? 'Hide' : 'Show'}
                </Text>
              </TouchableOpacity>
            </View>
            {errors.password && <Text style={s.errorText}>{errors.password}</Text>}
          </View>

          <TouchableOpacity
            style={[s.btn, loading && { opacity: 0.7 }]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={s.btnText}>{loading ? 'Signing in...' : 'Sign In'}</Text>
          </TouchableOpacity>

          {/* Demo hint */}
          <View style={s.demoBox}>
            <Text style={s.demoTitle}>🧪 Demo Account</Text>
            <Text style={s.demoText}>Email: virat@flo.app</Text>
            <Text style={s.demoText}>Password: vk@flo18</Text>
            <TouchableOpacity onPress={() => { setEmail('virat@flo.app'); setPassword('vk@flo18'); }}>
              <Text style={[s.demoText, { color: C.primary, fontWeight: '700', marginTop: 4 }]}>
                Tap to autofill →
              </Text>
            </TouchableOpacity>
          </View>

          <View style={s.footer}>
            <Text style={{ color: C.subtext }}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/signup')}>
              <Text style={{ color: C.primary, fontWeight: '700' }}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = (C: typeof Colors.light) => StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  header: { alignItems: 'center', marginBottom: 40 },
  logo: { fontSize: 52, fontWeight: '800', color: C.primary, letterSpacing: -2 },
  tagline: { fontSize: 22, fontWeight: '700', color: C.text, marginTop: 12 },
  subtitle: { fontSize: 14, color: C.subtext, marginTop: 4 },
  form: { gap: 16 },
  fieldGroup: { gap: 6 },
  label: { fontSize: 13, fontWeight: '600', color: C.text },
  input: {
    backgroundColor: C.card, borderRadius: 12, padding: 16,
    fontSize: 16, color: C.text, borderWidth: 1.5, borderColor: C.border,
  },
  inputError: { borderColor: '#C4533A' },
  passwordRow: { flexDirection: 'row', alignItems: 'center' },
  errorText: { color: '#C4533A', fontSize: 12, marginTop: 2 },
  btn: {
    backgroundColor: C.primary, borderRadius: 14, padding: 18,
    alignItems: 'center', marginTop: 8,
  },
  btnText: { color: '#F0EDE5', fontSize: 16, fontWeight: '700' },
  demoBox: {
    backgroundColor: C.primary + '12', borderRadius: 12, padding: 14,
    borderWidth: 1, borderColor: C.primary + '30',
  },
  demoTitle: { fontWeight: '700', color: C.text, marginBottom: 4 },
  demoText: { fontSize: 13, color: C.subtext },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 8 },
});