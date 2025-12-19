import {useMutation, useQueryClient} from "@tanstack/react-query";
import {login} from "@/features/auth/api/auth.api.ts";

export function useLogin() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: login,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["me"] });
        },
    });
}
