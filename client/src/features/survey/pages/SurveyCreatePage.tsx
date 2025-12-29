import { useNavigate } from 'react-router';
import { useCreateSurvey } from '@/features/survey/hooks/useCreateSurvey.ts';
import { SurveyBuilderForm } from '@/features/survey/components/builder/SurveyBuilderForm.tsx';
import type { CreateSurveyDto } from '@quicksurvey/shared/schemas/survey.schema.ts';

export default function SurveyCreatePage() {
    const navigate = useNavigate();
    const createSurvey = useCreateSurvey();

    const handleSubmit = (data: CreateSurveyDto) => {
        createSurvey.mutate(data, {
            onSuccess: () => {
                navigate('/surveys');
            },
        });
    };

    return (
        <div className="container mx-auto py-8 px-4 max-w-3xl">
            <h1 className="text-2xl font-bold mb-6">Create New Survey</h1>

            {createSurvey.isError && (
                <div className="mb-6 p-4 bg-destructive/10 border border-destructive text-destructive rounded-lg">
                    {createSurvey.error?.message ?? 'Failed to create survey'}
                </div>
            )}

            <SurveyBuilderForm
                onSubmit={handleSubmit}
                isSubmitting={createSurvey.isPending}
            />
        </div>
    );
}
