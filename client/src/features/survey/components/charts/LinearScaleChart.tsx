import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend,
} from "chart.js";
import type { SurveyResponse } from "@/features/survey/api/surveys.api";
import type { LinearScaleQuestion } from "@quicksurvey/shared/schemas/question.schema";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface LinearScaleChartProps {
    question: LinearScaleQuestion;
    responses: SurveyResponse[];
}

export function LinearScaleChart({ question, responses }: LinearScaleChartProps) {
    // Collect all scale values
    const scaleValues: number[] = [];
    const valueCounts = new Map<number, number>();

    // Initialize counts for all possible values
    for (let i = question.min; i <= question.max; i++) {
        valueCounts.set(i, 0);
    }

    responses.forEach((response) => {
        const answer = response.answers.find((a) => a.questionId === question.id);
        if (answer?.scaleValue !== undefined && answer.scaleValue !== null) {
            scaleValues.push(answer.scaleValue);
            valueCounts.set(answer.scaleValue, (valueCounts.get(answer.scaleValue) ?? 0) + 1);
        }
    });

    // Calculate statistics
    const totalResponses = scaleValues.length;
    const average = totalResponses > 0
        ? scaleValues.reduce((sum, val) => sum + val, 0) / totalResponses
        : 0;

    const sortedValues = [...scaleValues].sort((a, b) => a - b);
    const median = totalResponses > 0
        ? totalResponses % 2 === 0
            ? (sortedValues[totalResponses / 2 - 1] + sortedValues[totalResponses / 2]) / 2
            : sortedValues[Math.floor(totalResponses / 2)]
        : 0;

    // Prepare chart data
    const labels: string[] = [];
    const data: number[] = [];

    for (let i = question.min; i <= question.max; i++) {
        // Use labels if provided for min/max
        if (i === question.min && question.minLabel) {
            labels.push(`${i} (${question.minLabel})`);
        } else if (i === question.max && question.maxLabel) {
            labels.push(`${i} (${question.maxLabel})`);
        } else {
            labels.push(String(i));
        }
        data.push(valueCounts.get(i) ?? 0);
    }

    const chartData = {
        labels,
        datasets: [
            {
                label: "Responses",
                data,
                backgroundColor: "rgba(59, 130, 246, 0.8)",
                borderColor: "rgba(59, 130, 246, 1)",
                borderWidth: 1,
                borderRadius: 4,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: (context: { raw: unknown }) => {
                        const value = context.raw as number;
                        const percentage = totalResponses > 0
                            ? ((value / totalResponses) * 100).toFixed(1)
                            : 0;
                        return `${value} responses (${percentage}%)`;
                    },
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1,
                },
            },
        },
    };

    return (
        <div className="space-y-4">
            <h3 className="font-medium text-lg">{question.title}</h3>
            <p className="text-sm text-muted-foreground">
                Linear Scale ({question.min} - {question.max})
            </p>

            {/* Statistics */}
            <div className="flex gap-6">
                <div className="bg-muted/50 rounded-lg p-4 text-center">
                    <p className="text-sm text-muted-foreground">Average</p>
                    <p className="text-2xl font-bold">{average.toFixed(2)}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4 text-center">
                    <p className="text-sm text-muted-foreground">Median</p>
                    <p className="text-2xl font-bold">{median.toFixed(2)}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4 text-center">
                    <p className="text-sm text-muted-foreground">Responses</p>
                    <p className="text-2xl font-bold">{totalResponses}</p>
                </div>
            </div>

            {/* Bar chart */}
            <div className="max-w-2xl">
                <Bar data={chartData} options={options} />
            </div>
        </div>
    );
}
