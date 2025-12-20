import { Link } from "react-router";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { Button } from "@/shared/components/ui/button";
import { User, Settings, LogOut } from "lucide-react";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/shared/components/ui/navigation-menu";

export default function Header() {
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.setUser); // Placeholder for logout

    const handleLogout = () => {
        logout(null); // Clear user
        // Additional logout logic (api call) would go here
    };

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

                            <NavigationMenu viewport={false}>
                                <NavigationMenuList>
                                    <NavigationMenuItem>
                                        <NavigationMenuTrigger className="flex items-center gap-2 border rounded-md px-3 py-1.25 h-auto">
                                            <User className="h-4 w-4" />
                                            <span className="text-sm font-medium">
                                                {user.name}
                                            </span>
                                        </NavigationMenuTrigger>
                                        <NavigationMenuContent className="right-0 left-auto w-auto min-w-50 mt-2">
                                            <ul className="grid w-full gap-1">
                                                <li>
                                                    <NavigationMenuLink asChild>
                                                        <Link
                                                            to="/account"
                                                            className="flex items-center gap-2 w-full p-2 rounded-md hover:bg-accent hover:text-accent-foreground text-sm font-medium"
                                                        >
                                                            <Settings className="h-4 w-4" />
                                                            Manage account
                                                        </Link>
                                                    </NavigationMenuLink>
                                                </li>
                                                <li>
                                                    <NavigationMenuLink asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={handleLogout}
                                                            className="flex items-center justify-start gap-2 w-full h-auto p-2 rounded-md hover:bg-red-500 hover:text-white text-destructive"
                                                        >
                                                            <LogOut className="h-4 w-4" />
                                                            Logout
                                                        </Button>
                                                    </NavigationMenuLink>
                                                </li>
                                            </ul>
                                        </NavigationMenuContent>
                                    </NavigationMenuItem>
                                </NavigationMenuList>
                            </NavigationMenu>
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