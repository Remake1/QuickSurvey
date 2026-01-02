import { useQuery } from "@tanstack/react-query";
import { fetchSurveyResponses } from "@/features/survey/api/surveys.api.ts";

export function useSurveyResponses(surveyId: string | undefined) {
    return useQuery({
        queryKey: ["survey-responses", surveyId],
        queryFn: () => fetchSurveyResponses(surveyId!),
        enabled: !!surveyId,
        staleTime: 30_000,
    });
}
