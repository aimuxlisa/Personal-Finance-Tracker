import { Transaction, Category, Budget, FinancialGoal, FinancialSummary } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Заработная плата', type: 'income', color: '#10B981' },
  { id: 'cat-2', name: 'Фриланс / Проекты', type: 'income', color: '#3B82F6' },
  { id: 'cat-3', name: 'Продукты и супермаркеты', type: 'expense', color: '#EF4444' },
  { id: 'cat-4', name: 'Кафе и рестораны', type: 'expense', color: '#F59E0B' },
  { id: 'cat-5', name: 'Транспорт и авто', type: 'expense', color: '#6366F1' },
  { id: 'cat-6', name: 'Развлечения', type: 'expense', color: '#EC4899' },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    title: 'Заработная плата за Август',
    amount: 12000000,
    type: 'income',
    categoryId: 'cat-1',
    categoryName: 'Заработная плата',
    date: '2026-08-20',
  },
  {
    id: 'tx-2',
    title: 'Покупка продуктов в Корзинке',
    amount: 450000,
    type: 'expense',
    categoryId: 'cat-3',
    categoryName: 'Продукты и супермаркеты',
    date: '2026-08-22',
  },
  {
    id: 'tx-3',
    title: 'Ужин с друзьями',
    amount: 320000,
    type: 'expense',
    categoryId: 'cat-4',
    categoryName: 'Кафе и рестораны',
    date: '2026-08-23',
  },
];

export const INITIAL_BUDGETS: Budget[] = [
  {
    id: 'b-1',
    categoryId: 'cat-3',
    categoryName: 'Продукты и супермаркеты',
    limitAmount: 3000000,
    spentAmount: 450000,
    period: 'monthly',
  },
  {
    id: 'b-2',
    categoryId: 'cat-4',
    categoryName: 'Кафе и рестораны',
    limitAmount: 1500000,
    spentAmount: 320000,
    period: 'monthly',
  },
];

export const INITIAL_GOALS: FinancialGoal[] = [
  {
    id: 'g-1',
    title: 'Отпуск на море',
    targetAmount: 10000000,
    currentAmount: 6500000,
    deadline: '2026-10-15',
  },
  {
    id: 'g-2',
    title: 'Новый ноутбук',
    targetAmount: 15000000,
    currentAmount: 4000000,
    deadline: '2026-12-31',
  },
];