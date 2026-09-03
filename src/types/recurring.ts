export interface RecurringPayment {
    id: string;
    title: string;
    amount: number; // В UZS
    category: string;
    dayOfMonth: number; // Число месяца для списания (1-31)
    lastProcessedMonth?: string; // Формат "YYYY-MM" для исключения повторного списания
    isActive: boolean;
  }