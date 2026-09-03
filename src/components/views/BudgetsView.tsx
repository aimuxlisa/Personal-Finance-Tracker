import React, { useState } from 'react';
import { useFinancial } from '../../context/FinancialContext';
import { EntityCard } from '../common/EntityCard';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { useToast } from '../ui/Toast';
import { PieChart, Plus } from 'lucide-react';

export function BudgetsView() {
  const { budgets, addBudget } = useFinancial();
  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [categoryName, setCategoryName] = useState('');
  const [limitAmount, setLimitAmount] = useState('');

  const handleCreateBudget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName || !limitAmount) {
      showToast('error', 'Заполните все поля');
      return;
    }

    addBudget({
      categoryName,
      limitAmount: parseFloat(limitAmount),
    });

    showToast('success', `Бюджет для категории "${categoryName}" создан!`);
    setCategoryName('');
    setLimitAmount('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <PieChart className="h-6 w-6 text-blue-600" />
            Бюджеты по категориям
          </h2>
          <p className="text-xs text-slate-500">
            Устанавливайте лимиты расходов и контролируйте их соблюдение
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-1.5 text-sm">
          <Plus className="h-4 w-4" />
          <span>Новый бюджет</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {budgets.map((budget) => (
          <EntityCard
            key={budget.id}
            variant="budget"
            title={budget.categoryName}
            spentAmount={budget.spentAmount}
            limitAmount={budget.limitAmount}
            amount={0}
          />
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Новый лимит бюджета">
        <form onSubmit={handleCreateBudget} className="space-y-4">
          <Input
            label="Категория"
            placeholder="Например: Продукты, Транспорт"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />
          <Input
            label="Лимит на месяц (сум)"
            type="number"
            placeholder="2000000"
            value={limitAmount}
            onChange={(e) => setLimitAmount(e.target.value)}
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Отмена
            </Button>
            <Button type="submit">Создать бюджет</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}