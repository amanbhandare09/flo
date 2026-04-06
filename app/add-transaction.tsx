import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../src/constants/colors';
import { useUserTransactions } from '../src/hooks/useCurrentUser';
import { CATEGORIES } from '../src/constants/categories';
import { Category, TransactionType } from '../src/types';
import * as Haptics from 'expo-haptics';

export default function AddTransactionScreen() {
  const scheme = useColorScheme();
  const C = Colors[scheme ?? 'light'];
  const router = useRouter();
  const { addTransaction } = useUserTransactions();

  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [category, setCategory] = useState<Category>('Food');
  const [note, setNote] = useState('');

  const handleSave = () => {
    const parsed = Number(amount);
    if (!amount.trim() || isNaN(parsed) || parsed <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount greater than 0');
      return;
    }
    addTransaction({
      amount: parsed,
      type,
      category,
      date: new Date().toISOString(),
      note: note.trim(),
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.back();
  };

  const s = styles(C);

  return (
    <View style={s.container}>
      {/* Modal handle bar */}
      <View style={s.handleBar} />

      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity
          style={s.cancelBtn}
          onPress={() =>
            router.canGoBack() ? router.back() : router.replace('/(tabs)')
          }
        >
          <Text style={[s.cancelText, { color: C.subtext }]}>Cancel</Text>
        </TouchableOpacity>

        <Text style={[s.title, { color: C.text }]}>New Transaction</Text>

        <TouchableOpacity
          style={[s.saveBtn, { backgroundColor: C.primary }]}
          onPress={handleSave}
        >
          <Text style={s.saveText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 60 }}
      >
        {/* Income / Expense Toggle */}
        <View style={s.typeRow}>
          <TouchableOpacity
            style={[
              s.typeBtn,
              { borderColor: C.border, backgroundColor: C.card },
              type === 'expense' && {
                backgroundColor: C.expense,
                borderColor: C.expense,
              },
            ]}
            onPress={() => setType('expense')}
          >
            <Text
              style={[
                s.typeBtnText,
                { color: C.text },
                type === 'expense' && { color: '#fff' },
              ]}
            >
              {'↓ Expense'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              s.typeBtn,
              { borderColor: C.border, backgroundColor: C.card },
              type === 'income' && {
                backgroundColor: C.income,
                borderColor: C.income,
              },
            ]}
            onPress={() => setType('income')}
          >
            <Text
              style={[
                s.typeBtnText,
                { color: C.text },
                type === 'income' && { color: '#fff' },
              ]}
            >
              {'↑ Income'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Amount Input */}
        <View
          style={[
            s.amountCard,
            {
              backgroundColor: C.card,
              borderColor: type === 'income' ? C.income : C.expense,
            },
          ]}
        >
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

        {/* Category Label */}
        <Text style={[s.sectionLabel, { color: C.subtext }]}>
          {'CATEGORY'}
        </Text>

        {/* Category Grid */}
        <View style={s.categoryGrid}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat.label}
              style={[
                s.catItem,
                { borderColor: C.border, backgroundColor: C.card },
                category === cat.label && {
                  backgroundColor: cat.color + '22',
                  borderColor: cat.color,
                  borderWidth: 2,
                },
              ]}
              onPress={() => setCategory(cat.label as Category)}
            >
              <Text style={s.catIcon}>{cat.icon}</Text>
              <Text
                style={[
                  s.catLabel,
                  {
                    color:
                      category === cat.label ? cat.color : C.subtext,
                  },
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Note Label */}
        <Text style={[s.sectionLabel, { color: C.subtext }]}>
          {'NOTE'}
        </Text>

        {/* Note Input */}
        <TextInput
          style={[
            s.noteInput,
            {
              backgroundColor: C.card,
              color: C.text,
              borderColor: C.border,
            },
          ]}
          value={note}
          onChangeText={setNote}
          placeholder="Add a note (optional)"
          placeholderTextColor={C.subtext}
          multiline
        />
      </ScrollView>
    </View>
  );
}

const styles = (C: typeof Colors.light) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: C.background,
      paddingTop: Platform.OS === 'ios' ? 12 : 0,
    },
    handleBar: {
      width: 40,
      height: 4,
      borderRadius: 2,
      backgroundColor: C.border,
      alignSelf: 'center',
      marginTop: 12,
      marginBottom: 4,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: C.border,
    },
    cancelBtn: { padding: 4, minWidth: 60 },
    cancelText: { fontSize: 15 },
    title: { fontSize: 17, fontWeight: '700' },
    saveBtn: {
      paddingHorizontal: 18,
      paddingVertical: 9,
      borderRadius: 20,
      minWidth: 60,
      alignItems: 'center',
    },
    saveText: { color: '#F0EDE5', fontWeight: '700', fontSize: 14 },
    typeRow: { flexDirection: 'row', margin: 16, gap: 12 },
    typeBtn: {
      flex: 1,
      paddingVertical: 14,
      borderRadius: 14,
      alignItems: 'center',
      borderWidth: 1.5,
    },
    typeBtnText: { fontSize: 15, fontWeight: '700' },
    amountCard: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 16,
      marginBottom: 24,
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderRadius: 16,
      borderWidth: 2,
    },
    currencySymbol: {
      fontSize: 32,
      marginRight: 8,
      fontWeight: '300',
    },
    amountInput: { flex: 1, fontSize: 44, fontWeight: '800' },
    sectionLabel: {
      fontSize: 11,
      fontWeight: '700',
      letterSpacing: 1.2,
      marginHorizontal: 16,
      marginBottom: 10,
    },
    categoryGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingHorizontal: 12,
      marginBottom: 24,
    },
    catItem: {
      width: '30%',
      margin: '1.5%',
      paddingVertical: 12,
      borderRadius: 14,
      alignItems: 'center',
      borderWidth: 1.5,
    },
    catIcon: { fontSize: 26, marginBottom: 4 },
    catLabel: { fontSize: 11, fontWeight: '600', textAlign: 'center' },
    noteInput: {
      marginHorizontal: 16,
      padding: 14,
      borderRadius: 14,
      fontSize: 15,
      borderWidth: 1.5,
      minHeight: 80,
      textAlignVertical: 'top',
    },
  });