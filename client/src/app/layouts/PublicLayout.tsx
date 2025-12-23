import { Outlet } from "react-router";

export default function PublicLayout() {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
            <main className="w-full max-w-3xl">
                <Outlet />
            </main>
        </div>
    );
}
