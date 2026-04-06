import { useState } from 'react';
import {
  View, Text, SectionList, StyleSheet, useColorScheme,
  TextInput, TouchableOpacity, Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../src/constants/colors';
import { useUserTransactions } from '../../src/hooks/useCurrentUser';
import { getCategoryMeta } from '../../src/constants/categories';
import { formatCurrency, formatDate } from '../../src/utils/formatters';
import { groupTransactionsByMonth } from '../../src/utils/calculations';
import { Transaction } from '../../src/types';
import AppHeader from '../../src/components/ui/AppHeader';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

type FilterType = 'all' | 'income' | 'expense';
type SortType = 'newest' | 'oldest' | 'highest' | 'lowest';

export default function TransactionsScreen() {
  const scheme = useColorScheme();
  const C = Colors[scheme ?? 'light'];
  const router = useRouter();
  const { transactions, deleteTransaction } = useUserTransactions();

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [sort, setSort] = useState<SortType>('newest');
  const [showSort, setShowSort] = useState(false);

  // 1. Filter + search
  const filtered = transactions.filter(t => {
    const matchSearch =
      t.category.toLowerCase().includes(search.toLowerCase()) ||
      (t.note ?? '').toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || t.type === filter;
    return matchSearch && matchFilter;
  });

  // 2. Sort
  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'newest') return new Date(b.date).getTime() - new Date(a.date).getTime();
    if (sort === 'oldest') return new Date(a.date).getTime() - new Date(b.date).getTime();
    if (sort === 'highest') return b.amount - a.amount;
    if (sort === 'lowest') return a.amount - b.amount;
    return 0;
  });

  // 3. Group by month (only when not sorting by amount)
  const useGrouping = sort === 'newest' || sort === 'oldest';
  const grouped = useGrouping
    ? groupTransactionsByMonth(sorted).map(([month, data]) => ({
        title: month,
        data,
        total: data.reduce((s, t) => t.type === 'income' ? s + t.amount : s - t.amount, 0),
      }))
    : [{ title: '', data: sorted, total: 0 }];

  const netTotal = filtered.reduce(
    (sum, t) => t.type === 'income' ? sum + t.amount : sum - t.amount, 0
  );

  const handleDelete = (t: Transaction) => {
    Alert.alert(
      'Delete Transaction',
      `Delete ${t.category} — ${formatCurrency(t.amount)}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete', style: 'destructive',
          onPress: () => {
            deleteTransaction(t.id);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          },
        },
      ]
    );
  };

  const handleEdit = (t: Transaction) => {
    router.push({
      pathname: '/edit-transaction',
      params: {
        id: t.id,
        amount: t.amount.toString(),
        type: t.type,
        category: t.category,
        note: t.note ?? '',
      },
    });
  };

  const s = styles(C);

  const renderItem = ({ item }: { item: Transaction }) => {
    const meta = getCategoryMeta(item.category);
    return (
      <View style={s.txCard}>
        <View style={[s.iconBg, { backgroundColor: meta.color + '20' }]}>
          <Text style={s.icon}>{meta.icon}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={s.category}>{item.category}</Text>
          <Text style={s.note} numberOfLines={1}>{item.note || '—'}</Text>
          <Text style={[s.date, { color: C.subtext }]}>{formatDate(item.date)}</Text>
        </View>
        <View style={{ alignItems: 'flex-end', gap: 6 }}>
          <Text style={[s.amount, {
            color: item.type === 'income' ? C.income : C.expense
          }]}>
            {item.type === 'income' ? '+' : '-'}{formatCurrency(item.amount)}
          </Text>
          <View style={s.actionRow}>
            <TouchableOpacity
              style={[s.actionBtn, { backgroundColor: C.primary + '18' }]}
              onPress={() => handleEdit(item)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="pencil-outline" size={13} color={C.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.actionBtn, { backgroundColor: C.expense + '18' }]}
              onPress={() => handleDelete(item)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="trash-outline" size={13} color={C.expense} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const renderSectionHeader = ({ section }: any) => {
    if (!section.title) return null;
    return (
      <View style={s.sectionHeader}>
        <Text style={[s.sectionTitle, { color: C.text }]}>{section.title}</Text>
        <View style={[s.sectionNet, {
          backgroundColor: section.total >= 0 ? C.income + '18' : C.expense + '18'
        }]}>
          <Text style={[s.sectionNetText, {
            color: section.total >= 0 ? C.income : C.expense
          }]}>
            {section.total >= 0 ? '+' : ''}{formatCurrency(section.total)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={s.container}>
      <AppHeader />

      {/* Title + Net */}
      <View style={s.titleRow}>
        <View>
          <Text style={s.pageTitle}>Statement</Text>
          <Text style={[s.txCount, { color: C.subtext }]}>
            {filtered.length} {filtered.length === 1 ? 'entry' : 'entries'}
          </Text>
        </View>
        <View style={[s.netBadge, {
          backgroundColor: netTotal >= 0 ? C.income + '18' : C.expense + '18'
        }]}>
          <Text style={[s.netLabel, { color: C.subtext }]}>Net</Text>
          <Text style={[s.netAmount, { color: netTotal >= 0 ? C.income : C.expense }]}>
            {netTotal >= 0 ? '+' : ''}{formatCurrency(netTotal)}
          </Text>
        </View>
      </View>

      {/* Search */}
      <View style={[s.searchRow, { backgroundColor: C.card, borderColor: C.border }]}>
        <Ionicons name="search-outline" size={18} color={C.subtext} style={{ marginRight: 8 }} />
        <TextInput
          style={[s.searchInput, { color: C.text }]}
          placeholder="Search by category or note..."
          placeholderTextColor={C.subtext}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={18} color={C.subtext} />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter + Sort */}
      <View style={s.controlRow}>
        <View style={s.pills}>
          {(['all', 'income', 'expense'] as FilterType[]).map(f => (
            <TouchableOpacity
              key={f}
              style={[s.pill, { borderColor: C.border, backgroundColor: C.card },
                filter === f && { backgroundColor: C.primary, borderColor: C.primary }]}
              onPress={() => setFilter(f)}
            >
              <Text style={[s.pillText, { color: C.subtext },
                filter === f && { color: '#F0EDE5' }]}>
                {f === 'all' ? 'All' : f === 'income' ? '↑ Income' : '↓ Expense'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity
          style={[s.sortBtn, { backgroundColor: C.card, borderColor: C.border }]}
          onPress={() => setShowSort(!showSort)}
        >
          <Ionicons name="funnel-outline" size={14} color={C.primary} />
          <Text style={[s.sortText, { color: C.primary }]}>Sort</Text>
        </TouchableOpacity>
      </View>

      {/* Sort Dropdown */}
      {showSort && (
        <View style={[s.sortDropdown, { backgroundColor: C.card, borderColor: C.border }]}>
          {([
            { key: 'newest', label: '📅 Newest First' },
            { key: 'oldest', label: '📅 Oldest First' },
            { key: 'highest', label: '💰 Highest Amount' },
            { key: 'lowest', label: '💰 Lowest Amount' },
          ] as { key: SortType; label: string }[]).map(opt => (
            <TouchableOpacity
              key={opt.key}
              style={[s.sortOption, sort === opt.key && { backgroundColor: C.primary + '15' }]}
              onPress={() => { setSort(opt.key); setShowSort(false); }}
            >
              <Text style={[s.sortOptionText, { color: C.text },
                sort === opt.key && { color: C.primary, fontWeight: '700' }]}>
                {opt.label}
              </Text>
              {sort === opt.key && <Ionicons name="checkmark" size={16} color={C.primary} />}
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Grouped List */}
      <SectionList
        sections={grouped}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 120 }}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        stickySectionHeadersEnabled={false}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={s.empty}>
            <Text style={{ fontSize: 52 }}>💸</Text>
            <Text style={[s.emptyTitle, { color: C.text }]}>No transactions found</Text>
            <Text style={[s.emptySub, { color: C.subtext }]}>
              {search
                ? 'Try a different search or filter'
                : 'Tap + to record your first transaction'}
            </Text>
          </View>
        }
      />

      {/* FAB */}
      <TouchableOpacity
        style={[s.fab, { backgroundColor: C.primary }]}
        onPress={() => router.push('/add-transaction')}
      >
        <Ionicons name="add" size={28} color="#F0EDE5" />
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
  netBadge: { padding: 12, borderRadius: 12, alignItems: 'center', minWidth: 80 },
  netLabel: { fontSize: 11, marginBottom: 2 },
  netAmount: { fontSize: 16, fontWeight: '800' },
  searchRow: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: 16, marginBottom: 10,
    paddingHorizontal: 14, paddingVertical: 11,
    borderRadius: 14, borderWidth: 1.5,
  },
  searchInput: { flex: 1, fontSize: 14 },
  controlRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, marginBottom: 8, gap: 8,
  },
  pills: { flexDirection: 'row', gap: 8, flex: 1 },
  pill: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5 },
  pillText: { fontSize: 12, fontWeight: '600' },
  sortBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5,
  },
  sortText: { fontSize: 12, fontWeight: '600' },
  sortDropdown: {
    marginHorizontal: 16, marginBottom: 8,
    borderRadius: 14, borderWidth: 1.5, overflow: 'hidden',
  },
  sortOption: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 13,
    borderBottomWidth: 1, borderBottomColor: C.border,
  },
  sortOptionText: { fontSize: 14 },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingVertical: 12, paddingTop: 20,
  },
  sectionTitle: { fontSize: 15, fontWeight: '800', letterSpacing: 0.3 },
  sectionNet: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  sectionNetText: { fontSize: 13, fontWeight: '700' },
  txCard: {
    flexDirection: 'row', alignItems: 'center', padding: 14,
    borderRadius: 16, backgroundColor: C.card,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  iconBg: {
    width: 46, height: 46, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  icon: { fontSize: 22 },
  category: { fontSize: 14, fontWeight: '700', color: C.text },
  note: { fontSize: 12, color: C.subtext, marginTop: 2 },
  date: { fontSize: 11, marginTop: 3 },
  amount: { fontSize: 15, fontWeight: '800' },
  actionRow: { flexDirection: 'row', gap: 6 },
  actionBtn: {
    width: 28, height: 28, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center',
  },
  empty: { alignItems: 'center', paddingTop: 80, gap: 10 },
  emptyTitle: { fontSize: 18, fontWeight: '700' },
  emptySub: { fontSize: 13, textAlign: 'center' },
  fab: {
    position: 'absolute', bottom: 24, right: 24,
    width: 56, height: 56, borderRadius: 28,
    alignItems: 'center', justifyContent: 'center',
    elevation: 6, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 8,
  },
});