import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useCurrency, Currency } from '../../context/CurrencyContext';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import {
  LayoutDashboard,
  PieChart,
  Target,
  BarChart3,
  Settings,
  Plus,
  Sun,
  Moon,
  Wallet,
  LogOut,
  User as UserIcon,
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAddModal: () => void;
}

export function Navbar({ activeTab, setActiveTab, onOpenAddModal }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();
  const { currency, setCurrency } = useCurrency();
  const { user, logout } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Обзор', icon: LayoutDashboard },
    { id: 'budgets', label: 'Бюджеты', icon: PieChart },
    { id: 'goals', label: 'Цели', icon: Target },
    { id: 'analytics', label: 'Аналитика', icon: BarChart3 },
    { id: 'settings', label: 'Настройки', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100">
          <div className="p-2 bg-blue-600 rounded-xl text-white">
            <Wallet className="h-5 w-5" />
          </div>
          <span className="hidden sm:inline text-lg">FinanceTracker</span>
        </div>

        <nav className="flex items-center gap-1 sm:gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden md:inline">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {/* Валюта */}
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as Currency)}
            className="py-1.5 px-2 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none text-slate-700 dark:text-slate-300"
          >
            <option value="UZS">UZS</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="RUB">RUB</option>
          </select>

          {/* Тема */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          >
            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>

          {/* Добавить */}
          <Button onClick={onOpenAddModal} className="flex items-center gap-1 text-xs sm:text-sm py-2 px-3">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Добавить</span>
          </Button>

          {/* Имя и Выход */}
          {user && (
            <div className="flex items-center gap-2 ml-2 pl-2 border-l border-slate-200 dark:border-slate-800">
              <span className="hidden lg:flex items-center gap-1 text-xs font-medium text-slate-700 dark:text-slate-300">
                <UserIcon className="h-3.5 w-3.5" />
                {user.name}
              </span>
              <button
                onClick={logout}
                className="p-2 rounded-xl text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                title="Выйти"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}