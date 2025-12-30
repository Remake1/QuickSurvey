import { useState } from 'react';
import { type SurveyListItem } from '@quicksurvey/shared/schemas/survey.schema.ts';
import { Link } from 'react-router';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import {
  Calendar,
  MessageCircleQuestionMark,
  Globe,
  GlobeLock,
  Link2,
  MessagesSquare,
} from "lucide-react";
import { usePublishSurvey } from '@/features/survey/hooks/usePublishSurvey.ts';
import { useUnpublishSurvey } from '@/features/survey/hooks/useUnpublishSurvey.ts';
import { PublishSurveyDialog } from './PublishSurveyDialog.tsx';
import { UnpublishSurveyDialog } from './UnpublishSurveyDialog.tsx';
import { formatTimeAgo } from '@/shared/lib/utils.ts'

interface SurveyCardProps {
    survey: SurveyListItem;
}

export function SurveyCard({ survey }: SurveyCardProps) {
    const [publishDialogOpen, setPublishDialogOpen] = useState(false);
    const [unpublishDialogOpen, setUnpublishDialogOpen] = useState(false);

    const publishMutation = usePublishSurvey();
    const unpublishMutation = useUnpublishSurvey();

    const statusVariant = survey.status === 'PUBLISHED' ? 'default' : 'secondary';
    const statusLabel = survey.status === 'PUBLISHED' ? 'Published' : 'Draft';
    const isPublished = survey.status === 'PUBLISHED';

    const handlePublish = () => {
        publishMutation.mutate(survey.id, {
            onSuccess: () => {
                setPublishDialogOpen(false);
            },
        });
    };

    const handleUnpublish = () => {
        unpublishMutation.mutate(survey.id, {
            onSuccess: () => {
                setUnpublishDialogOpen(false);
            },
        });
    };

    return (
        <>
            <Card className="transition-shadow hover:shadow-md">
                <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                        <CardTitle className="line-clamp-2">{survey.title}</CardTitle>
                        <Badge variant={statusVariant}>{statusLabel}</Badge>
                    </div>
                    {survey.description && (
                        <CardDescription className="line-clamp-2">
                            {survey.description}
                        </CardDescription>
                    )}
                </CardHeader>
                <CardContent className="flex-1 text-muted-foreground text-sm">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5">
                            <MessageCircleQuestionMark className="h-4 w-4" />
                            <span>{survey.questionCount} question{survey.questionCount !== 1 ? 's' : ''}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Calendar className="h-4 w-4" />
                            <span>Created {formatTimeAgo(survey.createdAt)}</span>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="mt-auto gap-2">
                    {isPublished ? (
                        <>
                            <Button variant="outline" size="sm" asChild>
                                <Link to={`/s/${survey.id}`}>
                                    <Link2 className="h-4 w-4" />
                                    {/*Public Link*/}
                                </Link>
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setUnpublishDialogOpen(true)}
                            >
                                <GlobeLock className="h-4 w-4" />
                                Unpublish
                            </Button>
                        </>
                    ) : (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPublishDialogOpen(true)}
                        >
                            <Globe className="h-4 w-4" />
                            Publish
                        </Button>
                    )}
                    {/*<Button variant="outline" size="sm" asChild>*/}
                    {/*    <Link to={`/survey/${survey.id}/edit`}>*/}
                    {/*        <Pencil className="h-4 w-4" />*/}
                    {/*        Edit*/}
                    {/*    </Link>*/}
                    {/*</Button>*/}
                    <Button variant="outline" size="sm" asChild>
                        <Link to={`/survey/${survey.id}/responses`}>
                            <MessagesSquare className="h-4 w-4" />
                            Responses
                        </Link>
                    </Button>
                </CardFooter>
            </Card>

            <PublishSurveyDialog
                open={publishDialogOpen}
                onOpenChange={setPublishDialogOpen}
                onConfirm={handlePublish}
                isLoading={publishMutation.isPending}
                surveyTitle={survey.title}
            />

            <UnpublishSurveyDialog
                open={unpublishDialogOpen}
                onOpenChange={setUnpublishDialogOpen}
                onConfirm={handleUnpublish}
                isLoading={unpublishMutation.isPending}
                surveyTitle={survey.title}
            />
        </>
    );
}
