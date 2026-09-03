// Типы транзакций
export type TransactionType = 'income' | 'expense';

// Категории доходов и расходов
export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  icon?: string;
  color?: string;
}

// Запись транзакции (доход или расход)
export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  categoryName: string;
  date: string; // Формат YYYY-MM-DD
  note?: string;
}

// Элемент бюджета по категории
export interface Budget {
  id: string;
  categoryId: string;
  categoryName: string;
  limitAmount: number;
  spentAmount: number;
  period: 'monthly' | 'yearly';
}

// Финансовая цель
export interface FinancialGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string; // Формат YYYY-MM-DD
  category?: string;
}

// Сводная статистика
export interface FinancialSummary {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpense: number;
  savingsRate: number; // В процентах
}