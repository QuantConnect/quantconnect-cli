import { formatDistanceToNow } from 'date-fns';

export function formatLanguage(language: QCLanguage): string {
  switch (language) {
    case 'Py':
      return 'Python';
    case 'Ja':
      return 'Java';
    case 'VB':
      return 'Visual Basic';
    default:
      return language;
  }
}

export function formatDate(date: Date): string {
  return formatDistanceToNow(date, { addSuffix: true });
}

export function formatNumber(num: number, fractionDigits: number = 0): string {
  return num.toFixed(fractionDigits).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
