import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';
import { Download, Upload, Trash2, Settings } from 'lucide-react';

export function SettingsView() {
  const { showToast } = useToast();

  const handleExportData = () => {
    const data = {
      transactions: JSON.parse(localStorage.getItem('ft_transactions') || '[]'),
      budgets: JSON.parse(localStorage.getItem('ft_budgets') || '[]'),
      goals: JSON.parse(localStorage.getItem('ft_goals') || '[]'),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `finance_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    showToast('success', 'Резервная копия успешно экспортирована');
  };

  const handleClearData = () => {
    if (confirm('Вы уверены, что хотите сбросить все данные?')) {
      localStorage.removeItem('ft_transactions');
      localStorage.removeItem('ft_budgets');
      localStorage.removeItem('ft_goals');
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Settings className="h-6 w-6 text-blue-600" />
          Настройки данных
        </h2>
        <p className="text-xs text-slate-500">
          Управление резервными копиями и сброс информации
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Download className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">
              Экспорт данных
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            Скачайте резервную копию всех ваших транзакций, бюджетов и целей в формате JSON.
          </p>
          <Button onClick={handleExportData} variant="outline" className="w-full text-xs">
            Скачать JSON
          </Button>
        </Card>

        <Card className="p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-red-600" />
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">
              Сброс локальных данных
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            Полностью очистит сохранённые данные в браузере и вернет начальное состояние.
          </p>
          <Button onClick={handleClearData} variant="outline" className="w-full text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 border-red-200">
            Очистить всё
          </Button>
        </Card>
      </div>
    </div>
  );
}