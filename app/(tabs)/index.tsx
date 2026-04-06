import { ScrollView, View, Text, StyleSheet, useColorScheme, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../src/constants/colors';
import { useUserTransactions, useUserGoals, useCurrentUser } from '../../src/hooks/useCurrentUser';
import { getBalance, getThisMonthTransactions, getSpendingByCategory } from '../../src/utils/calculations';
import { formatCurrency, formatDate } from '../../src/utils/formatters';
import { getCategoryMeta } from '../../src/constants/categories';
import { getTimeOfDay } from '../../src/utils/helpers';
import AppHeader from '../../src/components/ui/AppHeader';

export default function HomeScreen() {
  const scheme = useColorScheme();
  const C = Colors[scheme ?? 'light'];
  const router = useRouter();
  const { user } = useCurrentUser();
  const { transactions } = useUserTransactions();
  const { goals } = useUserGoals();
  const thisMonth = getThisMonthTransactions(transactions);
  const { income, expense, balance } = getBalance(thisMonth);
  const recent = transactions.slice(0, 5);
  const byCategory = getSpendingByCategory(thisMonth).slice(0, 5);
  const totalExpense = byCategory.reduce((s, i) => s + i.amount, 0);
  const firstName = user?.name?.split(' ')[0] ?? 'there';
  const s = styles(C);

  return (
    <ScrollView style={s.container} showsVerticalScrollIndicator={false}>
      <AppHeader />

      {/* Personalised Greeting */}
      <View style={s.greeting}>
        <Text style={s.greetingText}>
          Good {getTimeOfDay()}, {firstName} 👋
        </Text>
        <Text style={[s.greetingSub, { color: C.subtext }]}>
          Here's your financial snapshot
        </Text>
      </View>

      {/* Balance Card */}
      <View style={s.balanceCard}>
        <Text style={s.balanceLabel}>Total Balance</Text>
        <Text style={s.balanceAmount}>{formatCurrency(balance)}</Text>
        <View style={s.summaryRow}>
          <View style={s.summaryItem}>
            <Text style={s.summarySubLabel}>{'↑ Income'}</Text>
            <Text style={[s.summaryValue, { color: '#A8F0C6' }]}>{formatCurrency(income)}</Text>
          </View>
          <View style={s.divider} />
          <View style={s.summaryItem}>
            <Text style={s.summarySubLabel}>{'↓ Expenses'}</Text>
            <Text style={[s.summaryValue, { color: '#FFB4A2' }]}>{formatCurrency(expense)}</Text>
          </View>
        </View>
      </View>

      {/* Category Bars */}
      {byCategory.length > 0 && (
        <View style={s.card}>
          <Text style={s.cardTitle}>Spending by Category</Text>
          {byCategory.map(item => {
            const meta = getCategoryMeta(item.category);
            const pct = totalExpense > 0 ? item.amount / totalExpense : 0;
            return (
              <View key={item.category} style={s.catRow}>
                <Text style={s.catIcon}>{meta.icon}</Text>
                <View style={{ flex: 1 }}>
                  <View style={s.catHeader}>
                    <Text style={s.catName}>{item.category}</Text>
                    <Text style={[s.catAmount, { color: C.expense }]}>{formatCurrency(item.amount)}</Text>
                  </View>
                  <View style={s.barBg}>
                    <View style={[s.barFill, {
                      width: `${Math.max(pct * 100, 4)}%` as any,
                      backgroundColor: meta.color
                    }]} />
                  </View>
                  <Text style={s.pctText}>{Math.round(pct * 100)}% of expenses</Text>
                </View>
              </View>
            );
          })}
        </View>
      )}

      {/* Budget Shields Quick Access */}
      <TouchableOpacity
        style={[s.goalCard, { backgroundColor: C.card, borderColor: C.border }]}
        onPress={() => router.push('/(tabs)/goals')}
      >
        <View style={[s.goalIconBg, { backgroundColor: C.primary + '18' }]}>
          <Text style={{ fontSize: 22 }}>🛡️</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[s.goalTitle, { color: C.text }]}>Budget Shields</Text>
          <Text style={[s.goalSub, { color: C.subtext }]}>
            {goals.length > 0
              ? `${goals.length} active goal${goals.length > 1 ? 's' : ''} this month`
              : 'Set spending limits per category'}
          </Text>
        </View>
        <Text style={{ color: C.primary, fontWeight: '700', fontSize: 13 }}>{'Manage →'}</Text>
      </TouchableOpacity>

      {/* Daily Tip */}
      <View style={[s.card, { backgroundColor: C.primary }]}>
        <Text style={{ color: 'rgba(240,237,229,0.75)', fontSize: 12, marginBottom: 4 }}>
          {'💡 Daily Tip'}
        </Text>
        <Text style={{ color: '#F0EDE5', fontSize: 14, lineHeight: 22 }}>
          The 50/30/20 rule: Spend 50% on needs, 30% on wants, and save 20% of your income.
        </Text>
      </View>

      {/* Recent Transactions */}
      <View style={s.card}>
        <View style={s.cardHeader}>
          <Text style={s.cardTitle}>Recent Transactions</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/transactions')}>
            <Text style={{ color: C.primary, fontSize: 13 }}>See all</Text>
          </TouchableOpacity>
        </View>
        {recent.length === 0 ? (
          <View style={s.empty}>
            <Text style={{ fontSize: 36 }}>💸</Text>
            <Text style={[{ color: C.subtext, marginTop: 8, fontSize: 14 }]}>
              No transactions yet
            </Text>
          </View>
        ) : recent.map(t => {
          const meta = getCategoryMeta(t.category);
          return (
            <View key={t.id} style={s.txRow}>
              <View style={[s.txIconBg, { backgroundColor: meta.color + '20' }]}>
                <Text style={s.txIcon}>{meta.icon}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.txCategory}>{t.category}</Text>
                <Text style={s.txNote} numberOfLines={1}>{t.note ?? '—'}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={[s.txAmount,
                  { color: t.type === 'income' ? C.income : C.expense }]}>
                  {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                </Text>
                <Text style={s.txDate}>{formatDate(t.date)}</Text>
              </View>
            </View>
          );
        })}
      </View>

      <View style={{ height: 100 }} />

      <TouchableOpacity
        style={[s.fab, { backgroundColor: C.primary }]}
        onPress={() => router.push('/add-transaction')}
      >
        <Text style={{ color: '#F0EDE5', fontSize: 28, lineHeight: 32 }}>+</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = (C: typeof Colors.light) => StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background },
  greeting: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },
  greetingText: { fontSize: 22, fontWeight: '800', color: C.text },
  greetingSub: { fontSize: 13, marginTop: 3 },
  balanceCard: { margin: 16, padding: 24, borderRadius: 24, backgroundColor: C.primary },
  balanceLabel: { color: 'rgba(240,237,229,0.75)', fontSize: 14 },
  balanceAmount: { color: '#F0EDE5', fontSize: 38, fontWeight: '800', marginVertical: 8 },
  summaryRow: { flexDirection: 'row', marginTop: 8 },
  summaryItem: { flex: 1, alignItems: 'center' },
  summarySubLabel: { color: 'rgba(240,237,229,0.7)', fontSize: 12 },
  summaryValue: { fontSize: 16, fontWeight: '700', marginTop: 4 },
  divider: { width: 1, backgroundColor: 'rgba(240,237,229,0.3)' },
  card: {
    margin: 16, marginTop: 0, padding: 16,
    backgroundColor: C.card, borderRadius: 16,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
    marginBottom: 12,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 16, fontWeight: '700', color: C.text, marginBottom: 12 },
  catRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  catIcon: { fontSize: 22, marginRight: 10, width: 30 },
  catHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  catName: { fontSize: 13, fontWeight: '600', color: C.text },
  catAmount: { fontSize: 13, fontWeight: '700' },
  barBg: { height: 7, backgroundColor: C.border, borderRadius: 4 },
  barFill: { height: 7, borderRadius: 4 },
  pctText: { fontSize: 10, color: C.subtext, marginTop: 3 },
  goalCard: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: 16, marginBottom: 12,
    padding: 14, borderRadius: 16, borderWidth: 1.5, gap: 12,
  },
  goalIconBg: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  goalTitle: { fontSize: 15, fontWeight: '700' },
  goalSub: { fontSize: 12, marginTop: 2 },
  txRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: C.border,
  },
  txIconBg: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  txIcon: { fontSize: 20 },
  txCategory: { fontSize: 14, fontWeight: '600', color: C.text },
  txNote: { fontSize: 12, color: C.subtext },
  txAmount: { fontSize: 14, fontWeight: '700' },
  txDate: { fontSize: 11, color: C.subtext },
  empty: { alignItems: 'center', padding: 24 },
  fab: {
    position: 'absolute', bottom: 24, right: 24,
    width: 56, height: 56, borderRadius: 28,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 8, elevation: 6,
  },
});