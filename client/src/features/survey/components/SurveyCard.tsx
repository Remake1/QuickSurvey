import { type SurveyListItem } from '@quicksurvey/shared/schemas/survey.schema.ts';
import { Link } from 'react-router';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import {
    Calendar,
    ExternalLink,
    MessageCircleQuestionMark,
    Pencil,
} from "lucide-react";

function formatTimeAgo(date: Date): string {
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    const intervals = [
        { label: 'year', seconds: 31536000 },
        { label: 'month', seconds: 2592000 },
        { label: 'week', seconds: 604800 },
        { label: 'day', seconds: 86400 },
        { label: 'hour', seconds: 3600 },
        { label: 'minute', seconds: 60 },
    ];

    for (const interval of intervals) {
        const count = Math.floor(seconds / interval.seconds);
        if (count >= 1) {
            return `${count} ${interval.label}${count !== 1 ? 's' : ''} ago`;
        }
    }

    return 'just now';
}

interface SurveyCardProps {
    survey: SurveyListItem;
}

export function SurveyCard({ survey }: SurveyCardProps) {
    const statusVariant = survey.status === 'PUBLISHED' ? 'default' : 'secondary';
    const statusLabel = survey.status === 'PUBLISHED' ? 'Published' : 'Draft';
    const isPublished = survey.status === 'PUBLISHED';

    return (
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
                {isPublished && (
                    <Button variant="outline" size="sm" asChild>
                        <Link to={`/s/${survey.id}`}>
                            <ExternalLink className="h-4 w-4" />
                            Public Link
                        </Link>
                    </Button>
                )}
                <Button variant="outline" size="sm" asChild>
                    <Link to={`/survey/${survey.id}/edit`}>
                        <Pencil className="h-4 w-4" />
                        Edit
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
