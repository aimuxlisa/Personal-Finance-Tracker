import React, { ReactNode } from 'react';
import { Card } from '../ui/Card';
import { cn } from '../../utils/cn';
import { TrendingUp, TrendingDown, Calendar, Target, Wallet } from 'lucide-react';

export type EntityCardVariant = 'income' | 'expense' | 'budget' | 'goal' | 'stat';

export interface EntityCardProps {
  variant: EntityCardVariant;
  title: string;
  amount: number | string;
  currency?: string;
  category?: string;
  date?: string;
  // Поля для бюджета
  limitAmount?: number;
  spentAmount?: number;
  // Поля для целей
  targetAmount?: number;
  currentAmount?: number;
  deadline?: string;
  // Поля для статистики
  trendPercent?: number;
  isPositiveTrend?: boolean;
  subtitle?: string;
  // Дополнительно
  icon?: ReactNode;
  onClick?: () => void;
  className?: string;
}

export function EntityCard({
  variant,
  title,
  amount,
  currency = 'сум',
  category,
  date,
  limitAmount,
  spentAmount,
  targetAmount,
  currentAmount,
  deadline,
  trendPercent,
  isPositiveTrend,
  subtitle,
  icon,
  onClick,
  className,
}: EntityCardProps) {
  // Форматирование чисел для красивого вывода
  const formatNumber = (val: number | string) => {
    if (typeof val === 'number') {
      return val.toLocaleString('ru-RU');
    }
    return val;
  };

  return (
    <Card
      onClick={onClick}
      className={cn(
        'relative overflow-hidden transition-all duration-200 hover:-translate-y-0.5 cursor-pointer',
        className
      )}
    >
      {/* Вариант: ДОХОД (Income) */}
      {variant === 'income' && (
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
                {icon || <TrendingUp className="h-4 w-4" />}
              </span>
              <h4 className="text-sm font-medium text-slate-800 dark:text-slate-200">{title}</h4>
            </div>
            {category && (
              <p className="text-xs text-slate-500 dark:text-slate-400 pl-10">{category}</p>
            )}
          </div>
          <div className="text-right">
            <p className="text-base font-semibold text-emerald-600 dark:text-emerald-400">
              +{formatNumber(amount)} {currency}
            </p>
            {date && <p className="text-xs text-slate-400 dark:text-slate-500">{date}</p>}
          </div>
        </div>
      )}

      {/* Вариант: РАСХОД (Expense) */}
      {variant === 'expense' && (
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400">
                {icon || <TrendingDown className="h-4 w-4" />}
              </span>
              <h4 className="text-sm font-medium text-slate-800 dark:text-slate-200">{title}</h4>
            </div>
            {category && (
              <p className="text-xs text-slate-500 dark:text-slate-400 pl-10">{category}</p>
            )}
          </div>
          <div className="text-right">
            <p className="text-base font-semibold text-slate-900 dark:text-slate-100">
              -{formatNumber(amount)} {currency}
            </p>
            {date && <p className="text-xs text-slate-400 dark:text-slate-500">{date}</p>}
          </div>
        </div>
      )}

      {/* Вариант: БЮДЖЕТ (Budget) */}
      {variant === 'budget' && (() => {
        const spent = spentAmount || 0;
        const limit = limitAmount || 1;
        const percentage = Math.min(Math.round((spent / limit) * 100), 100);
        const isOverbudget = spent > limit;

        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {title}
              </span>
              <span
                className={cn(
                  'text-xs font-semibold px-2 py-0.5 rounded-full',
                  isOverbudget
                    ? 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400'
                    : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                )}
              >
                {percentage}%
              </span>
            </div>

            {/* Прогресс-бар */}
            <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className={cn(
                  'h-full transition-all duration-300 rounded-full',
                  isOverbudget ? 'bg-red-500' : 'bg-blue-600'
                )}
                style={{ width: `${percentage}%` }}
              />
            </div>

            <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>Потрачено: {formatNumber(spent)} {currency}</span>
              <span>Лимит: {formatNumber(limit)} {currency}</span>
            </div>
          </div>
        );
      })()}

      {/* Вариант: ЦЕЛЬ НАКОПЛЕНИЙ (Goal) */}
      {variant === 'goal' && (() => {
        const current = currentAmount || 0;
        const target = targetAmount || 1;
        const progress = Math.min(Math.round((current / target) * 100), 100);

        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
                  <Target className="h-4 w-4" />
                </span>
                <h4 className="text-sm font-medium text-slate-800 dark:text-slate-200">{title}</h4>
              </div>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                {progress}%
              </span>
            </div>

            {/* Прогресс-бар цели */}
            <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all duration-300 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>{formatNumber(current)} / {formatNumber(target)} {currency}</span>
              {deadline && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {deadline}
                </span>
              )}
            </div>
          </div>
        );
      })()}

      {/* Вариант: СТАТИСТИКА (Stat) */}
      {variant === 'stat' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>{title}</span>
            {icon || <Wallet className="h-4 w-4 text-slate-400" />}
          </div>
          <div className="flex items-baseline justify-between">
            <p className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              {formatNumber(amount)} {currency}
            </p>
            {trendPercent !== undefined && (
              <span
                className={cn(
                  'text-xs font-semibold flex items-center gap-0.5',
                  isPositiveTrend
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-red-600 dark:text-red-400'
                )}
              >
                {isPositiveTrend ? '+' : '-'}{Math.abs(trendPercent)}%
              </span>
            )}
          </div>
          {subtitle && <p className="text-xs text-slate-400 dark:text-slate-500">{subtitle}</p>}
        </div>
      )}
    </Card>
  );
}