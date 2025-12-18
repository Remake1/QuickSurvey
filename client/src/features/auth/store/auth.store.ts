// useAuthStore placeholder
import { create } from 'zustand';
import type {UserResponse} from '@quicksurvey/shared/schemas/auth.schema';

interface AuthState {
    user: UserResponse | null;
    token: string | null;
    setUser: (user: UserResponse | null) => void;
    setToken: (token: string | null) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: null,
    setUser: (user) => set({ user }),
    setToken: (token) => set({ token }),
    logout: () => set({ user: null, token: null }),
}));

