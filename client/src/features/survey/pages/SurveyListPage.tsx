import type { ShortAnswerQuestion, ParagraphQuestion, MultipleChoiceQuestion, CheckboxesQuestion, DropdownQuestion, DateQuestion, LinearScaleQuestion } from "@quicksurvey/shared/schemas/question.schema.ts";
import { useForm } from "react-hook-form";
import { ShortAnswerQuestionField } from "../components/questions/ShortAnswerQuestion.tsx";
import { ParagraphQuestion as ParagraphQuestionField } from "../components/questions/ParagraphQuestion.tsx";
import { MultipleChoiceQuestionField } from "../components/questions/MultipleChoiceQuestion.tsx";
import { CheckboxesQuestionField } from "../components/questions/CheckboxesQuestion.tsx";
import { DropdownQuestionField } from "../components/questions/DropdownQuestion.tsx";
import { DateQuestionField } from "../components/questions/DateQuestion.tsx";
import { LinearScaleQuestionField } from "../components/questions/LinearScaleQuestion.tsx";
import { Button } from "@/shared/components/ui/button.tsx";
import { FieldGroup } from "@/shared/components/ui/field.tsx";

// Mock data for testing
const mockShortAnswerQuestions: ShortAnswerQuestion[] = [
    {
        id: "q1",
        type: "short_answer",
        title: "What is your name?",
        required: true,
    },
    {
        id: "q2",
        type: "short_answer",
        title: "What is your favorite color?",
        required: false,
    },
];

const mockParagraphQuestions: ParagraphQuestion[] = [
    {
        id: "q3",
        type: "paragraph",
        title: "Describe your ideal vacation",
        required: false,
    },
    {
        id: "q4",
        type: "paragraph",
        title: "What are your career goals?",
        required: true,
    },
];

const mockMultipleChoiceQuestions: MultipleChoiceQuestion[] = [
    {
        id: "q5",
        type: "multiple_choice",
        title: "What is your preferred programming language?",
        required: true,
        options: [
            { id: "opt1", text: "TypeScript" },
            { id: "opt2", text: "Python" },
            { id: "opt3", text: "Go" },
            { id: "opt4", text: "Rust" },
        ],
    },
    {
        id: "q6",
        type: "multiple_choice",
        title: "How did you hear about us?",
        required: false,
        options: [
            { id: "opt5", text: "Social Media" },
            { id: "opt6", text: "Friend Referral" },
            { id: "opt7", text: "Search Engine" },
        ],
    },
];

const mockCheckboxesQuestions: CheckboxesQuestion[] = [
    {
        id: "q7",
        type: "checkboxes",
        title: "Which frameworks have you used?",
        required: true,
        options: [
            { id: "opt8", text: "React" },
            { id: "opt9", text: "Vue" },
            { id: "opt10", text: "Angular" },
            { id: "opt11", text: "Svelte" },
        ],
    },
    {
        id: "q8",
        type: "checkboxes",
        title: "Select your interests",
        required: false,
        options: [
            { id: "opt12", text: "Frontend" },
            { id: "opt13", text: "Backend" },
            { id: "opt14", text: "DevOps" },
            { id: "opt15", text: "AI/ML" },
        ],
    },
];

const mockDropdownQuestions: DropdownQuestion[] = [
    {
        id: "q9",
        type: "dropdown",
        title: "What is your experience level?",
        required: true,
        options: [
            { id: "opt16", text: "Beginner" },
            { id: "opt17", text: "Intermediate" },
            { id: "opt18", text: "Advanced" },
            { id: "opt19", text: "Expert" },
        ],
    },
    {
        id: "q10",
        type: "dropdown",
        title: "Preferred work environment",
        required: false,
        options: [
            { id: "opt20", text: "Remote" },
            { id: "opt21", text: "Office" },
            { id: "opt22", text: "Hybrid" },
        ],
    },
];

const mockDateQuestions: DateQuestion[] = [
    {
        id: "q11",
        type: "date",
        title: "When is your birthday?",
        required: true,
    },
    {
        id: "q12",
        type: "date",
        title: "Preferred start date",
        required: false,
    },
];

const mockLinearScaleQuestions: LinearScaleQuestion[] = [
    {
        id: "q13",
        type: "linear_scale",
        title: "How satisfied are you with our service?",
        required: true,
        min: 1,
        max: 5,
        minLabel: "Not satisfied",
        maxLabel: "Very satisfied",
    },
    {
        id: "q14",
        type: "linear_scale",
        title: "How likely are you to recommend us?",
        required: false,
        min: 0,
        max: 10,
        minLabel: "Not likely",
        maxLabel: "Very likely",
    },
];

export default function SurveyListPage() {
    const { control, handleSubmit } = useForm();

    const onSubmit = (data: Record<string, string>) => {
        console.log("Form submitted:", data);
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Survey Demo</h1>

            <form onSubmit={handleSubmit(onSubmit)}>
                <FieldGroup>
                    {mockShortAnswerQuestions.map((question) => (
                        <ShortAnswerQuestionField
                            key={question.id}
                            question={question}
                            control={control}
                        />
                    ))}
                    {mockParagraphQuestions.map((question) => (
                        <ParagraphQuestionField
                            key={question.id}
                            question={question}
                            control={control}
                        />
                    ))}
                    {mockMultipleChoiceQuestions.map((question) => (
                        <MultipleChoiceQuestionField
                            key={question.id}
                            question={question}
                            control={control}
                        />
                    ))}
                    {mockCheckboxesQuestions.map((question) => (
                        <CheckboxesQuestionField
                            key={question.id}
                            question={question}
                            control={control}
                        />
                    ))}
                    {mockDropdownQuestions.map((question) => (
                        <DropdownQuestionField
                            key={question.id}
                            question={question}
                            control={control}
                        />
                    ))}
                    {mockDateQuestions.map((question) => (
                        <DateQuestionField
                            key={question.id}
                            question={question}
                            control={control}
                        />
                    ))}
                    {mockLinearScaleQuestions.map((question) => (
                        <LinearScaleQuestionField
                            key={question.id}
                            question={question}
                            control={control}
                        />
                    ))}
                </FieldGroup>

                <Button type="submit" className="mt-6">
                    Submit
                </Button>
            </form>
        </div>
    );
}
