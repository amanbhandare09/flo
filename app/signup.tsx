import { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, useColorScheme, ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../src/store/authStore';
import { Colors } from '../src/constants/colors';

export default function SignupScreen() {
  const scheme = useColorScheme();
  const C = Colors[scheme ?? 'light'];
  const router = useRouter();
  const signup = useAuthStore(s => s.signup);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Name is required';
    if (!email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email';
    if (!password) e.password = 'Password is required';
    else if (password.length < 6) e.password = 'Minimum 6 characters';
    if (password !== confirm) e.confirm = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSignup = () => {
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      const result = signup(name, email, password);
      setLoading(false);
      if (result.success) {
        router.replace('/(tabs)');
      } else {
        setErrors({ email: result.error ?? 'Signup failed' });
      }
    }, 600);
  };

  const s = styles(C);
  const field = (
    label: string, value: string, setter: (v: string) => void,
    key: string, props: any = {}
  ) => (
    <View style={s.fieldGroup}>
      <Text style={s.label}>{label}</Text>
      <TextInput
        style={[s.input, errors[key] && s.inputError]}
        placeholderTextColor={C.subtext}
        value={value}
        onChangeText={v => { setter(v); setErrors(e => ({ ...e, [key]: '' })); }}
        {...props}
      />
      {errors[key] ? <Text style={s.errorText}>{errors[key]}</Text> : null}
    </View>
  );

  return (
    <KeyboardAvoidingView style={s.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
        <View style={s.header}>
          <Text style={s.logo}>Flo</Text>
          <Text style={s.tagline}>Create your account</Text>
          <Text style={s.subtitle}>Start tracking your finances today</Text>
        </View>

        <View style={s.form}>
          {field('Full Name', name, setName, 'name', {
            placeholder: 'Rahul Sharma',
            autoCapitalize: 'words',
          })}
          {field('Email', email, setEmail, 'email', {
            placeholder: 'you@example.com',
            keyboardType: 'email-address',
            autoCapitalize: 'none',
          })}

          <View style={s.fieldGroup}>
            <Text style={s.label}>Password</Text>
            <View style={[s.input, s.passwordRow, errors.password && s.inputError]}>
              <TextInput
                style={{ flex: 1, color: C.text, fontSize: 16 }}
                placeholder="Min 6 characters"
                placeholderTextColor={C.subtext}
                value={password}
                onChangeText={v => { setPassword(v); setErrors(e => ({ ...e, password: '' })); }}
                secureTextEntry={!showPass}
              />
              <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                <Text style={{ color: C.subtext, fontSize: 13 }}>{showPass ? 'Hide' : 'Show'}</Text>
              </TouchableOpacity>
            </View>
            {errors.password ? <Text style={s.errorText}>{errors.password}</Text> : null}
          </View>

          {field('Confirm Password', confirm, setConfirm, 'confirm', {
            placeholder: 'Repeat password',
            secureTextEntry: true,
          })}

          <TouchableOpacity
            style={[s.btn, loading && { opacity: 0.7 }]}
            onPress={handleSignup}
            disabled={loading}
          >
            <Text style={s.btnText}>{loading ? 'Creating account...' : 'Create Account'}</Text>
          </TouchableOpacity>

          <View style={s.footer}>
            <Text style={{ color: C.subtext }}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={{ color: C.primary, fontWeight: '700' }}>Sign In</Text>
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
  header: { alignItems: 'center', marginBottom: 32 },
  logo: { fontSize: 52, fontWeight: '800', color: C.primary, letterSpacing: -2 },
  tagline: { fontSize: 20, fontWeight: '700', color: C.text, marginTop: 12 },
  subtitle: { fontSize: 14, color: C.subtext, marginTop: 4 },
  form: { gap: 14 },
  fieldGroup: { gap: 6 },
  label: { fontSize: 13, fontWeight: '600', color: C.text },
  input: {
    backgroundColor: C.card, borderRadius: 12, padding: 16,
    fontSize: 16, color: C.text, borderWidth: 1.5, borderColor: C.border,
  },
  inputError: { borderColor: '#C4533A' },
  passwordRow: { flexDirection: 'row', alignItems: 'center' },
  errorText: { color: '#C4533A', fontSize: 12 },
  btn: {
    backgroundColor: C.primary, borderRadius: 14, padding: 18,
    alignItems: 'center', marginTop: 4,
  },
  btnText: { color: '#F0EDE5', fontSize: 16, fontWeight: '700' },
  footer: { flexDirection: 'row', justifyContent: 'center' },
});