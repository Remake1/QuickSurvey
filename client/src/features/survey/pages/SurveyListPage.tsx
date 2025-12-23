import {useMySurveys} from "@/features/survey/hooks/useMySurveys.ts";
import SurveyList from "@/features/survey/components/SurveyList.tsx";

export default function SurveyListPage() {
    const { data, isLoading, isError } = useMySurveys();

    if (isLoading) {
        return <div>Loading surveys…</div>;
    }

    if (isError) {
        return <div>Failed to load surveys</div>;
    }

    if (!data || data.length === 0) {
        return <div>You have no surveys yet.</div>;
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <h1 className="text-2xl font-bold mb-6">My Surveys</h1>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <SurveyList surveys={data} />
            </div>
        </div>
    );
}
