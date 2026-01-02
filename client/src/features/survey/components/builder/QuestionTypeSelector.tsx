import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/shared/components/ui/select.tsx';
import type { QuestionType } from '@quicksurvey/shared/schemas/question.schema.ts';

const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
    short_answer: 'Short Answer',
    paragraph: 'Paragraph',
    multiple_choice: 'Multiple Choice',
    checkboxes: 'Checkboxes',
    dropdown: 'Dropdown',
    date: 'Date',
    linear_scale: 'Linear Scale',
};

type Props = {
    value: QuestionType;
    onChange: (type: QuestionType) => void;
};

export function QuestionTypeSelector({ value, onChange }: Props) {
    return (
        <Select value={value} onValueChange={(v) => onChange(v as QuestionType)}>
            <SelectTrigger className="w-48">
                <SelectValue placeholder="Question type" />
            </SelectTrigger>
            <SelectContent>
                {(Object.keys(QUESTION_TYPE_LABELS) as QuestionType[]).map((type) => (
                    <SelectItem key={type} value={type}>
                        {QUESTION_TYPE_LABELS[type]}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
