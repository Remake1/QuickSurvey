import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "@/features/auth/store/auth.store.ts";

export default function AuthGuard() {
    const user = useAuthStore(s => s.user);
    return user ? <Outlet /> : <Navigate to="/login" replace />;
}
