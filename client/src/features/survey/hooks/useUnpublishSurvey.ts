import { useMutation, useQueryClient } from '@tanstack/react-query';
import { unpublishSurvey } from '@/features/survey/api/surveys.api.ts';

export function useUnpublishSurvey() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: unpublishSurvey,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-surveys'] });
        },
    });
}
