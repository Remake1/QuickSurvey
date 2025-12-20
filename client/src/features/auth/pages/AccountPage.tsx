
import { AccountCard } from "@/features/auth/components/AccountCard";
import { useAuthStore } from "@/features/auth/store/auth.store";

export default function AccountPage() {
    const user = useAuthStore((state) => state.user);

    if (!user) {
        return null; // Or redirect logic if strict protection needed here
    }

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6 text-center">My Account</h1>
            <AccountCard user={user} />
        </div>
    );
}