import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useFinancial, Transaction, TransactionType } from '../../context/FinancialContext';
import { useToast } from '../ui/Toast';

interface EditTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
}

export function EditTransactionModal({
  isOpen,
  onClose,
  transaction,
}: EditTransactionModalProps) {
  const { updateTransaction } = useFinancial();
  const { showToast } = useToast();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [categoryName, setCategoryName] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    if (transaction) {
      setTitle(transaction.title);
      setAmount(transaction.amount.toString());
      setType(transaction.type);
      setCategoryName(transaction.categoryName);
      setDate(transaction.date);
    }
  }, [transaction]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transaction) return;

    if (!title || !amount || !categoryName || !date) {
      showToast('error', 'Заполните все поля');
      return;
    }

    updateTransaction(transaction.id, {
      title,
      amount: parseFloat(amount),
      type,
      categoryName,
      date,
    });

    showToast('success', 'Операция успешно обновлена');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Редактировать операцию">
      <form onSubmit={handleSubmit} className="space-y-4">
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

        <Input
          label="Категория"
          placeholder="Например: Продукты, Развлечения"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
        />

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
          <Button type="submit">Сохранить</Button>
        </div>
      </form>
    </Modal>
  );
}