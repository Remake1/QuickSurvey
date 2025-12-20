import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "@/features/auth/api/auth.api.ts";
import {useAuthStore} from "@/features/auth/store/auth.store.ts";

export function useLogin() {
    const setUser = useAuthStore(s => s.setUser);
    const qc = useQueryClient();

    return useMutation({
        mutationFn: login,
        onSuccess: (user) => {
            setUser(user);
            qc.setQueryData(["me"], user);
        },
    });
}
