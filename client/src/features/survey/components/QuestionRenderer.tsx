import type { Control } from "react-hook-form";
import type { Question } from "@quicksurvey/shared/schemas/question.schema.ts";

import { ShortAnswerQuestionField } from "./questions/ShortAnswerQuestion.tsx";
import { ParagraphQuestionField } from "./questions/ParagraphQuestion.tsx";
import { MultipleChoiceQuestionField } from "./questions/MultipleChoiceQuestion.tsx";
import { CheckboxesQuestionField } from "./questions/CheckboxesQuestion.tsx";
import { DropdownQuestionField } from "./questions/DropdownQuestion.tsx";
import { DateQuestionField } from "./questions/DateQuestion.tsx";
import { LinearScaleQuestionField } from "./questions/LinearScaleQuestion.tsx";

type Props = {
    question: Question;
    control: Control<any>; // Using any here because the form shape is dynamic
};

export function QuestionRenderer({ question, control }: Props) {
    switch (question.type) {
        case "short_answer":
            return <ShortAnswerQuestionField question={question} control={control} />;
        case "paragraph":
            return <ParagraphQuestionField question={question} control={control} />;
        case "multiple_choice":
            return <MultipleChoiceQuestionField question={question} control={control} />;
        case "checkboxes":
            return <CheckboxesQuestionField question={question} control={control} />;
        case "dropdown":
            return <DropdownQuestionField question={question} control={control} />;
        case "date":
            return <DateQuestionField question={question} control={control} />;
        case "linear_scale":
            return <LinearScaleQuestionField question={question} control={control} />;
        default:
            return <p className="text-destructive">Unknown question type: {(question as any).type}</p>;
    }
}
