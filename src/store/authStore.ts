import { create } from 'zustand';
import { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  
  login: async (email: string, password: string) => {
    // Simulate API call
    if (email === 'admin' && password === 'Raizen.2025') {
      const user: User = {
        id: '1',
        name: 'Administrador',
        email: 'admin',
        role: 'admin'
      };
      set({ user, isAuthenticated: true });
      localStorage.setItem('user', JSON.stringify(user));
      return true;
    }
    return false;
  },
  
  logout: () => {
    set({ user: null, isAuthenticated: false });
    localStorage.removeItem('user');
  }
}));

// Initialize auth state from localStorage
const storedUser = localStorage.getItem('user');
if (storedUser) {
  const user = JSON.parse(storedUser);
  useAuthStore.setState({ user, isAuthenticated: true });
}