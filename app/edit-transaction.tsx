import { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, useColorScheme, TouchableOpacity,
  TextInput, ScrollView, Alert, Platform
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors } from '../src/constants/colors';
import { useUserTransactions } from '../src/hooks/useCurrentUser';
import { CATEGORIES } from '../src/constants/categories';
import { Category, TransactionType } from '../src/types';
import * as Haptics from 'expo-haptics';

export default function EditTransactionScreen() {
  const scheme = useColorScheme();
  const C = Colors[scheme ?? 'light'];
  const router = useRouter();
  const params = useLocalSearchParams<{
    id: string;
    amount: string;
    type: string;
    category: string;
    note: string;
  }>();

  const { updateTransaction } = useUserTransactions();

  const [amount, setAmount] = useState(params.amount ?? '');
  const [type, setType] = useState<TransactionType>((params.type as TransactionType) ?? 'expense');
  const [category, setCategory] = useState<Category>((params.category as Category) ?? 'Food');
  const [note, setNote] = useState(params.note ?? '');

  const handleSave = () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      Alert.alert('Invalid amount', 'Please enter a valid amount');
      return;
    }
    updateTransaction(params.id, {
      amount: Number(amount),
      type,
      category,
      note: note.trim(),
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.back();
  };

  const s = styles(C);

  return (
    <View style={s.container}>
      <View style={s.handleBar} />

      <View style={s.header}>
        <TouchableOpacity
          style={s.cancelBtn}
          onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)')}
        >
          <Text style={[s.cancelText, { color: C.subtext }]}>Cancel</Text>
        </TouchableOpacity>
        <Text style={s.title}>Edit Transaction</Text>
        <TouchableOpacity style={[s.saveBtn, { backgroundColor: C.primary }]} onPress={handleSave}>
          <Text style={s.saveText}>Update</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* Type Toggle */}
        <View style={s.typeRow}>
          <TouchableOpacity
            style={[s.typeBtn, { borderColor: C.border, backgroundColor: C.card },
              type === 'expense' && { backgroundColor: C.expense, borderColor: C.expense }]}
            onPress={() => setType('expense')}
          >
            <Text style={[s.typeBtnText, { color: C.text },
              type === 'expense' && { color: '#fff' }]}>
              {'↓ Expense'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.typeBtn, { borderColor: C.border, backgroundColor: C.card },
              type === 'income' && { backgroundColor: C.income, borderColor: C.income }]}
            onPress={() => setType('income')}
          >
            <Text style={[s.typeBtnText, { color: C.text },
              type === 'income' && { color: '#fff' }]}>
              {'↑ Income'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Amount */}
        <View style={[s.amountCard, { backgroundColor: C.card,
          borderColor: type === 'income' ? C.income : C.expense }]}>
          <Text style={[s.currencySymbol, { color: C.subtext }]}>{'₹'}</Text>
          <TextInput
            style={[s.amountInput, { color: C.text }]}
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor={C.subtext}
            autoFocus
          />
        </View>

        <Text style={[s.sectionLabel, { color: C.subtext }]}>Category</Text>

        <View style={s.categoryGrid}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat.label}
              style={[s.catItem, { borderColor: C.border, backgroundColor: C.card },
                category === cat.label && {
                  backgroundColor: cat.color + '22',
                  borderColor: cat.color,
                  borderWidth: 2,
                }]}
              onPress={() => setCategory(cat.label as Category)}
            >
              <Text style={s.catIcon}>{cat.icon}</Text>
              <Text style={[s.catLabel, {
                color: category === cat.label ? cat.color : C.subtext
              }]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[s.sectionLabel, { color: C.subtext }]}>Note</Text>
        <TextInput
          style={[s.noteInput, { backgroundColor: C.card, color: C.text, borderColor: C.border }]}
          value={note}
          onChangeText={setNote}
          placeholder="Add a note (optional)"
          placeholderTextColor={C.subtext}
          multiline
        />

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = (C: typeof Colors.light) => StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background, paddingTop: Platform.OS === 'ios' ? 12 : 0 },
  handleBar: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: C.border, alignSelf: 'center', marginTop: 12, marginBottom: 4,
  },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: C.border,
  },
  cancelBtn: { padding: 4 },
  cancelText: { fontSize: 15 },
  title: { fontSize: 17, fontWeight: '700', color: C.text },
  saveBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  saveText: { color: '#F0EDE5', fontWeight: '700', fontSize: 14 },
  typeRow: { flexDirection: 'row', margin: 16, gap: 12 },
  typeBtn: {
    flex: 1, paddingVertical: 14, borderRadius: 14,
    alignItems: 'center', borderWidth: 1.5,
  },
  typeBtnText: { fontSize: 15, fontWeight: '700' },
  amountCard: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: 16, marginBottom: 24,
    paddingHorizontal: 20, paddingVertical: 16,
    borderRadius: 16, borderWidth: 2,
  },
  currencySymbol: { fontSize: 32, marginRight: 8, fontWeight: '300' },
  amountInput: { flex: 1, fontSize: 44, fontWeight: '800' },
  sectionLabel: {
    fontSize: 11, fontWeight: '700', letterSpacing: 1,
    marginHorizontal: 16, marginBottom: 10, textTransform: 'uppercase',
  },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, marginBottom: 24 },
  catItem: {
    width: '30%', margin: '1.5%', paddingVertical: 12,
    borderRadius: 14, alignItems: 'center', borderWidth: 1.5,
  },
  catIcon: { fontSize: 26, marginBottom: 4 },
  catLabel: { fontSize: 11, fontWeight: '600', textAlign: 'center' },
  noteInput: {
    marginHorizontal: 16, padding: 14, borderRadius: 14,
    fontSize: 15, borderWidth: 1.5, minHeight: 80,
    textAlignVertical: 'top',
  },
});