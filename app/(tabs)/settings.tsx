import { View, Text, StyleSheet, useColorScheme, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../src/constants/colors';
import { useAuthStore } from '../../src/store/authStore';
import { useTransactionStore } from '../../src/store/transactionStore';
import { formatCurrency } from '../../src/utils/formatters';
import { getBalance } from '../../src/utils/calculations';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const scheme = useColorScheme();
  const C = Colors[scheme ?? 'light'];
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const transactions = useTransactionStore(s => s.transactions);
  const { income, expense, balance } = getBalance(transactions);

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: () => {
          logout();
          router.replace('/login');
        },
      },
    ]);
  };

  const s = styles(C);

  return (
    <ScrollView style={s.container} showsVerticalScrollIndicator={false}>

      {/* Profile Card */}
      <View style={s.profileCard}>
        <View style={s.avatar}>
          <Text style={s.avatarText}>
            {user?.name?.charAt(0).toUpperCase() ?? 'U'}
          </Text>
        </View>
        <Text style={s.userName}>{user?.name ?? 'User'}</Text>
        <Text style={s.userEmail}>{user?.email ?? ''}</Text>
      </View>

      {/* Stats Row */}
      <View style={s.statsRow}>
        <View style={s.statItem}>
          <Text style={[s.statValue, { color: C.income }]}>{formatCurrency(income)}</Text>
          <Text style={s.statLabel}>Total Income</Text>
        </View>
        <View style={[s.statItem, s.statBorder]}>
          <Text style={[s.statValue, { color: C.expense }]}>{formatCurrency(expense)}</Text>
          <Text style={s.statLabel}>Total Spent</Text>
        </View>
        <View style={[s.statItem, s.statBorder]}>
          <Text style={[s.statValue, { color: C.primary }]}>{formatCurrency(balance)}</Text>
          <Text style={s.statLabel}>Net Balance</Text>
        </View>
      </View>

      {/* Account Section */}
      <Text style={s.sectionTitle}>ACCOUNT</Text>
      <View style={s.menuCard}>

        <TouchableOpacity style={s.menuItem} onPress={() => Alert.alert('Edit Profile', 'Coming soon!')}>
          <View style={[s.menuIcon, { backgroundColor: C.primary + '18' }]}>
            <Ionicons name="person-outline" size={18} color={C.primary} />
          </View>
          <Text style={s.menuLabel}>Edit Profile</Text>
          <Ionicons name="chevron-forward" size={16} color={C.subtext} />
        </TouchableOpacity>

        <View style={s.separator} />

        <TouchableOpacity style={s.menuItem} onPress={() => Alert.alert('Notifications', 'Coming soon!')}>
          <View style={[s.menuIcon, { backgroundColor: C.primary + '18' }]}>
            <Ionicons name="notifications-outline" size={18} color={C.primary} />
          </View>
          <Text style={s.menuLabel}>Notifications</Text>
          <Ionicons name="chevron-forward" size={16} color={C.subtext} />
        </TouchableOpacity>

        <View style={s.separator} />

        <TouchableOpacity style={s.menuItem} onPress={() => Alert.alert('Change Password', 'Coming soon!')}>
          <View style={[s.menuIcon, { backgroundColor: C.primary + '18' }]}>
            <Ionicons name="lock-closed-outline" size={18} color={C.primary} />
          </View>
          <Text style={s.menuLabel}>Change Password</Text>
          <Ionicons name="chevron-forward" size={16} color={C.subtext} />
        </TouchableOpacity>

      </View>

      {/* App Section */}
      <Text style={s.sectionTitle}>APP</Text>
      <View style={s.menuCard}>

        {/* Theme Info Row */}
        <View style={s.menuItem}>
          <View style={[s.menuIcon, { backgroundColor: C.primary + '18' }]}>
            <Ionicons name="moon-outline" size={18} color={C.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.menuLabel}>Appearance</Text>
            <Text style={{ fontSize: 11, color: C.subtext, marginTop: 1 }}>
              Currently: {scheme === 'dark' ? '🌙 Dark Mode' : '☀️ Light Mode'}
            </Text>
          </View>
          <View style={[s.themeBadge, { backgroundColor: C.primary + '18' }]}>
            <Text style={{ fontSize: 11, color: C.primary, fontWeight: '600' }}>System</Text>
          </View>
        </View>

        {/* Theme instruction */}
        <View style={[s.themeHint, { backgroundColor: C.primary + '08' }]}>
          <Ionicons name="information-circle-outline" size={14} color={C.subtext} />
          <Text style={[s.themeHintText, { color: C.subtext }]}>
            To switch theme, go to{' '}
            <Text style={{ fontWeight: '700', color: C.text }}>
              Phone Settings → Display → Dark Mode
            </Text>
          </Text>
        </View>

        <View style={s.separator} />

        <TouchableOpacity style={s.menuItem} onPress={() => Alert.alert('Currency', 'Multi-currency coming soon!')}>
          <View style={[s.menuIcon, { backgroundColor: C.primary + '18' }]}>
            <Ionicons name="globe-outline" size={18} color={C.primary} />
          </View>
          <Text style={s.menuLabel}>Currency</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text style={{ color: C.subtext, fontSize: 13 }}>₹ INR</Text>
            <Ionicons name="chevron-forward" size={16} color={C.subtext} />
          </View>
        </TouchableOpacity>

        <View style={s.separator} />

        <TouchableOpacity
          style={s.menuItem}
          onPress={() => Alert.alert('Export Data', 'Data export feature coming soon!')}
        >
          <View style={[s.menuIcon, { backgroundColor: C.primary + '18' }]}>
            <Ionicons name="download-outline" size={18} color={C.primary} />
          </View>
          <Text style={s.menuLabel}>Export Data</Text>
          <Ionicons name="chevron-forward" size={16} color={C.subtext} />
        </TouchableOpacity>

      </View>

      {/* About Section */}
      <Text style={s.sectionTitle}>ABOUT</Text>
      <View style={s.menuCard}>

        <TouchableOpacity style={s.menuItem} onPress={() => Alert.alert('Rate Flo', 'Thanks for your support! ⭐')}>
          <View style={[s.menuIcon, { backgroundColor: '#F2B70518' }]}>
            <Ionicons name="star-outline" size={18} color="#F2B705" />
          </View>
          <Text style={s.menuLabel}>Rate the App</Text>
          <Ionicons name="chevron-forward" size={16} color={C.subtext} />
        </TouchableOpacity>

        <View style={s.separator} />

        <View style={s.menuItem}>
          <View style={[s.menuIcon, { backgroundColor: C.primary + '18' }]}>
            <Ionicons name="code-slash-outline" size={18} color={C.primary} />
          </View>
          <Text style={s.menuLabel}>Version</Text>
          <Text style={{ color: C.subtext, fontSize: 13 }}>1.0.0</Text>
        </View>

      </View>

      {/* Logout */}
      <Text style={s.sectionTitle}>DANGER ZONE</Text>
      <View style={s.menuCard}>
        <TouchableOpacity style={s.menuItem} onPress={handleLogout}>
          <View style={[s.menuIcon, { backgroundColor: '#C4533A18' }]}>
            <Ionicons name="log-out-outline" size={18} color="#C4533A" />
          </View>
          <Text style={[s.menuLabel, { color: '#C4533A' }]}>Sign Out</Text>
          <Ionicons name="chevron-forward" size={16} color="#C4533A" />
        </TouchableOpacity>
      </View>

      <Text style={s.version}>Flo · Your money, simplified 🌿{'\n'}v2.1.0</Text>

    </ScrollView>
  );
}

