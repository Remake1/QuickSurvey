import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import type { SurveyResponse, Answer } from "@/features/survey/api/surveys.api";
import type { Question, OptionsQuestion } from "@quicksurvey/shared/schemas/question.schema";
import { DataTable } from "@/shared/components/ui/data-table.tsx";

interface ResponsesTableProps {
    responses: SurveyResponse[];
    questions: Question[];
}

function isOptionsQuestion(q: Question): q is OptionsQuestion {
    return q.type === "multiple_choice" || q.type === "checkboxes" || q.type === "dropdown";
}

function formatAnswerValue(answer: Answer | undefined, question: Question): string {
    if (!answer) return "—";

    switch (answer.type) {
        case "short_answer":
        case "paragraph":
            return answer.textValue ?? "—";
        case "multiple_choice":
        case "dropdown": {
            const optionId = answer.choiceValue;
            if (!optionId || !isOptionsQuestion(question)) return "—";
            const option = question.options.find((o) => o.id === optionId);
            return option?.text ?? optionId;
        }
        case "checkboxes": {
            const optionIds = answer.checkboxValues;
            if (!optionIds?.length || !isOptionsQuestion(question)) return "—";
            const optionTexts = optionIds.map((id) => {
                const option = question.options.find((o) => o.id === id);
                return option?.text ?? id;
            });
            return optionTexts.join(", ");
        }
        case "date":
            return answer.dateValue ?? "—";
        case "linear_scale":
            return answer.scaleValue?.toString() ?? "—";
        default:
            return "—";
    }
}

export function ResponsesTable({ responses, questions }: ResponsesTableProps) {
    const columns = useMemo<ColumnDef<SurveyResponse>[]>(() => {
        // Base columns
        const baseColumns: ColumnDef<SurveyResponse>[] = [
            {
                accessorKey: "id",
                header: "Response ID",
                cell: ({ row }) => {
                    const id = row.getValue("id") as string;
                    return <span className="font-mono text-xs">{id.slice(0, 8)}…</span>;
                },
            },
            {
                accessorKey: "createdAt",
                header: "Submitted At",
                cell: ({ row }) => {
                    const date = row.getValue("createdAt") as Date;
                    return (
                        <span className="text-sm">
                            {date.toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </span>
                    );
                },
            },
        ];

        // Dynamic columns for each question
        const questionColumns: ColumnDef<SurveyResponse>[] = questions.map((question) => ({
            id: `question_${question.id}`,
            header: () => (
                <span className="max-w-50 truncate block" title={question.title}>
                    {question.title}
                </span>
            ),
            cell: ({ row }) => {
                const answer = row.original.answers.find((a) => a.questionId === question.id);
                const value = formatAnswerValue(answer, question);
                return (
                    <span className="max-w-50 truncate block text-sm" title={value}>
                        {value}
                    </span>
                );
            },
        }));

        return [...baseColumns, ...questionColumns];
    }, [questions]);

    return <DataTable columns={columns} data={responses} />;
}
