import { useState } from 'react';
import {
  View, Text, FlatList, StyleSheet, useColorScheme,
  TextInput, TouchableOpacity
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../src/constants/colors';
import { useTransactionStore } from '../../src/store/transactionStore';
import { getCategoryMeta } from '../../src/constants/categories';
import { formatCurrency, formatDay } from '../../src/utils/formatters';
import { Transaction } from '../../src/types';
import AppHeader from '../../src/components/ui/AppHeader';

export default function TransactionsScreen() {
  const scheme = useColorScheme();
  const C = Colors[scheme ?? 'light'];
  const router = useRouter();
  const { transactions, deleteTransaction } = useTransactionStore();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');

  const filtered = transactions.filter(t => {
    const matchSearch =
      t.category.toLowerCase().includes(search.toLowerCase()) ||
      (t.note ?? '').toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || t.type === filter;
    return matchSearch && matchFilter;
  });

  const totalFiltered = filtered.reduce((sum, t) =>
    t.type === 'income' ? sum + t.amount : sum - t.amount, 0
  );

  const s = styles(C);

  const renderItem = ({ item }: { item: Transaction }) => {
    const meta = getCategoryMeta(item.category);
    return (
      <View style={s.txRow}>
        <View style={[s.iconBg, { backgroundColor: meta.color + '20' }]}>
          <Text style={s.icon}>{meta.icon}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={s.category}>{item.category}</Text>
          <Text style={s.note} numberOfLines={1}>
            {item.note ? item.note : '—'}{' · '}{formatDay(item.date)}
          </Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={[s.amount, { color: item.type === 'income' ? C.income : C.expense }]}>
            {item.type === 'income' ? '+' : '-'}{formatCurrency(item.amount)}
          </Text>
          <TouchableOpacity onPress={() => deleteTransaction(item.id)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={{ color: C.expense, fontSize: 11, marginTop: 4 }}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={s.container}>
      <AppHeader />

      {/* Page Title + Summary */}
      <View style={s.titleRow}>
        <View>
          <Text style={s.pageTitle}>Statement</Text>
          <Text style={[s.txCount, { color: C.subtext }]}>
            {filtered.length} {filtered.length === 1 ? 'entry' : 'entries'}
          </Text>
        </View>
        <View style={[s.netBadge, {
          backgroundColor: totalFiltered >= 0 ? C.income + '18' : C.expense + '18'
        }]}>
          <Text style={{ fontSize: 11, color: C.subtext, marginBottom: 2 }}>Net</Text>
          <Text style={[s.netAmount, {
            color: totalFiltered >= 0 ? C.income : C.expense
          }]}>
            {totalFiltered >= 0 ? '+' : ''}{formatCurrency(totalFiltered)}
          </Text>
        </View>
      </View>

      {/* Search */}
      <View style={[s.searchRow, { backgroundColor: C.card, borderColor: C.border }]}>
        <Text style={{ fontSize: 16, marginRight: 8 }}>🔍</Text>
        <TextInput
          style={[s.searchInput, { color: C.text }]}
          placeholder="Search by category or note..."
          placeholderTextColor={C.subtext}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Text style={{ color: C.subtext, fontSize: 18, marginLeft: 4 }}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Pills */}
      <View style={s.pills}>
        {(['all', 'income', 'expense'] as const).map(f => (
          <TouchableOpacity
            key={f}
            style={[
              s.pill,
              { borderColor: C.border, backgroundColor: C.card },
              filter === f && { backgroundColor: C.primary, borderColor: C.primary }
            ]}
            onPress={() => setFilter(f)}
          >
            <Text style={[
              s.pillText,
              { color: C.subtext },
              filter === f && { color: '#F0EDE5' }
            ]}>
              {f === 'all' ? 'All' : f === 'income' ? '↑ Income' : '↓ Expense'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={t => t.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        ListEmptyComponent={
          <View style={s.empty}>
            <Text style={{ fontSize: 48 }}>💸</Text>
            <Text style={[s.emptyTitle, { color: C.text }]}>No transactions found</Text>
            <Text style={{ color: C.subtext, fontSize: 13, marginTop: 4 }}>
              {search ? 'Try a different search term' : 'Tap + to add your first one'}
            </Text>
          </View>
        }
      />

      {/* FAB */}
      <TouchableOpacity
        style={[s.fab, { backgroundColor: C.primary }]}
        onPress={() => router.push('/add-transaction')}
      >
        <Text style={{ color: '#F0EDE5', fontSize: 26, lineHeight: 30 }}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = (C: typeof Colors.light) => StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background },
  titleRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8,
  },
  pageTitle: { fontSize: 26, fontWeight: '800', color: C.text },
  txCount: { fontSize: 13, marginTop: 2 },
  netBadge: { padding: 10, borderRadius: 12, alignItems: 'center' },
  netAmount: { fontSize: 16, fontWeight: '800' },
  searchRow: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: 16, marginBottom: 10,
    paddingHorizontal: 14, paddingVertical: 10,
    borderRadius: 14, borderWidth: 1.5,
  },
  searchInput: { flex: 1, fontSize: 14 },
  pills: { flexDirection: 'row', paddingHorizontal: 16, gap: 8, marginBottom: 12 },
  pill: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5,
  },
  pillText: { fontSize: 13, fontWeight: '600' },
  txRow: {
    flexDirection: 'row', alignItems: 'center', padding: 14,
    borderRadius: 14, backgroundColor: C.card,
  },
  iconBg: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  icon: { fontSize: 22 },
  category: { fontSize: 14, fontWeight: '700', color: C.text },
  note: { fontSize: 12, color: C.subtext, marginTop: 2 },
  amount: { fontSize: 15, fontWeight: '800' },
  empty: { alignItems: 'center', marginTop: 80, gap: 8 },
  emptyTitle: { fontSize: 17, fontWeight: '700' },
  fab: {
    position: 'absolute', bottom: 24, right: 24,
    width: 56, height: 56, borderRadius: 28,
    alignItems: 'center', justifyContent: 'center', elevation: 6,
    shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 8,
  },
});