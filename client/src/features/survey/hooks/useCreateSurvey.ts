import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createSurvey } from '@/features/survey/api/surveys.api.ts';

export function useCreateSurvey() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createSurvey,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-surveys'] });
        },
    });
}
