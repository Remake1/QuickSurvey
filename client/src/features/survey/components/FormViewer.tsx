import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/shared/components/ui/button.tsx";
import { QuestionRenderer } from "./QuestionRenderer.tsx";
import type { Question } from "@quicksurvey/shared/schemas/question.schema.ts";
import { useEffect } from "react";
import { useSurveyResponseStore } from "../store/surveyResponse.store.ts";

// Generate a Zod schema dynamically based on the questions
const createSurveySchema = (questions: Question[]) => {
    const shape: Record<string, z.ZodTypeAny> = {};

    questions.forEach((q) => {
        let fieldSchema: z.ZodTypeAny;

        switch (q.type) {
            case "checkboxes":
                fieldSchema = z.array(z.string());
                break;
            case "linear_scale":
                fieldSchema = z.number();
                break;
            default:
                fieldSchema = z.string();
        }

        if (q.required) {
            if (q.type === "checkboxes") {
                fieldSchema = (fieldSchema as z.ZodArray<z.ZodString>).min(1, "This field is required");
            } else if (q.type === "linear_scale") {
                // number is already required by default in zod unless optional() is called
            } else {
                fieldSchema = (fieldSchema as z.ZodString).min(1, "This field is required");
            }
        } else {
            fieldSchema = fieldSchema.optional();
        }

        shape[q.id] = fieldSchema;
    });

    return z.object(shape);
};

type Props = {
    surveyId: string;
    questions: Question[];
    onSubmit: (data: Record<string, unknown>) => void;
    defaultValues?: Record<string, unknown>;
    isSubmitting?: boolean;
};

export function FormViewer({ surveyId, questions, onSubmit, defaultValues, isSubmitting }: Props) {
    const schema = createSurveySchema(questions);

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: defaultValues || {},
    });

    // Watch all fields to persist to store
    const watchedValues = form.watch();
    const saveResponse = useSurveyResponseStore((state) => state.saveResponse);

    useEffect(() => {
        saveResponse(surveyId, watchedValues);
    }, [watchedValues, surveyId, saveResponse]);

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-6">
                {questions.map((question) => (
                    <div key={question.id} className="p-6 bg-card rounded-lg border shadow-sm">
                        <QuestionRenderer question={question} control={form.control} />
                    </div>
                ))}
            </div>

            <div className="flex justify-end">
                <Button type="submit" size="lg" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit"}
                </Button>
            </div>
        </form>
    );
}
