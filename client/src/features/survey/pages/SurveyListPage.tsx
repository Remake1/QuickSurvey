import { type SurveyListItem } from '@quicksurvey/shared/schemas/survey.schema.ts';
import { SurveyCard } from '../components/SurveyCard';

const mockSurveys: SurveyListItem[] = [
    {
        id: '1',
        title: 'Customer Satisfaction Survey',
        description: 'Help us improve our services by sharing your feedback about your recent experience.',
        status: 'PUBLISHED',
        questionCount: 10,
        createdAt: new Date('2025-12-15'),
    },
    {
        id: '2',
        title: 'Employee Engagement Survey 2025',
        description: null,
        status: 'DRAFT',
        questionCount: 25,
        createdAt: new Date('2025-12-20'),
    },
    {
        id: '3',
        title: 'Product Feedback Form',
        description: 'We value your opinion! Let us know what you think about our latest product release.',
        status: 'PUBLISHED',
        questionCount: 5,
        createdAt: new Date('2025-12-01'),
    },
];

export default function SurveyListPage() {
    return (
        <div className="container mx-auto py-8 px-4">
            <h1 className="text-2xl font-bold mb-6">My Surveys</h1>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {mockSurveys.map((survey) => (
                    <SurveyCard
                        key={survey.id}
                        survey={survey}
                    />
                ))}
            </div>
        </div>
    );
}
