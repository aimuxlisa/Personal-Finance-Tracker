import React from 'react';
import { useFinancial } from '../../context/FinancialContext';
import { EntityCard } from '../common/EntityCard';
import { Card } from '../ui/Card';
import { BarChart3, PieChart, TrendingUp } from 'lucide-react';

export function AnalyticsView() {
  const { summary, transactions } = useFinancial();

  // Группировка и расчет расходов по категориям
  const expenseTransactions = transactions.filter((t) => t.type === 'expense');
  
  const expenseByCategory = expenseTransactions.reduce<Record<string, number>>((acc, t) => {
    acc[t.categoryName] = (acc[t.categoryName] || 0) + t.amount;
    return acc;
  }, {});

  const totalExpense = summary.monthlyExpense || 1; // защита от деления на 0

  const categoryList = Object.entries(expenseByCategory).map(([category, amount]) => ({
    category,
    amount,
    percentage: Math.round((amount / totalExpense) * 100),
  }));

  // Сортировка по убыванию суммы
  categoryList.sort((a, b) => b.amount - a.amount);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-blue-600" />
          Аналитика и отчёты
        </h2>
        <p className="text-xs text-slate-500">
          Наглядное распределение доходов, расходов и показателей эффективности
        </p>
      </div>

      {/* Статистические метрики */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <EntityCard
          variant="stat"
          title="Чистый доход"
          amount={summary.monthlyIncome - summary.monthlyExpense}
          subtitle="Доход минус Расход за текущий период"
        />
        <EntityCard
          variant="stat"
          title="Норма сбережений"
          amount={`${summary.savingsRate}%`}
          subtitle="Процент сохраняемых средств"
        />
        <EntityCard
          variant="stat"
          title="Всего операций"
          amount={transactions.length}
          subtitle="Зафиксировано в истории"
        />
      </div>

      {/* Наглядная структура расходов по категориям */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <PieChart className="h-5 w-5 text-indigo-500" />
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Структура расходов по категориям
          </h3>
        </div>

        {categoryList.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-8">
            Недостаточно данных по расходам для построения аналитики.
          </p>
        ) : (
          <div className="space-y-4">
            {categoryList.map((item) => (
              <div key={item.category} className="space-y-1.5">
                <div className="flex justify-between items-center text-sm font-medium">
                  <span className="text-slate-700 dark:text-slate-300">{item.category}</span>
                  <div className="text-right">
                    <span className="text-slate-900 dark:text-slate-100 font-semibold">
                      {item.amount.toLocaleString()} сум
                    </span>
                    <span className="text-xs text-slate-400 ml-2">({item.percentage}%)</span>
                  </div>
                </div>
                {/* Визуальная полоса процента */}
                <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-500"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}