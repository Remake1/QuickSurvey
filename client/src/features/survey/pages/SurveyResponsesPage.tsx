import { useParams, Link } from "react-router";
import { ArrowLeft, TableIcon, BarChart3 } from "lucide-react";
import { useSurveyResponses } from "@/features/survey/hooks/useSurveyResponses";
import { usePublicSurvey } from "@/features/survey/hooks/usePublicSurvey";
import { ResponsesTable } from "@/features/survey/components/ResponsesTable";
import { ResponseStats } from "@/features/survey/components/ResponseStats";
import { Button } from "@/shared/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";

export default function SurveyResponsesPage() {
    const { id } = useParams<{ id: string }>();
    const { data: responses, isLoading: responsesLoading, isError: responsesError } = useSurveyResponses(id);
    const { survey, isLoading: surveyLoading, error: surveyError } = usePublicSurvey(id);

    const isLoading = responsesLoading || surveyLoading;
    const isError = responsesError || surveyError;

    if (isLoading) {
        return (
            <div className="container mx-auto py-8 px-4">
                <div className="text-center py-12 text-muted-foreground">
                    Loading responses…
                </div>
            </div>
        );
    }

    if (isError || !survey) {
        return (
            <div className="container mx-auto py-8 px-4">
                <div className="text-center py-12 text-destructive">
                    Failed to load responses. Make sure you have access to this survey.
                </div>
            </div>
        );
    }

    const hasResponses = responses && responses.length > 0;

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="flex items-center gap-4 mb-6">
                <Button variant="ghost" size="sm" asChild>
                    <Link to="/surveys">
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Back to Surveys
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold">{survey.title}</h1>
                    <p className="text-sm text-muted-foreground">
                        {responses?.length ?? 0} response{responses?.length !== 1 ? "s" : ""}
                    </p>
                </div>
            </div>

            {!hasResponses ? (
                <div className="text-center py-12 text-muted-foreground border rounded-md">
                    No responses yet. Share your survey to start collecting responses!
                </div>
            ) : (
                <Tabs defaultValue="table" className="w-full">
                    <TabsList>
                        <TabsTrigger value="table">
                            <TableIcon className="h-4 w-4" />
                            Responses
                        </TabsTrigger>
                        <TabsTrigger value="charts">
                            <BarChart3 className="h-4 w-4" />
                            Stats
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="table" className="mt-4">
                        <ResponsesTable responses={responses} questions={survey.questions} />
                    </TabsContent>
                    <TabsContent value="charts" className="mt-4">
                        <ResponseStats responses={responses} questions={survey.questions} />
                    </TabsContent>
                </Tabs>
            )}
        </div>
    );
}