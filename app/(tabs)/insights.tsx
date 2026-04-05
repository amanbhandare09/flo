import { ScrollView, View, Text, StyleSheet, useColorScheme } from 'react-native';
import { Colors } from '../../src/constants/colors';
import { useTransactionStore } from '../../src/store/transactionStore';
import { getSpendingByCategory, getWeeklyTotals, getThisMonthTransactions } from '../../src/utils/calculations';
import { formatCurrency } from '../../src/utils/formatters';
import { getCategoryMeta } from '../../src/constants/categories';

export default function InsightsScreen() {
  const scheme = useColorScheme();
  const C = Colors[scheme ?? 'light'];
  const transactions = useTransactionStore(s => s.transactions);
  const thisMonth = getThisMonthTransactions(transactions);
  const byCategory = getSpendingByCategory(thisMonth);
  const { thisWeek, lastWeek } = getWeeklyTotals(transactions);
  const totalExpense = byCategory.reduce((s, i) => s + i.amount, 0);
  const top = byCategory[0];
  const weekChange = lastWeek === 0 ? 0 : ((thisWeek - lastWeek) / lastWeek * 100);
  const maxWeek = Math.max(thisWeek, lastWeek, 1);

  const s = styles(C);

  return (
    <ScrollView style={s.container} showsVerticalScrollIndicator={false}>
      <View style={s.header}>
        <Text style={s.title}>Insights</Text>
        <Text style={s.subtitle}>Understanding your spending patterns</Text>
      </View>

      {/* Smart Insight */}
      {top && (
        <View style={[s.card, { backgroundColor: C.primary + '12', borderColor: C.primary + '40', borderWidth: 1 }]}>
          <Text style={s.insightEmoji}>💡</Text>
          <Text style={[s.insightText, { color: C.text }]}>
            <Text style={{ fontWeight: '700' }}>{top.category}</Text> is your biggest spend — {' '}
            <Text style={{ fontWeight: '700' }}>{formatCurrency(top.amount)}</Text>
            {totalExpense > 0 ? ` (${Math.round(top.amount / totalExpense * 100)}% of expenses)` : ''}
          </Text>
        </View>
      )}

      {/* Week vs Week — Custom Bar Chart */}
      <View style={s.card}>
        <Text style={s.cardTitle}>This Week vs Last Week</Text>
        <View style={s.weekBars}>
          <View style={s.weekBarGroup}>
            <View style={s.barContainer}>
              <View style={[s.weekBar, {
                height: Math.max((lastWeek / maxWeek) * 140, 8),
                backgroundColor: C.subtext + '60',
              }]} />
            </View>
            <Text style={[s.weekLabel, { color: C.subtext }]}>Last Week</Text>
            <Text style={[s.weekValue, { color: C.subtext }]}>{formatCurrency(lastWeek)}</Text>
          </View>

          <View style={s.weekBarGroup}>
            <View style={s.barContainer}>
              <View style={[s.weekBar, {
                height: Math.max((thisWeek / maxWeek) * 140, 8),
                backgroundColor: weekChange > 10 ? C.expense : C.primary,
              }]} />
            </View>
            <Text style={[s.weekLabel, { color: C.text }]}>This Week</Text>
            <Text style={[s.weekValue, { color: weekChange > 0 ? C.expense : C.income }]}>
              {formatCurrency(thisWeek)}
            </Text>
          </View>
        </View>

        <View style={s.weekChangeRow}>
          <Text style={{ color: C.subtext, fontSize: 13 }}>
            {weekChange === 0
              ? 'Same as last week'
              : weekChange > 0
                ? `▲ ${weekChange.toFixed(0)}% more than last week`
                : `▼ ${Math.abs(weekChange).toFixed(0)}% less than last week`}
          </Text>
        </View>
      </View>

      {/* Category Breakdown */}
      <View style={s.card}>
        <Text style={s.cardTitle}>Spending by Category</Text>
        {byCategory.length === 0 ? (
          <Text style={{ color: C.subtext, textAlign: 'center', padding: 20 }}>
            No expenses recorded yet
          </Text>
        ) : byCategory.map(item => {
          const meta = getCategoryMeta(item.category);
          const pct = totalExpense > 0 ? item.amount / totalExpense : 0;
          return (
            <View key={item.category} style={s.catRow}>
              <Text style={s.catIcon}>{meta.icon}</Text>
              <View style={{ flex: 1 }}>
                <View style={s.catHeader}>
                  <Text style={s.catName}>{item.category}</Text>
                  <Text style={[s.catAmt, { color: C.expense }]}>{formatCurrency(item.amount)}</Text>
                </View>
                <View style={s.barBg}>
                  <View style={[s.barFill, {
                    width: `${Math.max(pct * 100, 3)}%` as any,
                    backgroundColor: meta.color,
                  }]} />
                </View>
                <Text style={{ fontSize: 10, color: C.subtext, marginTop: 2 }}>
                  {Math.round(pct * 100)}%
                </Text>
              </View>
            </View>
          );
        })}
      </View>

      {/* Summary Stats */}
      <View style={s.card}>
        <Text style={s.cardTitle}>Monthly Summary</Text>
        <View style={s.statsGrid}>
          {[
            { label: 'Total Transactions', value: thisMonth.length.toString(), icon: '📊' },
            { label: 'Avg per Transaction',
              value: formatCurrency(thisMonth.filter(t => t.type === 'expense').length > 0
                ? totalExpense / thisMonth.filter(t => t.type === 'expense').length : 0),
              icon: '📉' },
            { label: 'Largest Expense',
              value: formatCurrency(Math.max(...thisMonth.filter(t => t.type === 'expense').map(t => t.amount), 0)),
              icon: '💸' },
            { label: 'Categories Used',
              value: byCategory.length.toString(),
              icon: '🏷️' },
          ].map(stat => (
            <View key={stat.label} style={[s.statBox, { backgroundColor: C.background }]}>
              <Text style={{ fontSize: 24 }}>{stat.icon}</Text>
              <Text style={[s.statValue, { color: C.primary }]}>{stat.value}</Text>
              <Text style={s.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = (C: typeof Colors.light) => StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background },
  header: { padding: 20, paddingTop: 60 },
  title: { fontSize: 28, fontWeight: '800', color: C.text },
  subtitle: { color: C.subtext, fontSize: 14, marginTop: 4 },
  card: {
    margin: 16, marginTop: 0, padding: 16,
    backgroundColor: C.card, borderRadius: 16, elevation: 2,
    marginBottom: 12,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6,
  },
  cardTitle: { fontSize: 16, fontWeight: '700', color: C.text, marginBottom: 16 },
  insightEmoji: { fontSize: 20, marginBottom: 8 },
  insightText: { fontSize: 14, lineHeight: 22 },
  weekBars: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 12 },
  weekBarGroup: { alignItems: 'center', flex: 1 },
  barContainer: { height: 150, justifyContent: 'flex-end', marginBottom: 8 },
  weekBar: { width: 60, borderRadius: 10 },
  weekLabel: { fontSize: 13, fontWeight: '600', marginTop: 4 },
  weekValue: { fontSize: 15, fontWeight: '800', marginTop: 4 },
  weekChangeRow: { alignItems: 'center', paddingTop: 8, borderTopWidth: 1, borderTopColor: '#00000010' },
  catRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  catIcon: { fontSize: 22, marginRight: 10, width: 30 },
  catHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  catName: { fontSize: 13, fontWeight: '600', color: C.text },
  catAmt: { fontSize: 13, fontWeight: '700' },
  barBg: { height: 7, backgroundColor: C.border, borderRadius: 4 },
  barFill: { height: 7, borderRadius: 4 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  statBox: { width: '47%', padding: 14, borderRadius: 12, alignItems: 'center', gap: 4 },
  statValue: { fontSize: 18, fontWeight: '800' },
  statLabel: { fontSize: 11, color: '#888', textAlign: 'center' },
});