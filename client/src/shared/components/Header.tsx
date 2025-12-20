import { Link } from "react-router";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { Button } from "@/shared/components/ui/button";
import { User, Settings, ChevronDown } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { LogoutButton } from "@/features/auth/components/LogoutButton";

export default function Header() {
    const user = useAuthStore((state) => state.user);

    return (
        <header className="border-b bg-background w-full">
            <div className="flex h-16 items-center justify-between px-8 w-full">
                <Link to="/" className="text-xl font-bold">
                    <span className="text-primary">Quick</span>Survey
                </Link>
                <nav className="flex items-center gap-4">
                    {user ? (
                        <>
                            <Button variant="ghost" asChild>
                                <Link to="/surveys">Surveys</Link>
                            </Button>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="flex items-center gap-2"
                                    >
                                        <User className="h-4 w-4" />
                                        <span className="text-sm font-medium">
                                            {user.name}
                                        </span>
                                        <ChevronDown className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                    <DropdownMenuItem asChild>
                                        <Link
                                            to="/account"
                                            className="flex items-center gap-2 cursor-pointer"
                                        >
                                            <Settings className="h-4 w-4" />
                                            Manage account
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        variant="destructive"
                                        className="p-0 focus:bg-transparent"
                                        onSelect={(e) => e.preventDefault()}
                                    >
                                        <LogoutButton
                                            variant="ghost"
                                            className="w-full justify-start text-destructive hover:text-destructive hover:bg-red-100"
                                        />
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </>
                    ) : (
                        <>
                            <Button variant="ghost" asChild>
                                <Link to="/login">Login</Link>
                            </Button>
                            <Button asChild>
                                <Link to="/register">Get started</Link>
                            </Button>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}