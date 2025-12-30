import { Link } from "react-router";
import { Button } from "@/shared/components/ui/button";
import { FileQuestion, Home, ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
            <div className="relative mb-8">
                <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl scale-150" />
                <FileQuestion className="relative h-24 w-24 text-primary" strokeWidth={1.5} />
            </div>

            <h1 className="text-7xl font-bold text-foreground mb-2">404</h1>
            <h2 className="text-2xl font-semibold text-foreground mb-3">
                Page not found
            </h2>
            <p className="text-muted-foreground max-w-md mb-8">
                Sorry, we couldn't find the page you're looking for.
                It might have been moved, deleted, or never existed.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild variant="outline" size="lg">
                    <Link to={-1 as unknown as string} className="flex items-center gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Go back
                    </Link>
                </Button>
                <Button asChild size="lg">
                    <Link to="/" className="flex items-center gap-2">
                        <Home className="h-4 w-4" />
                        Back to home
                    </Link>
                </Button>
            </div>
        </div>
    );
}