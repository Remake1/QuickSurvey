import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchPublicSurvey, submitSurveyResponse } from "../api/publicSurvey.api.ts";
import type { SubmitResponseDto } from "@quicksurvey/shared/schemas/response.schema.ts";

export function usePublicSurvey(id: string | undefined) {
    const surveyQuery = useQuery({
        queryKey: ["publicSurvey", id],
        queryFn: () => fetchPublicSurvey(id!),
        enabled: !!id,
    });

    const submitMutation = useMutation({
        mutationFn: (input: { surveyId: string; answers: SubmitResponseDto["answers"] }) =>
            submitSurveyResponse(input as SubmitResponseDto),
    });

    return {
        survey: surveyQuery.data,
        isLoading: surveyQuery.isLoading,
        error: surveyQuery.error,
        submitResponse: submitMutation.mutate,
        isSubmitting: submitMutation.isPending,
        isSubmitSuccess: submitMutation.isSuccess,
        submitError: submitMutation.error,
    };
}
