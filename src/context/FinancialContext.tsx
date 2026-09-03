import React, { createContext, useContext, useState, useEffect } from 'react';

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  categoryName: string;
  date: string;
}

export interface Budget {
  id: string;
  categoryName: string;
  spentAmount: number;
  limitAmount: number;
}

export interface Goal {
  id: string;
  title: string;
  currentAmount: number;
  targetAmount: number;
  deadline: string;
}

interface FinancialContextType {
  transactions: Transaction[];
  budgets: Budget[];
  goals: Goal[];
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, updatedTx: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  addBudget: (budget: Omit<Budget, 'id' | 'spentAmount'>) => void;
  addGoal: (goal: Omit<Goal, 'id'>) => void;
  updateGoalAmount: (id: string, newAmount: number) => void;
  summary: {
    totalBalance: number;
    monthlyIncome: number;
    monthlyExpense: number;
    savingsRate: number;
  };
}

const FinancialContext = createContext<FinancialContextType | undefined>(undefined);

const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    title: 'Зарплата (Август)',
    amount: 12000000,
    type: 'income',
    categoryName: 'Работа',
    date: '2026-08-01',
  },
  {
    id: '2',
    title: 'Супермаркет Korzinka',
    amount: 450000,
    type: 'expense',
    categoryName: 'Продукты',
    date: '2026-08-15',
  },
  {
    id: '3',
    title: 'Оплата интернета',
    amount: 180000,
    type: 'expense',
    categoryName: 'Коммунальные',
    date: '2026-08-20',
  },
];

const INITIAL_BUDGETS: Budget[] = [
  { id: 'b1', categoryName: 'Продукты', spentAmount: 450000, limitAmount: 3000000 },
  { id: 'b2', categoryName: 'Развлечения', spentAmount: 250000, limitAmount: 1500000 },
];

const INITIAL_GOALS: Goal[] = [
  {
    id: 'g1',
    title: 'Новый ноутбук',
    currentAmount: 4000000,
    targetAmount: 12000000,
    deadline: '2026-12-31',
  },
];

export const FinancialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('ft_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [budgets, setBudgets] = useState<Budget[]>(() => {
    const saved = localStorage.getItem('ft_budgets');
    return saved ? JSON.parse(saved) : INITIAL_BUDGETS;
  });

  const [goals, setGoals] = useState<Goal[]>(() => {
    const saved = localStorage.getItem('ft_goals');
    return saved ? JSON.parse(saved) : INITIAL_GOALS;
  });

  useEffect(() => {
    localStorage.setItem('ft_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('ft_budgets', JSON.stringify(budgets));
  }, [budgets]);

  useEffect(() => {
    localStorage.setItem('ft_goals', JSON.stringify(goals));
  }, [goals]);

  const addTransaction = (tx: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = {
      ...tx,
      id: Date.now().toString(),
    };
    setTransactions((prev) => [newTx, ...prev]);

    if (tx.type === 'expense') {
      setBudgets((prev) =>
        prev.map((b) =>
          b.categoryName.toLowerCase() === tx.categoryName.toLowerCase()
            ? { ...b, spentAmount: b.spentAmount + tx.amount }
            : b
        )
      );
    }
  };

  const updateTransaction = (id: string, updatedTx: Omit<Transaction, 'id'>) => {
    setTransactions((prev) =>
      prev.map((tx) => (tx.id === id ? { ...updatedTx, id } : tx))
    );
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((tx) => tx.id !== id));
  };

  const addBudget = (budget: Omit<Budget, 'id' | 'spentAmount'>) => {
    const newBudget: Budget = {
      ...budget,
      id: Date.now().toString(),
      spentAmount: 0,
    };
    setBudgets((prev) => [...prev, newBudget]);
  };

  const addGoal = (goal: Omit<Goal, 'id'>) => {
    const newGoal: Goal = {
      ...goal,
      id: Date.now().toString(),
    };
    setGoals((prev) => [...prev, newGoal]);
  };

  const updateGoalAmount = (id: string, newAmount: number) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, currentAmount: newAmount } : g))
    );
  };

  const monthlyIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalBalance = monthlyIncome - monthlyExpense;
  const savingsRate =
    monthlyIncome > 0
      ? Math.round(((monthlyIncome - monthlyExpense) / monthlyIncome) * 100)
      : 0;

  return (
    <FinancialContext.Provider
      value={{
        transactions,
        budgets,
        goals,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addBudget,
        addGoal,
        updateGoalAmount,
        summary: {
          totalBalance,
          monthlyIncome,
          monthlyExpense,
          savingsRate,
        },
      }}
    >
      {children}
    </FinancialContext.Provider>
  );
};

export const useFinancial = () => {
  const context = useContext(FinancialContext);
  if (!context) {
    throw new Error('useFinancial must be used within FinancialProvider');
  }
  return context;
};