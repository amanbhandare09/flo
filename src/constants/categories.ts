export const CATEGORIES = [
  { label: 'Food',          icon: '🍕', color: '#F97316' },
  { label: 'Transport',     icon: '🚗', color: '#3B82F6' },
  { label: 'Shopping',      icon: '🛍️', color: '#EC4899' },
  { label: 'Entertainment', icon: '🎬', color: '#8B5CF6' },
  { label: 'Health',        icon: '❤️', color: '#EF4444' },
  { label: 'Utilities',     icon: '💡', color: '#EAB308' },
  { label: 'Rent',          icon: '🏠', color: '#06B6D4' },
  { label: 'Salary',        icon: '💰', color: '#22C55E' },
  { label: 'Freelance',     icon: '💻', color: '#10B981' },
  { label: 'Investment',    icon: '📈', color: '#6366F1' },
  { label: 'Other',         icon: '📦', color: '#6B7280' },
];

export const getCategoryMeta = (label: string) =>
  CATEGORIES.find(c => c.label === label) ?? CATEGORIES[10];