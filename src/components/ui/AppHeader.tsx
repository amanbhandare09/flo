import { View, Text, StyleSheet, useColorScheme, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/colors';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  showBack?: boolean;
  onBack?: () => void;
  rightIcon?: string;
  onRight?: () => void;
}

export default function AppHeader({ showBack, onBack, rightIcon, onRight }: Props) {
  const scheme = useColorScheme();
  const C = Colors[scheme ?? 'light'];
  const s = styles(C);

  return (
    <View style={s.container}>
      <View style={s.left}>
        {showBack ? (
          <TouchableOpacity onPress={onBack} style={s.iconBtn}>
            <Ionicons name="arrow-back" size={22} color={C.text} />
          </TouchableOpacity>
        ) : (
          <View style={s.iconBtn} />
        )}
      </View>

      {/* Logo Center */}
      <View style={s.center}>
        <View style={s.logoContainer}>
          <View style={[s.logoDot, { backgroundColor: C.primary }]} />
          <Text style={[s.logoText, { color: C.primary }]}>flo</Text>
          <Text style={[s.logoSup, { color: C.subtext }]}>finance</Text>
        </View>
      </View>

      <View style={s.right}>
        {rightIcon && onRight ? (
          <TouchableOpacity onPress={onRight} style={s.iconBtn}>
            <Ionicons name={rightIcon as any} size={22} color={C.text} />
          </TouchableOpacity>
        ) : (
          <View style={s.iconBtn} />
        )}
      </View>
    </View>
  );
}

const styles = (C: typeof Colors.light) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 52,
    paddingBottom: 12,
    paddingHorizontal: 16,
    backgroundColor: C.background,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  left: { flex: 1, alignItems: 'flex-start' },
  center: { flex: 2, alignItems: 'center' },
  right: { flex: 1, alignItems: 'flex-end' },
  iconBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  logoContainer: { flexDirection: 'row', alignItems: 'baseline', gap: 2 },
  logoDot: { width: 8, height: 8, borderRadius: 4, marginRight: 2, marginBottom: 2 },
  logoText: { fontSize: 22, fontWeight: '900', letterSpacing: -1 },
  logoSup: { fontSize: 11, fontWeight: '500', letterSpacing: 1 },
});