const styles = (C: typeof Colors.light) => StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background },

  profileCard: {
    alignItems: 'center',
    paddingTop: 64,
    paddingBottom: 28,
    backgroundColor: C.primary,
  },
  avatar: {
    width: 76, height: 76, borderRadius: 38,
    backgroundColor: 'rgba(240,237,229,0.2)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: 'rgba(240,237,229,0.4)',
  },
  avatarText: { fontSize: 30, fontWeight: '800', color: '#F0EDE5' },
  userName: { fontSize: 20, fontWeight: '700', color: '#F0EDE5', marginTop: 10 },
  userEmail: { fontSize: 13, color: 'rgba(240,237,229,0.65)', marginTop: 3 },

  statsRow: {
    flexDirection: 'row',
    backgroundColor: C.card,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000', shadowOpacity: 0.07, shadowRadius: 8,
  },
  statItem: { flex: 1, alignItems: 'center', paddingVertical: 16 },
  statBorder: { borderLeftWidth: 1, borderLeftColor: C.border },
  statValue: { fontSize: 15, fontWeight: '800' },
  statLabel: { fontSize: 11, color: C.subtext, marginTop: 3 },

  sectionTitle: {
    fontSize: 11, fontWeight: '700', color: C.subtext,
    letterSpacing: 1.2,
    marginHorizontal: 16, marginTop: 24, marginBottom: 8,
  },
  menuCard: {
    marginHorizontal: 16,
    backgroundColor: C.card,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 1,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  menuIcon: {
    width: 34, height: 34, borderRadius: 9,
    alignItems: 'center', justifyContent: 'center',
    marginRight: 12,
  },
  menuLabel: { flex: 1, fontSize: 15, color: C.text },
  separator: { height: 1, backgroundColor: C.border, marginLeft: 62 },

  themeBadge: {
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 20,
  },
  themeHint: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 6,
    marginHorizontal: 16, marginBottom: 4,
    padding: 10, borderRadius: 8,
  },
  themeHintText: { fontSize: 12, flex: 1, lineHeight: 17 },

  version: {
    textAlign: 'center', color: C.subtext,
    fontSize: 12, lineHeight: 20,
    paddingVertical: 28,
  },
});