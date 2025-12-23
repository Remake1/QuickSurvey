import { useParams, Link } from "react-router";
import { FormViewer } from "../components/FormViewer.tsx";
import { useSurveyResponseStore } from "../store/surveyResponse.store.ts";
import { Button } from "@/shared/components/ui/button.tsx";
import type { SubmitResponseDto } from "@quicksurvey/shared/schemas/response.schema.ts";
import { usePublicSurvey } from "../hooks/usePublicSurvey.ts";

export default function SurveyPublicPage() {
    const { id } = useParams<{ id: string }>();


    const clearResponse = useSurveyResponseStore((state) => state.clearResponse);
    const getResponse = useSurveyResponseStore((state) => state.getResponse);

    const {
        survey,
        isLoading,
        error,
        submitResponse,
        isSubmitting,
        isSubmitSuccess
    } = usePublicSurvey(id);

    // Load saved progress
    const defaultValues = id ? getResponse(id) : undefined;


    const handleSubmit = (data: Record<string, any>) => {
        if (!survey || !id) return;

        // Transform form data to SubmitResponseDto
        const answers: SubmitResponseDto["answers"] = [];

        survey.questions.forEach((q) => {
            const value = data[q.id];

            // Skip undefined values (optional questions not answered)
            if (value === undefined || value === null || value === "") return;

            // Specifically for checkboxes, skip empty arrays
            if (q.type === 'checkboxes' && Array.isArray(value) && value.length === 0) return;

            const answer = {
                questionId: q.id,
                type: q.type,
                value: value,
            } as any;

            answers.push(answer);
        });

        submitResponse(
            {
                surveyId: id,
                answers,
            },
            {
                onSuccess: () => {
                    if (id) {
                        clearResponse(id);
                    }
                },
                onError: (err) => {
                    console.error("Submission failed", err);
                },
            }
        );
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error || !survey) {
        return (
            <div className="text-center space-y-4">
                <h1 className="text-2xl font-bold text-destructive">Error Loading Survey</h1>
                <p className="text-muted-foreground">
                    {error instanceof Error ? error.message : "Survey not found or unavailable."}
                </p>
                <Button asChild variant="outline">
                    <Link to="/">Go Home</Link>
                </Button>
            </div>
        );
    }

    if (isSubmitSuccess) {
        return (
            <div className="text-center space-y-6 py-10 bg-card rounded-lg border shadow-sm p-8">
                <div className="mx-auto w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-6 h-6"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                </div>
                <h1 className="text-2xl font-bold">Response Recorded</h1>
                <p className="text-muted-foreground">
                    Thank you for filling out <strong>{survey.title}</strong>. Your response has been successfully submitted.
                </p>
                <Button asChild className="mt-4">
                    <Link to="/">Create your own survey</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-20">
            <div className="bg-card rounded-lg border shadow-sm border-t-8 border-t-primary p-6 md:p-8">
                <h1 className="text-3xl font-bold mb-2">{survey.title}</h1>
                {survey.description && (
                    <p className="text-muted-foreground whitespace-pre-wrap">{survey.description}</p>
                )}
            </div>

            <FormViewer
                surveyId={survey.id}
                questions={survey.questions}
                onSubmit={handleSubmit}
                defaultValues={defaultValues}
                isSubmitting={isSubmitting}
            />
        </div>
    );
}