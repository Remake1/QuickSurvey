import { Button } from '@/shared/components/ui/button.tsx';
import { Plus } from 'lucide-react';
import { QuestionEditor } from './QuestionEditor.tsx';
import type { Question } from '@quicksurvey/shared/schemas/question.schema.ts';

type Props = {
    questions: Question[];
    onChange: (questions: Question[]) => void;
};

function createEmptyQuestion(): Question {
    return {
        id: crypto.randomUUID(),
        type: 'short_answer',
        title: '',
        required: false,
    };
}

export function QuestionsList({ questions, onChange }: Props) {
    const addQuestion = () => {
        onChange([...questions, createEmptyQuestion()]);
    };

    const updateQuestion = (index: number, question: Question) => {
        const updated = [...questions];
        updated[index] = question;
        onChange(updated);
    };

    const removeQuestion = (index: number) => {
        onChange(questions.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Questions</h3>
                <Button type="button" variant="outline" onClick={addQuestion}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add question
                </Button>
            </div>

            {questions.length === 0 && (
                <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
                    No questions yet. Click "Add question" to get started.
                </div>
            )}

            <div className="space-y-4">
                {questions.map((question, index) => (
                    <QuestionEditor
                        key={question.id}
                        question={question}
                        index={index}
                        onChange={(q) => updateQuestion(index, q)}
                        onRemove={() => removeQuestion(index)}
                    />
                ))}
            </div>
        </div>
    );
}
