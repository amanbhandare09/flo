import { useState } from 'react';
import {
  ScrollView, View, Text, StyleSheet, useColorScheme,
  TouchableOpacity, Modal, TextInput, Alert
} from 'react-native';
import { Colors } from '../../src/constants/colors';
import { useGoalStore } from '../../src/store/goalStore';
import { useTransactionStore } from '../../src/store/transactionStore';
import { formatCurrency } from '../../src/utils/formatters';
import { getSpendingByCategory, getBalance, getThisMonthTransactions } from '../../src/utils/calculations';
import { getCategoryMeta, CATEGORIES } from '../../src/constants/categories';
import { Category } from '../../src/types';
import AppHeader from '../../src/components/ui/AppHeader';
import { Ionicons } from '@expo/vector-icons';
import { useUserTransactions, useUserGoals } from '../../src/hooks/useCurrentUser';

export default function GoalsScreen() {
  const scheme = useColorScheme();
  const C = Colors[scheme ?? 'light'];
  const { goals, addGoal, deleteGoal } = useUserGoals();
  const { transactions } = useUserTransactions();
  const thisMonth = getThisMonthTransactions(transactions);
  const byCategory = getSpendingByCategory(thisMonth);
  const { income, expense } = getBalance(thisMonth);
  const saved = income - expense;

  const [showModal, setShowModal] = useState(false);
  const [label, setLabel] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'savings'>('savings');

  const getSpent = (category?: string) => {
    if (!category) return Math.max(saved, 0);
    return byCategory.find(b => b.category === category)?.amount ?? 0;
  };

  const handleAddGoal = () => {
    if (!label.trim()) { Alert.alert('Error', 'Please enter a goal name'); return; }
    if (!targetAmount || isNaN(Number(targetAmount)) || Number(targetAmount) <= 0) {
      Alert.alert('Error', 'Please enter a valid target amount'); return;
    }
    addGoal({
      label: label.trim(),
      category: selectedCategory === 'savings' ? undefined : selectedCategory,
      targetAmount: Number(targetAmount),
      currentAmount: 0,
      month: '2026-04',
    });
    setLabel('');
    setTargetAmount('');
    setSelectedCategory('savings');
    setShowModal(false);
  };

  const s = styles(C);

  return (
    <View style={{ flex: 1, backgroundColor: C.background }}>
      <AppHeader rightIcon="add-circle-outline" onRight={() => setShowModal(true)} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Title Row */}
        <View style={s.titleRow}>
          <View>
            <Text style={s.pageTitle}>Budget Shields</Text>
            <Text style={[s.subtitle, { color: C.subtext }]}>Monthly spending limits</Text>
          </View>
          <TouchableOpacity
            style={[s.addBtn, { backgroundColor: C.primary }]}
            onPress={() => setShowModal(true)}
          >
            <Text style={s.addBtnText}>+ Add Goal</Text>
          </TouchableOpacity>
        </View>

        {/* Goals List */}
        {goals.length === 0 ? (
          <View style={s.empty}>
            <Text style={{ fontSize: 56 }}>🛡️</Text>
            <Text style={[s.emptyTitle, { color: C.text }]}>No goals yet</Text>
            <Text style={[s.emptySubtitle, { color: C.subtext }]}>
              Set a budget limit or savings goal{'\n'}to start tracking your money
            </Text>
            <TouchableOpacity
              style={[s.emptyBtn, { backgroundColor: C.primary }]}
              onPress={() => setShowModal(true)}
            >
              <Text style={s.emptyBtnText}>Create Your First Goal</Text>
            </TouchableOpacity>
          </View>
        ) : (
          goals.map(goal => {
            const spent = getSpent(goal.category);
            const pct = Math.min(spent / goal.targetAmount, 1);
            const isOver = spent > goal.targetAmount;
            const isNear = pct > 0.8 && !isOver;
            const isSavings = !goal.category;
            const meta = goal.category ? getCategoryMeta(goal.category) : { icon: '🎯', color: C.primary };
            const barColor = isOver ? C.expense : isNear ? '#F2B705' : C.income;

            return (
              <View key={goal.id} style={[s.shieldCard, { backgroundColor: C.card }]}>
                <View style={s.shieldHeader}>
                  <View style={[s.shieldIconBg, { backgroundColor: meta.color + '20' }]}>
                    <Text style={s.shieldIcon}>{meta.icon}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[s.shieldLabel, { color: C.text }]}>{goal.label}</Text>
                    <View style={[s.statusBadge, { backgroundColor: barColor + '20' }]}>
                      <Text style={[s.statusText, { color: barColor }]}>
                        {isOver ? '⚠️ Over budget' : isNear ? '⚡ Almost at limit' : isSavings ? '✅ Saving well' : '✅ On track'}
                      </Text>
                    </View>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={[s.spentAmount, { color: isOver ? C.expense : C.text }]}>
                      {formatCurrency(spent)}
                    </Text>
                    <Text style={[s.targetAmount, { color: C.subtext }]}>
                      of {formatCurrency(goal.targetAmount)}
                    </Text>
                  </View>
                </View>

                {/* Progress Bar */}
                <View style={[s.progressBg, { backgroundColor: C.border }]}>
                  <View style={[s.progressFill, {
                    width: `${Math.max(pct * 100, 2)}%` as any,
                    backgroundColor: barColor,
                  }]} />
                </View>

                <View style={s.shieldFooter}>
                  <Text style={[s.remaining, { color: C.subtext }]}>
                    {isSavings
                      ? `${formatCurrency(Math.max(goal.targetAmount - spent, 0))} more to reach goal`
                      : isOver
                        ? `${formatCurrency(spent - goal.targetAmount)} over limit`
                        : `${formatCurrency(goal.targetAmount - spent)} remaining`}
                  </Text>
                  <TouchableOpacity onPress={() => Alert.alert(
                    'Delete Goal',
                    `Remove "${goal.label}"?`,
                    [
                      { text: 'Cancel', style: 'cancel' },
                      { text: 'Delete', style: 'destructive', onPress: () => deleteGoal(goal.id) }
                    ]
                  )}>
                    <Ionicons name="trash-outline" size={16} color={C.subtext} />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Add Goal Modal */}
      <Modal visible={showModal} animationType="slide" presentationStyle="pageSheet" transparent={false}>
        <View style={[s.modal, { backgroundColor: C.background }]}>
          {/* Modal Handle */}
          <View style={[s.handle, { backgroundColor: C.border }]} />

          <View style={s.modalHeader}>
            <TouchableOpacity onPress={() => setShowModal(false)}>
              <Text style={{ color: C.subtext, fontSize: 15 }}>Cancel</Text>
            </TouchableOpacity>
            <Text style={[s.modalTitle, { color: C.text }]}>New Goal</Text>
            <TouchableOpacity onPress={handleAddGoal}>
              <Text style={{ color: C.primary, fontWeight: '700', fontSize: 15 }}>Add</Text>
            </TouchableOpacity>
          </View>

          <ScrollView keyboardShouldPersistTaps="handled" style={{ padding: 16 }}>
            {/* Goal Name */}
            <Text style={[s.fieldLabel, { color: C.subtext }]}>GOAL NAME</Text>
            <TextInput
              style={[s.input, { backgroundColor: C.card, color: C.text, borderColor: C.border }]}
              placeholder="e.g. Food Budget, Holiday Savings..."
              placeholderTextColor={C.subtext}
              value={label}
              onChangeText={setLabel}
            />

            {/* Target */}
            <Text style={[s.fieldLabel, { color: C.subtext }]}>TARGET AMOUNT (₹)</Text>
            <TextInput
              style={[s.input, { backgroundColor: C.card, color: C.text, borderColor: C.border }]}
              placeholder="5000"
              placeholderTextColor={C.subtext}
              keyboardType="numeric"
              value={targetAmount}
              onChangeText={setTargetAmount}
            />

            {/* Type */}
            <Text style={[s.fieldLabel, { color: C.subtext }]}>GOAL TYPE</Text>
            <View style={s.typeRow}>
              <TouchableOpacity
                style={[s.typeBtn, { borderColor: C.border, backgroundColor: C.card },
                  selectedCategory === 'savings' && { borderColor: C.primary, backgroundColor: C.primary + '15' }]}
                onPress={() => setSelectedCategory('savings')}
              >
                <Text style={s.typeBtnIcon}>🎯</Text>
                <Text style={[s.typeBtnLabel, { color: selectedCategory === 'savings' ? C.primary : C.text }]}>
                  Savings Goal
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[s.typeBtn, { borderColor: C.border, backgroundColor: C.card },
                  selectedCategory !== 'savings' && { borderColor: C.primary, backgroundColor: C.primary + '15' }]}
                onPress={() => setSelectedCategory('Food')}
              >
                <Text style={s.typeBtnIcon}>🛡️</Text>
                <Text style={[s.typeBtnLabel, { color: selectedCategory !== 'savings' ? C.primary : C.text }]}>
                  Budget Limit
                </Text>
              </TouchableOpacity>
            </View>

            {/* Category picker (only for budget) */}
            {selectedCategory !== 'savings' && (
              <>
                <Text style={[s.fieldLabel, { color: C.subtext }]}>CATEGORY</Text>
                <View style={s.catGrid}>
                  {CATEGORIES.filter(c => !['Salary', 'Freelance', 'Investment'].includes(c.label)).map(cat => (
                    <TouchableOpacity
                      key={cat.label}
                      style={[s.catChip,
                        { borderColor: C.border, backgroundColor: C.card },
                        selectedCategory === cat.label && { borderColor: cat.color, backgroundColor: cat.color + '20' }
                      ]}
                      onPress={() => setSelectedCategory(cat.label as Category)}
                    >
                      <Text style={{ fontSize: 18 }}>{cat.icon}</Text>
                      <Text style={[s.catChipLabel, {
                        color: selectedCategory === cat.label ? cat.color : C.subtext
                      }]}>
                        {cat.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}

            <View style={{ height: 40 }} />
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = (C: typeof Colors.light) => StyleSheet.create({
  titleRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', padding: 16,
  },
  pageTitle: { fontSize: 26, fontWeight: '800', color: C.text },
  subtitle: { fontSize: 13, marginTop: 2 },
  addBtn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20 },
  addBtnText: { color: '#F0EDE5', fontWeight: '700', fontSize: 14 },
  empty: { alignItems: 'center', padding: 40, gap: 12 },
  emptyTitle: { fontSize: 20, fontWeight: '700', marginTop: 8 },
  emptySubtitle: { fontSize: 14, textAlign: 'center', lineHeight: 22 },
  emptyBtn: { paddingHorizontal: 24, paddingVertical: 14, borderRadius: 20, marginTop: 8 },
  emptyBtnText: { color: '#F0EDE5', fontWeight: '700', fontSize: 15 },
  shieldCard: {
    marginHorizontal: 16, marginBottom: 12, padding: 16,
    borderRadius: 16, elevation: 2,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6,
  },
  shieldHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  shieldIconBg: { width: 46, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  shieldIcon: { fontSize: 24 },
  shieldLabel: { fontSize: 15, fontWeight: '700', marginBottom: 4 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, alignSelf: 'flex-start' },
  statusText: { fontSize: 11, fontWeight: '600' },
  spentAmount: { fontSize: 18, fontWeight: '800' },
  targetAmount: { fontSize: 12, marginTop: 2 },
  progressBg: { height: 10, borderRadius: 5, marginBottom: 10 },
  progressFill: { height: 10, borderRadius: 5 },
  shieldFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  remaining: { fontSize: 12 },
  modal: { flex: 1 },
  handle: { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginTop: 12 },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', padding: 16, paddingTop: 12,
    borderBottomWidth: 1, borderBottomColor: C.border,
  },
  modalTitle: { fontSize: 17, fontWeight: '700' },
  fieldLabel: {
    fontSize: 11, fontWeight: '700', letterSpacing: 1,
    marginBottom: 8, marginTop: 20,
  },
  input: {
    padding: 14, borderRadius: 12, fontSize: 16,
    borderWidth: 1.5, marginBottom: 4,
  },
  typeRow: { flexDirection: 'row', gap: 10 },
  typeBtn: {
    flex: 1, padding: 14, borderRadius: 14, borderWidth: 2,
    alignItems: 'center', gap: 6,
  },
  typeBtnIcon: { fontSize: 28 },
  typeBtnLabel: { fontSize: 13, fontWeight: '700', textAlign: 'center' },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  catChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5,
  },
  catChipLabel: { fontSize: 13, fontWeight: '600' },
});