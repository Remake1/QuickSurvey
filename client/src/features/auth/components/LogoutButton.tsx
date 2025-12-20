import { useNavigate } from "react-router";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { Button } from "@/shared/components/ui/button";
import { LogOut } from "lucide-react";
import type { ComponentProps, Ref } from "react";

type LogoutButtonProps = Omit<ComponentProps<typeof Button>, "onClick"> & {
    ref?: Ref<HTMLButtonElement>;
};

export function LogoutButton({ className, ref, ...props }: LogoutButtonProps) {
    const logout = useLogout();
    const navigate = useNavigate();

    function handleLogout() {
        console.log("Logging out...");
        logout.mutate(undefined, {
            onSuccess: () => {
                navigate("/login", { replace: true });
            },
        });
    }

    return (
        <Button
            ref={ref}
            onClick={handleLogout}
            disabled={logout.isPending}
            className={className}
            {...props}
        >
            <LogOut className="h-4 w-4" />
            {logout.isPending ? "Logging out..." : "Logout"}
        </Button>
    );
}

