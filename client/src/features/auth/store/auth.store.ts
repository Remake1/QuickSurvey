import { create } from "zustand";
import type {UserResponse} from "@/shared/schemas/auth.schema.ts";

type AuthState = {
    user: UserResponse | null;
    setUser: (user: UserResponse | null) => void;
};

export const useAuthStore = create<AuthState>(set => ({
    user: null,
    setUser: user => set({ user }),
}));
