
import { cn } from "@/shared/lib/utils";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { LogoutButton } from "@/features/auth/components/LogoutButton";
import { Calendar, Mail, User as UserIcon } from "lucide-react";
import type { UserResponse } from "@quicksurvey/shared/schemas/auth.schema";

interface AccountCardProps {
    className?: string;
    user: UserResponse;
}

export function AccountCard({ className, user }: AccountCardProps) {
    const initials = user.name
        ? user.name
            .split(" ")
            .map((n: string) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)
        : "U";

    const joinedDate = user.createdAt
        ? new Date(user.createdAt).toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
            day: "numeric",
        })
        : "Unknown";

    return (
        <Card className={cn("w-full max-w-md mx-auto", className)}>
            <CardHeader className="flex flex-row items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary text-xl font-bold">
                    {initials}
                </div>
                <div className="flex flex-col">
                    <CardTitle className="text-xl">{user.name}</CardTitle>
                    <CardDescription className="text-sm">{user.email}</CardDescription>
                </div>
            </CardHeader>
            <CardContent className="grid gap-4">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <UserIcon className="h-4 w-4" />
                    <span>{user.name}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {joinedDate}</span>
                </div>
            </CardContent>
            <CardFooter className="flex justify-end">
                <LogoutButton variant="destructive" />
            </CardFooter>
        </Card>
    );
}
