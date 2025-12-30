import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Eye, MoreHorizontal, Clipboard } from "lucide-react";
import type { SurveyResponse, Answer } from "@/features/survey/api/surveys.api";
import type { Question, MultipleChoiceQuestion, CheckboxesQuestion, DropdownQuestion } from "@quicksurvey/shared/schemas/question.schema";
import { DataTable } from "@/shared/components/ui/data-table.tsx";
import { Button } from "@/shared/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { ResponseDetailDialog } from "./ResponseDetailDialog";

interface ResponsesTableProps {
    responses: SurveyResponse[];
    questions: Question[];
}

type OptionsQuestion = MultipleChoiceQuestion | CheckboxesQuestion | DropdownQuestion;

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
    const [selectedResponse, setSelectedResponse] = useState<SurveyResponse | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleViewResponse = (response: SurveyResponse) => {
        setSelectedResponse(response);
        setDialogOpen(true);
    };

    const columns = useMemo<ColumnDef<SurveyResponse>[]>(() => {
        // Actions column
        const actionsColumn: ColumnDef<SurveyResponse> = {
            id: "actions",
            header: "",
            cell: ({ row }) => {
                const response = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="min-w-48">
                            <DropdownMenuItem onClick={() => handleViewResponse(response)}>
                                <Eye className="h-4 w-4 mr-2" />
                                View full response
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => navigator.clipboard.writeText(response.id)}
                            >
                                <Clipboard className="h-4 w-4 mr-2" />
                                Copy response ID
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        };

        // Base columns
        const baseColumns: ColumnDef<SurveyResponse>[] = [
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

        return [actionsColumn, ...baseColumns, ...questionColumns];
    }, [questions]);

    return (
        <>
            <DataTable
                columns={columns}
                data={responses}
            />
            <ResponseDetailDialog
                response={selectedResponse}
                questions={questions}
                open={dialogOpen}
                onOpenChange={setDialogOpen}
            />
        </>
    );
}
