import { useMutation } from "@tanstack/react-query";
import { register } from "@/features/auth/api/auth.api.ts";
import { useNavigate } from "react-router";

export function useRegister() {
    const navigate = useNavigate();

    return useMutation({
        mutationFn: register,
        onSuccess: () => {
            navigate("/login");
        },
    });
}
