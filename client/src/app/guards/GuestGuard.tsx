import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "@/features/auth/store/auth.store";

export default function GuestGuard() {
    const user = useAuthStore(s => s.user);
    return user ? <Navigate to="/surveys" replace /> : <Outlet />;
}
