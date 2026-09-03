import { createClient } from '@supabase/supabase-js';

// Кастомный адаптер хранилища для сохранения сессии в Cookie
const cookieStorage = {
  getItem: (key: string): string | null => {
    if (typeof document === 'undefined') return null;
    const name = `${key}=`;
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return null;
  },
  setItem: (key: string, value: string): void => {
    if (typeof document === 'undefined') return;
    // Устанавливаем cookie на 7 дней с флагом SameSite=Lax
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `${key}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
  },
  removeItem: (key: string): void => {
    if (typeof document === 'undefined') return;
    document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  },
};

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Внимание: Переменные VITE_SUPABASE_URL или VITE_SUPABASE_ANON_KEY не найдены в файле .env'
  );
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      storage: cookieStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  }
);