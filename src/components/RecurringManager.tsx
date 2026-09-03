import React, { useState } from 'react';
import { Calendar, Plus, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { RecurringPayment } from '../types/recurring';
import { useCurrency } from '../context/CurrencyContext';

interface Props {
  payments: RecurringPayment[];
  onAdd: (payment: Omit<RecurringPayment, 'id'>) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}

export const RecurringManager: React.FC<Props> = ({
  payments,
  onAdd,
  onDelete,
  onToggle,
}) => {
  const { formatAmount } = useCurrency();
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Подписки');
  const [dayOfMonth, setDayOfMonth] = useState('1');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount) return;

    onAdd({
      title,
      amount: parseFloat(amount),
      category,
      dayOfMonth: parseInt(dayOfMonth, 10),
      isActive: true,
    });

    setTitle('');
    setAmount('');
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
          <Calendar className="w-5 h-5 text-indigo-500" />
          Регулярные платежи и подписки
        </h2>
      </div>

      {/* Форма добавления */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
        <input
          type="text"
          placeholder="Название (Spotify, Аренда...)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="px-3 py-2 border dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
        <input
          type="number"
          placeholder="Сумма (UZS)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="px-3 py-2 border dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
        <select
          value={dayOfMonth}
          onChange={(e) => setDayOfMonth(e.target.value)}
          className="px-3 py-2 border dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
            <option key={day} value={day}>
              {day}-е число месяца
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" /> Добавить
        </button>
      </form>

      {/* Список платежей */}
      <div className="space-y-3">
        {payments.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-4">
            Нет настроенных регулярных платежей.
          </p>
        ) : (
          payments.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onToggle(p.id)}
                  title={p.isActive ? 'Деактивировать' : 'Активировать'}
                  className="text-gray-400 hover:text-indigo-500"
                >
                  {p.isActive ? (
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                <div>
                  <div className="font-medium text-sm text-gray-900 dark:text-white">{p.title}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Каждое {p.dayOfMonth}-е число
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="font-semibold text-sm text-gray-900 dark:text-white">
                  {formatAmount(p.amount)}
                </span>
                <button
                  onClick={() => onDelete(p.id)}
                  className="text-gray-400 hover:text-rose-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};