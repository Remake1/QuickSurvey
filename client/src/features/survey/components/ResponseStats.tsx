import type { SurveyResponse } from "@/features/survey/api/surveys.api";
import type { Question, LinearScaleQuestion, MultipleChoiceQuestion, CheckboxesQuestion, DropdownQuestion } from "@quicksurvey/shared/schemas/question.schema";
import { MultipleChoiceChart } from "./charts/MultipleChoiceChart";
import { LinearScaleChart } from "./charts/LinearScaleChart";
import { Separator } from "@/shared/components/ui/separator";

interface ResponseStatsProps {
    responses: SurveyResponse[];
    questions: Question[];
}

type OptionsQuestion = MultipleChoiceQuestion | CheckboxesQuestion | DropdownQuestion;

function isOptionsQuestion(q: Question): q is OptionsQuestion {
    return q.type === "multiple_choice" || q.type === "checkboxes" || q.type === "dropdown";
}

function isLinearScaleQuestion(q: Question): q is LinearScaleQuestion {
    return q.type === "linear_scale";
}

export function ResponseStats({ responses, questions }: ResponseStatsProps) {
    // Filter questions to only those with charts (exclude text and date)
    const chartableQuestions = questions.filter(
        (q) => isOptionsQuestion(q) || isLinearScaleQuestion(q)
    );

    if (chartableQuestions.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground border rounded-md">
                No chartable questions in this survey.
                Only multiple choice, checkboxes, dropdown, and linear scale questions can be visualized.
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {chartableQuestions.map((question, index) => (
                <div key={question.id}>
                    {index > 0 && <Separator className="mb-8" />}

                    {isOptionsQuestion(question) && (
                        <MultipleChoiceChart
                            question={question}
                            responses={responses}
                        />
                    )}

                    {isLinearScaleQuestion(question) && (
                        <LinearScaleChart
                            question={question}
                            responses={responses}
                        />
                    )}
                </div>
            ))}
        </div>
    );
}
