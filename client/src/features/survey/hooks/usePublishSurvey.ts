import { useMutation, useQueryClient } from '@tanstack/react-query';
import { publishSurvey } from '@/features/survey/api/surveys.api.ts';

export function usePublishSurvey() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: publishSurvey,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-surveys'] });
        },
    });
}
