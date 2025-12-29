import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/shared/components/ui/alert-dialog';

interface UnpublishSurveyDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    isLoading: boolean;
    surveyTitle: string;
}

export function UnpublishSurveyDialog({
    open,
    onOpenChange,
    onConfirm,
    isLoading,
    surveyTitle,
}: UnpublishSurveyDialogProps) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Unpublish Survey</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to unpublish "{surveyTitle}"? The
                        survey will no longer be accessible to respondents via
                        the public link.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirm}
                        disabled={isLoading}
                        variant="destructive"
                    >
                        {isLoading ? 'Unpublishing...' : 'Unpublish'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
