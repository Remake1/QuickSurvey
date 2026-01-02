import { Pie } from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from "chart.js";
import type { SurveyResponse } from "@/features/survey/api/surveys.api";
import type { MultipleChoiceQuestion, CheckboxesQuestion, DropdownQuestion } from "@quicksurvey/shared/schemas/question.schema";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/components/ui/table";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

type OptionsQuestion = MultipleChoiceQuestion | CheckboxesQuestion | DropdownQuestion;

interface MultipleChoiceChartProps {
    question: OptionsQuestion;
    responses: SurveyResponse[];
}

// Color palette for pie chart
const CHART_COLORS = [
    "rgba(59, 130, 246, 0.8)",   // blue
    "rgba(16, 185, 129, 0.8)",   // green
    "rgba(245, 158, 11, 0.8)",   // amber
    "rgba(239, 68, 68, 0.8)",    // red
    "rgba(139, 92, 246, 0.8)",   // violet
    "rgba(236, 72, 153, 0.8)",   // pink
    "rgba(6, 182, 212, 0.8)",    // cyan
    "rgba(249, 115, 22, 0.8)",   // orange
];

const CHART_BORDER_COLORS = [
    "rgba(59, 130, 246, 1)",
    "rgba(16, 185, 129, 1)",
    "rgba(245, 158, 11, 1)",
    "rgba(239, 68, 68, 1)",
    "rgba(139, 92, 246, 1)",
    "rgba(236, 72, 153, 1)",
    "rgba(6, 182, 212, 1)",
    "rgba(249, 115, 22, 1)",
];

export function MultipleChoiceChart({ question, responses }: MultipleChoiceChartProps) {
    // Count responses for each option
    const optionCounts = new Map<string, number>();
    question.options.forEach((option) => optionCounts.set(option.id, 0));

    responses.forEach((response) => {
        const answer = response.answers.find((a) => a.questionId === question.id);
        if (!answer) return;

        if (question.type === "checkboxes" && answer.checkboxValues) {
            // For checkboxes, count each selected option
            answer.checkboxValues.forEach((optionId) => {
                optionCounts.set(optionId, (optionCounts.get(optionId) ?? 0) + 1);
            });
        } else if (answer.choiceValue) {
            // For single choice (multiple_choice, dropdown)
            optionCounts.set(answer.choiceValue, (optionCounts.get(answer.choiceValue) ?? 0) + 1);
        }
    });

    const labels = question.options.map((opt) => opt.text);
    const data = question.options.map((opt) => optionCounts.get(opt.id) ?? 0);
    const total = data.reduce((sum, count) => sum + count, 0);

    const chartData = {
        labels,
        datasets: [
            {
                data,
                backgroundColor: CHART_COLORS.slice(0, labels.length),
                borderColor: CHART_BORDER_COLORS.slice(0, labels.length),
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "right" as const,
            },
            tooltip: {
                callbacks: {
                    label: (context: { label?: string; raw: unknown }) => {
                        const value = context.raw as number;
                        const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                        return `${context.label}: ${value} (${percentage}%)`;
                    },
                },
            },
        },
    };

    return (
        <div className="space-y-4">
            <h3 className="font-medium text-lg">{question.title}</h3>
            <p className="text-sm text-muted-foreground capitalize">
                {question.type.replace("_", " ")}
            </p>

            <div className="flex flex-col lg:flex-row gap-6 items-start">
                <div className="w-full lg:w-1/2 max-w-md">
                    <Pie data={chartData} options={options} />
                </div>

                <div className="w-full lg:w-1/2">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Option</TableHead>
                                <TableHead className="text-right">Count</TableHead>
                                <TableHead className="text-right">Percentage</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {question.options.map((option, index) => {
                                const count = optionCounts.get(option.id) ?? 0;
                                const percentage = total > 0 ? ((count / total) * 100).toFixed(1) : "0.0";
                                return (
                                    <TableRow key={option.id}>
                                        <TableCell className="flex items-center gap-2">
                                            <span
                                                className="w-3 h-3 rounded-full"
                                                style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                                            />
                                            {option.text}
                                        </TableCell>
                                        <TableCell className="text-right">{count}</TableCell>
                                        <TableCell className="text-right">{percentage}%</TableCell>
                                    </TableRow>
                                );
                            })}
                            <TableRow className="font-medium">
                                <TableCell>Total</TableCell>
                                <TableCell className="text-right">{total}</TableCell>
                                <TableCell className="text-right">100%</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
