import { format } from 'date-fns';

export const formatCurrency = (amount: number): string =>
  `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 0 })}`;

export const formatDate = (iso: string): string =>
  format(new Date(iso), 'dd MMM yyyy');

export const formatDay = (iso: string): string => {
  const date = new Date(iso);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return format(date, 'dd MMM');
};