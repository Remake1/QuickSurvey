import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useAuthStore} from "@/features/auth/store/auth.store.ts";
import {logout} from "@/features/auth/api/auth.api.ts";

export function useLogout() {
    const qc = useQueryClient();
    const setUser = useAuthStore(s => s.setUser);

    return useMutation({
        mutationFn: logout,
        onSuccess: () => {
            setUser(null);
            qc.clear();
        },
    });
}
