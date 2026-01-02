import type { SurveyResponse, Answer } from "@/features/survey/api/surveys.api";
import type { Question, MultipleChoiceQuestion, CheckboxesQuestion, DropdownQuestion } from "@quicksurvey/shared/schemas/question.schema";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/shared/components/ui/dialog";
import { Separator } from "@/shared/components/ui/separator";

interface ResponseDetailDialogProps {
    response: SurveyResponse | null;
    questions: Question[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

type OptionsQuestion = MultipleChoiceQuestion | CheckboxesQuestion | DropdownQuestion;

function isOptionsQuestion(q: Question): q is OptionsQuestion {
    return q.type === "multiple_choice" || q.type === "checkboxes" || q.type === "dropdown";
}

function formatAnswerValue(answer: Answer | undefined, question: Question): string {
    if (!answer) return "No answer";

    switch (answer.type) {
        case "short_answer":
        case "paragraph":
            return answer.textValue ?? "No answer";
        case "multiple_choice":
        case "dropdown": {
            const optionId = answer.choiceValue;
            if (!optionId || !isOptionsQuestion(question)) return "No answer";
            const option = question.options.find((o) => o.id === optionId);
            return option?.text ?? optionId;
        }
        case "checkboxes": {
            const optionIds = answer.checkboxValues;
            if (!optionIds?.length || !isOptionsQuestion(question)) return "No answer";
            const optionTexts = optionIds.map((id) => {
                const option = question.options.find((o) => o.id === id);
                return option?.text ?? id;
            });
            return optionTexts.join(", ");
        }
        case "date":
            return answer.dateValue ?? "No answer";
        case "linear_scale":
            return answer.scaleValue?.toString() ?? "No answer";
        default:
            return "No answer";
    }
}

function getQuestionTypeLabel(type: string): string {
    const labels: Record<string, string> = {
        short_answer: "Short Answer",
        paragraph: "Paragraph",
        multiple_choice: "Multiple Choice",
        checkboxes: "Checkboxes",
        dropdown: "Dropdown",
        date: "Date",
        linear_scale: "Linear Scale",
    };
    return labels[type] ?? type;
}

export function ResponseDetailDialog({
    response,
    questions,
    open,
    onOpenChange,
}: ResponseDetailDialogProps) {
    if (!response) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Response Details</DialogTitle>
                    <p className="text-sm text-muted-foreground">
                        Submitted on{" "}
                        {response.createdAt.toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </p>
                </DialogHeader>
                <Separator />
                <div className="space-y-6 py-4">
                    {questions.map((question) => {
                        const answer = response.answers.find(
                            (a) => a.questionId === question.id
                        );
                        const value = formatAnswerValue(answer, question);

                        return (
                            <div key={question.id} className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-medium">{question.title}</h3>
                                    {question.required && (
                                        <span className="text-xs text-destructive">*</span>
                                    )}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {getQuestionTypeLabel(question.type)}
                                </p>
                                <p className="text-sm bg-muted/50 p-3 rounded-md whitespace-pre-wrap">
                                    {value}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </DialogContent>
        </Dialog>
    );
}
