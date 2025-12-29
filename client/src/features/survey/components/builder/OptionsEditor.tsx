import { Button } from '@/shared/components/ui/button.tsx';
import { Input } from '@/shared/components/ui/input.tsx';
import { Trash2, Plus } from 'lucide-react';
import type { Option } from '@quicksurvey/shared/schemas/question.schema.ts';

type Props = {
    options: Option[];
    onChange: (options: Option[]) => void;
};

export function OptionsEditor({ options, onChange }: Props) {
    const addOption = () => {
        const newOption: Option = {
            id: crypto.randomUUID(),
            text: '',
        };
        onChange([...options, newOption]);
    };

    const updateOption = (id: string, text: string) => {
        onChange(options.map((opt) => (opt.id === id ? { ...opt, text } : opt)));
    };

    const removeOption = (id: string) => {
        if (options.length > 1) {
            onChange(options.filter((opt) => opt.id !== id));
        }
    };

    return (
        <div className="space-y-2">
            <label className="text-sm font-medium">Options</label>
            {options.map((option, index) => (
                <div key={option.id} className="flex items-center gap-2">
                    <span className="text-muted-foreground text-sm w-6">{index + 1}.</span>
                    <Input
                        value={option.text}
                        onChange={(e) => updateOption(option.id, e.target.value)}
                        placeholder={`Option ${index + 1}`}
                        className="flex-1"
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeOption(option.id)}
                        disabled={options.length <= 1}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={addOption}>
                <Plus className="h-4 w-4 mr-1" />
                Add option
            </Button>
        </div>
    );
}
