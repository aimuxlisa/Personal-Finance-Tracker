import React, { useState } from 'react';
import { useFinancial } from '../../context/FinancialContext';
import { EntityCard } from '../common/EntityCard';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { useToast } from '../ui/Toast';
import { Target, Plus, PiggyBank } from 'lucide-react';

export function GoalsView() {
  const { goals, addGoal, updateGoalAmount } = useFinancial();
  const { showToast } = useToast();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [deadline, setDeadline] = useState('');

  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [depositAmount, setDepositAmount] = useState('');

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !targetAmount || !deadline) {
      showToast('error', 'Заполните все обязательные поля');
      return;
    }

    addGoal({
      title,
      targetAmount: parseFloat(targetAmount),
      currentAmount: currentAmount ? parseFloat(currentAmount) : 0,
      deadline,
    });

    showToast('success', `Цель "${title}" успешно создана!`);
    setTitle('');
    setTargetAmount('');
    setCurrentAmount('');
    setDeadline('');
    setIsAddModalOpen(false);
  };

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGoalId || !depositAmount) {
      showToast('error', 'Укажите сумму пополнения');
      return;
    }

    const goal = goals.find((g) => g.id === selectedGoalId);
    if (goal) {
      const newAmount = goal.currentAmount + parseFloat(depositAmount);
      updateGoalAmount(selectedGoalId, newAmount);
      showToast('success', `Цель "${goal.title}" пополнена на ${parseFloat(depositAmount).toLocaleString()} сум`);
    }

    setIsDepositModalOpen(false);
    setSelectedGoalId(null);
    setDepositAmount('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Target className="h-6 w-6 text-blue-600" />
            Финансовые цели
          </h2>
          <p className="text-xs text-slate-500">
            Копите на важные мечты и крупные покупки
          </p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-1.5 text-sm">
          <Plus className="h-4 w-4" />
          <span>Новая цель</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.map((goal) => (
          <div key={goal.id} className="space-y-2">
            <EntityCard
              variant="goal"
              title={goal.title}
              currentAmount={goal.currentAmount}
              targetAmount={goal.targetAmount}
              deadline={goal.deadline}
              amount={0}
            />
            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                className="text-xs flex items-center gap-1"
                onClick={() => {
                  setSelectedGoalId(goal.id);
                  setIsDepositModalOpen(true);
                }}
              >
                <PiggyBank className="h-3.5 w-3.5" />
                Пополнить
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Новая финансовая цель">
        <form onSubmit={handleCreateGoal} className="space-y-4">
          <Input
            label="Название цели"
            placeholder="Например: Покупка машины или Отпуск"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Input
            label="Целевая сумма (сум)"
            type="number"
            placeholder="10000000"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
          />
          <Input
            label="Уже накоплено (сум)"
            type="number"
            placeholder="0"
            value={currentAmount}
            onChange={(e) => setCurrentAmount(e.target.value)}
          />
          <Input
            label="Плановая дата"
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" type="button" onClick={() => setIsAddModalOpen(false)}>
              Отмена
            </Button>
            <Button type="submit">Создать</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isDepositModalOpen} onClose={() => setIsDepositModalOpen(false)} title="Пополнение цели">
        <form onSubmit={handleDeposit} className="space-y-4">
          <Input
            label="Сумма пополнения (сум)"
            type="number"
            placeholder="500000"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" type="button" onClick={() => setIsDepositModalOpen(false)}>
              Отмена
            </Button>
            <Button type="submit">Внести средства</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}