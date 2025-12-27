import { Card, CardContent, CardHeader } from '@/shared/components/ui/card.tsx';
import { Input } from '@/shared/components/ui/input.tsx';
import { Checkbox } from '@/shared/components/ui/checkbox.tsx';
import { Button } from '@/shared/components/ui/button.tsx';
import { Label } from '@/shared/components/ui/label.tsx';
import { Trash2 } from 'lucide-react';
import { QuestionTypeSelector } from './QuestionTypeSelector.tsx';
import { OptionsEditor } from './OptionsEditor.tsx';
import type { Question, QuestionType, Option } from '@quicksurvey/shared/schemas/question.schema.ts';

type Props = {
    question: Question;
    index: number;
    onChange: (question: Question) => void;
    onRemove: () => void;
};

const OPTION_BASED_TYPES: QuestionType[] = ['multiple_choice', 'checkboxes', 'dropdown'];

function createDefaultQuestion(type: QuestionType, base: Question): Question {
    const baseFields = {
        id: base.id,
        title: base.title,
        required: base.required,
    };

    if (OPTION_BASED_TYPES.includes(type)) {
        const hasOptions = 'options' in base && base.options;
        return {
            ...baseFields,
            type,
            options: hasOptions ? base.options : [{ id: crypto.randomUUID(), text: '' }],
        } as Question;
    }

    if (type === 'linear_scale') {
        return {
            ...baseFields,
            type: 'linear_scale',
            min: 1,
            max: 5,
            minLabel: '',
            maxLabel: '',
        };
    }

    return { ...baseFields, type } as Question;
}

export function QuestionEditor({ question, index, onChange, onRemove }: Props) {
    const handleTypeChange = (type: QuestionType) => {
        onChange(createDefaultQuestion(type, question));
    };

    const handleTitleChange = (title: string) => {
        onChange({ ...question, title });
    };

    const handleRequiredChange = (required: boolean) => {
        onChange({ ...question, required });
    };

    const handleOptionsChange = (options: Option[]) => {
        if ('options' in question) {
            onChange({ ...question, options });
        }
    };

    const handleScaleChange = (field: 'min' | 'max' | 'minLabel' | 'maxLabel', value: string | number) => {
        if (question.type === 'linear_scale') {
            onChange({ ...question, [field]: value });
        }
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between py-3 px-4">
                <span className="text-sm font-medium text-muted-foreground">Question {index + 1}</span>
                <div className="flex items-center gap-2">
                    <QuestionTypeSelector value={question.type} onChange={handleTypeChange} />
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={onRemove}
                        className="text-destructive hover:text-destructive"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor={`question-${question.id}-title`}>Question title</Label>
                    <Input
                        id={`question-${question.id}-title`}
                        value={question.title}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        placeholder="Enter your question"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <Checkbox
                        id={`question-${question.id}-required`}
                        checked={question.required}
                        onCheckedChange={handleRequiredChange}
                    />
                    <Label htmlFor={`question-${question.id}-required`} className="cursor-pointer">
                        Required
                    </Label>
                </div>

                {OPTION_BASED_TYPES.includes(question.type) && 'options' in question && (
                    <OptionsEditor options={question.options} onChange={handleOptionsChange} />
                )}

                {question.type === 'linear_scale' && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor={`question-${question.id}-min`}>Min value</Label>
                                <Input
                                    id={`question-${question.id}-min`}
                                    type="number"
                                    min={0}
                                    max={1}
                                    value={question.min}
                                    onChange={(e) => handleScaleChange('min', Number(e.target.value))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor={`question-${question.id}-max`}>Max value</Label>
                                <Input
                                    id={`question-${question.id}-max`}
                                    type="number"
                                    min={2}
                                    max={10}
                                    value={question.max}
                                    onChange={(e) => handleScaleChange('max', Number(e.target.value))}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor={`question-${question.id}-minLabel`}>Min label (optional)</Label>
                                <Input
                                    id={`question-${question.id}-minLabel`}
                                    value={question.minLabel ?? ''}
                                    onChange={(e) => handleScaleChange('minLabel', e.target.value)}
                                    placeholder="e.g. Not satisfied"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor={`question-${question.id}-maxLabel`}>Max label (optional)</Label>
                                <Input
                                    id={`question-${question.id}-maxLabel`}
                                    value={question.maxLabel ?? ''}
                                    onChange={(e) => handleScaleChange('maxLabel', e.target.value)}
                                    placeholder="e.g. Very satisfied"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
