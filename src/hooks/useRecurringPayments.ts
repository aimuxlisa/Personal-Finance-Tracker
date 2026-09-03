import { useState, useEffect } from 'react';
import { RecurringPayment } from '../types/recurring';
import { Transaction } from '../types'; // Ваш тип транзакции

export const useRecurringPayments = (
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void
) => {
  const [payments, setPayments] = useState<RecurringPayment[]>(() => {
    const saved = localStorage.getItem('recurring_payments');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('recurring_payments', JSON.stringify(payments));
  }, [payments]);

  // Автоматическая проверка и генерация транзакций
  useEffect(() => {
    const today = new Date();
    const currentDay = today.getDate();
    const currentMonthStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;

    let updated = false;
    const newPayments = payments.map((p) => {
      if (!p.isActive) return p;

      // Если настало время платежа и в этом месяце он еще не списывался
      if (currentDay >= p.dayOfMonth && p.lastProcessedMonth !== currentMonthStr) {
        addTransaction({
          title: `[Регулярный] ${p.title}`,
          amount: p.amount,
          type: 'expense',
          category: p.category,
          date: today.toISOString().split('T')[0],
        });

        updated = true;
        return { ...p, lastProcessedMonth: currentMonthStr };
      }

      return p;
    });

    if (updated) {
      setPayments(newPayments);
    }
  }, [payments, addTransaction]);

  const addPayment = (payment: Omit<RecurringPayment, 'id'>) => {
    const newPayment: RecurringPayment = {
      ...payment,
      id: Date.now().toString(),
    };
    setPayments((prev) => [...prev, newPayment]);
  };

  const deletePayment = (id: string) => {
    setPayments((prev) => prev.filter((p) => p.id !== id));
  };

  const togglePayment = (id: string) => {
    setPayments((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p))
    );
  };

  return { payments, addPayment, deletePayment, togglePayment };
};
