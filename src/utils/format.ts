import { formatDistanceToNow } from 'date-fns';
import { brokerages } from '../brokerages';

export function formatString(thing: any): string {
  if (thing === null) {
    return 'null';
  }

  if (thing === undefined) {
    return 'undefined';
  }

  return thing.toString().trim();
}

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

export function formatLiveAlgorithmStatus(status: QCLiveAlgorithmStatus): string {
  switch (status) {
    case 'DeployError':
      return 'Deploy Error';
    case 'InQueue':
      return 'In Queue';
    case 'RuntimeError':
      return 'Runtime Error';
    case 'LoggingIn':
      return 'Logging In';
    default:
      return status;
  }
}

export function formatProjectName(name: string): string {
  return name.replace(/^\/+/g, '');
}

export function formatBrokerage(id: string): string {
  return brokerages.find(brokerage => brokerage.id === id).name;
}

export function formatDate(date: Date): string {
  return formatDistanceToNow(date, { addSuffix: true });
}

export function formatNumber(num: number, fractionDigits: number = 0): string {
  return num.toFixed(fractionDigits).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function pluralize(amount: number, single: string, multiple: string = single + 's'): string {
  return amount === 1 ? single : multiple;
}

export function formatAmount(amount: number, single: string, multiple?: string): string {
  return `${formatNumber(amount)} ${pluralize(amount, single, multiple)}`;
}

export function toUnixTimestamp(date: Date): number {
  return Math.floor(date.getTime() / 1000);
}
