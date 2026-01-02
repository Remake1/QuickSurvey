import { Link } from 'react-router';
import { Plus } from 'lucide-react';
import { useMySurveys } from "@/features/survey/hooks/useMySurveys.ts";
import SurveyList from "@/features/survey/components/SurveyList.tsx";
import { Button } from "@/shared/components/ui/button.tsx";

export default function SurveyListPage() {
    const { data, isLoading, isError } = useMySurveys();

    if (isLoading) {
        return <div>Loading surveys…</div>;
    }

    if (isError) {
        return <div>Failed to load surveys</div>;
    }

    if (!data || data.length === 0) {
        return (
            <div className="container mx-auto py-8 px-4">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold">My Surveys</h1>
                    <Button asChild>
                        <Link to="/surveys/new">
                            <Plus className="h-4 w-4 mr-1" />
                            Create Survey
                        </Link>
                    </Button>
                </div>
                <div className="text-center py-12 text-muted-foreground">
                    You have no surveys yet. Create your first one!
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">My Surveys</h1>
                <Button asChild>
                    <Link to="/surveys/new">
                        <Plus className="h-4 w-4 mr-1" />
                        Create Survey
                    </Link>
                </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <SurveyList surveys={data} />
            </div>
        </div>
    );
}
