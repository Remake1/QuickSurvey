import {SurveyCard} from "@/features/survey/components/SurveyCard.tsx";
import { type SurveyListItem } from '@quicksurvey/shared/schemas/survey.schema.ts';

type Props = {
    surveys: SurveyListItem[];
};

export default function SurveyList({ surveys }: Props) {
    return (
        <>
            {surveys.map((survey) => (
                <SurveyCard
                    key={survey.id}
                    survey={survey}
                />
            ))}
        </>
    )
}
