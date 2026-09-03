import React, { useState } from 'react';
import { FinancialProvider, useFinancial, Transaction } from './context/FinancialContext';
import { ToastProvider } from './components/ui/Toast';
import { ThemeProvider } from './context/ThemeContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthModal } from './components/auth/AuthModal';
import { useRecurringPayments } from './hooks/useRecurringPayments';

import { Navbar } from './components/layout/Navbar';
import { EntityCard } from './components/common/EntityCard';
import { AddTransactionModal } from './components/modals/AddTransactionModal';
import { EditTransactionModal } from './components/modals/EditTransactionModal';
import { BudgetsView } from './components/views/BudgetsView';
import { GoalsView } from './components/views/GoalsView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { SettingsView } from './components/views/SettingsView';
import { RecurringManager } from './components/RecurringManager';

import { Trash2, Edit2, Search } from 'lucide-react';

function DashboardView() {
  const { summary, transactions, budgets, goals, deleteTransaction, addTransaction } = useFinancial();
  const { payments, addPayment, deletePayment, togglePayment } = useRecurringPayments(addTransaction);

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      tx.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.categoryName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || tx.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <EntityCard
          variant="stat"
          title="Общий баланс"
          amount={summary.totalBalance}
          subtitle={`Норма сбережений: ${summary.savingsRate}%`}
        />
        <EntityCard
          variant="income"
          title="Доходы за месяц"
          amount={summary.monthlyIncome}
          category="Все категории"
        />
        <EntityCard
          variant="expense"
          title="Расходы за месяц"
          amount={summary.monthlyExpense}
          category="Все категории"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              История операций
            </h3>

            <div className="flex items-center gap-2">
              <div className="relative flex-1 sm:w-48">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Поиск..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as any)}
                className="py-1.5 px-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-700 dark:text-slate-300"
              >
                <option value="all">Все типы</option>
                <option value="income">Доходы</option>
                <option value="expense">Расходы</option>
              </select>
            </div>
          </div>

          {filteredTransactions.length === 0 ? (
            <p className="text-sm text-slate-500 py-6 text-center">
              Ничего не найдено.
            </p>
          ) : (
            <div className="space-y-2">
              {filteredTransactions.map((tx) => (
                <div key={tx.id} className="relative group">
                  <EntityCard
                    variant={tx.type}
                    title={tx.title}
                    category={tx.categoryName}
                    amount={tx.amount}
                    date={tx.date}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-all">
                    <button
                      onClick={() => setEditingTransaction(tx)}
                      className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 transition-all"
                      title="Редактировать"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteTransaction(tx.id)}
                      className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950/50 dark:text-red-400 transition-all"
                      title="Удалить"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="pt-4">
            <RecurringManager
              payments={payments}
              onAdd={addPayment}
              onDelete={deletePayment}
              onToggle={togglePayment}
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Бюджеты
            </h3>
            {budgets.map((b) => (
              <EntityCard
                key={b.id}
                variant="budget"
                title={b.categoryName}
                spentAmount={b.spentAmount}
                limitAmount={b.limitAmount}
                amount={0}
              />
            ))}
          </div>

          <div className="space-y-3">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Цели
            </h3>
            {goals.map((g) => (
              <EntityCard
                key={g.id}
                variant="goal"
                title={g.title}
                currentAmount={g.currentAmount}
                targetAmount={g.targetAmount}
                deadline={g.deadline}
                amount={0}
              />
            ))}
          </div>
        </div>
      </div>

      <EditTransactionModal
        isOpen={!!editingTransaction}
        onClose={() => setEditingTransaction(null)}
        transaction={editingTransaction}
      />
    </div>
  );
}

function MainApp() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!user) {
    return <AuthModal />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddModal={() => setIsModalOpen(true)}
      />

      <main className="max-w-6xl mx-auto px-4 py-6">
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'budgets' && <BudgetsView />}
        {activeTab === 'goals' && <GoalsView />}
        {activeTab === 'analytics' && <AnalyticsView />}
        {activeTab === 'settings' && <SettingsView />}
      </main>

      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <CurrencyProvider>
        <AuthProvider>
          <ToastProvider>
            <FinancialProvider>
              <MainApp />
            </FinancialProvider>
          </ToastProvider>
        </AuthProvider>
      </CurrencyProvider>
    </ThemeProvider>
  );
}