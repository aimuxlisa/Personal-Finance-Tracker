import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useFinancial, TransactionType } from '../../context/FinancialContext';
import { useToast } from '../ui/Toast';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DEFAULT_CATEGORIES = [
  'Продукты',
  'Работа',
  'Развлечения',
  'Коммунальные',
  'Транспорт',
  'Здоровье',
  'Другое',
];

export function AddTransactionModal({ isOpen, onClose }: AddTransactionModalProps) {
  const { addTransaction, budgets = [] } = useFinancial();
  const { showToast } = useToast();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [categoryName, setCategoryName] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);

  const budgetCategories = (budgets || []).map((b) => b.categoryName);
  const availableCategories = Array.from(
    new Set([...DEFAULT_CATEGORIES, ...budgetCategories])
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !amount || !categoryName || !date) {
      showToast('error', 'Пожалуйста, заполните все поля');
      return;
    }

    addTransaction({
      title,
      amount: parseFloat(amount),
      type,
      categoryName,
      date,
    });

    showToast('success', 'Операция успешно добавлена!');
    setTitle('');
    setAmount('');
    setCategoryName('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Новая операция">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Переключатель Типа: Расход / Доход */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <button
            type="button"
            onClick={() => setType('expense')}
            className={`py-1.5 text-xs font-medium rounded-md transition-all ${
              type === 'expense'
                ? 'bg-white dark:bg-slate-900 text-red-600 shadow-sm'
                : 'text-slate-500'
            }`}
          >
            Расход
          </button>
          <button
            type="button"
            onClick={() => setType('income')}
            className={`py-1.5 text-xs font-medium rounded-md transition-all ${
              type === 'income'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 shadow-sm'
                : 'text-slate-500'
            }`}
          >
            Доход
          </button>
        </div>

        <Input
          label="Название"
          placeholder="Например: Покупка продуктов"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <Input
          label="Сумма (сум)"
          type="number"
          placeholder="50000"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
            Категория
          </label>
          <input
            type="text"
            list="categories-list"
            placeholder="Выберите или введите категорию"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100"
          />
          <datalist id="categories-list">
            {availableCategories.map((cat) => (
              <option key={cat} value={cat} />
            ))}
          </datalist>
        </div>

        <Input
          label="Дата"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" type="button" onClick={onClose}>
            Отмена
          </Button>
          <Button type="submit">Добавить</Button>
        </div>
      </form>
    </Modal>
  );
}