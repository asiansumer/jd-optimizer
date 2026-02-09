'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Calendar, MapPin, DollarSign, Briefcase, Trash2, Edit, RotateCcw, Eye } from 'lucide-react';

interface JobDescription {
  id: string;
  title: string;
  company?: string;
  location?: string;
  salary?: string;
  workType?: string;
  experience?: string;
  content: string;
  keywords?: string[];
  techStack?: string[];
  createdAt: string;
}

interface JDCardProps {
  jobDescription: JobDescription;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onRegenerate?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function JDCard({
  jobDescription,
  onView,
  onEdit,
  onRegenerate,
  onDelete,
}: JDCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    if (diffDays <= 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card className="group hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg truncate">{jobDescription.title}</CardTitle>
            {jobDescription.company && (
              <CardDescription className="mt-1">{jobDescription.company}</CardDescription>
            )}
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {onView && (
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onView(jobDescription.id)} title="View">
                <Eye className="h-4 w-4" />
              </Button>
            )}
            {onEdit && (
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(jobDescription.id)} title="Edit">
                <Edit className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-3">
          {jobDescription.location && (
            <Badge variant="outline" className="gap-1 text-xs">
              <MapPin className="h-3 w-3" />
              {jobDescription.location}
            </Badge>
          )}
          {jobDescription.salary && (
            <Badge variant="outline" className="gap-1 text-xs">
              <DollarSign className="h-3 w-3" />
              {jobDescription.salary}
            </Badge>
          )}
          {jobDescription.workType && (
            <Badge variant="secondary" className="text-xs">{jobDescription.workType}</Badge>
          )}
          {jobDescription.experience && (
            <Badge variant="secondary" className="text-xs">{jobDescription.experience}</Badge>
          )}
        </div>

        <div className="text-xs text-muted-foreground flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          {formatDate(jobDescription.createdAt)}
        </div>

        <div className="mt-3 line-clamp-3 text-sm text-muted-foreground">
          {jobDescription.content.replace(/<[^>]*>/g, '').slice(0, 150)}...
        </div>

        {(jobDescription.keywords && jobDescription.keywords.length > 0 ||
          jobDescription.techStack && jobDescription.techStack.length > 0) && (
          <div className="mt-3 pt-3 border-t">
            <div className="flex flex-wrap gap-1">
              {jobDescription.keywords?.slice(0, 3).map((keyword) => (
                <Badge key={keyword} variant="outline" className="text-xs py-0 px-2">
                  {keyword}
                </Badge>
              ))}
              {(jobDescription.keywords?.length || 0) > 3 && (
                <Badge variant="outline" className="text-xs py-0 px-2">
                  +{jobDescription.keywords!.length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="gap-2">
        {onRegenerate && (
          <Button variant="outline" size="sm" className="flex-1" onClick={() => onRegenerate(jobDescription.id)}>
            <RotateCcw className="mr-2 h-3 w-3" />
            Regenerate
          </Button>
        )}
        {onDelete && (
          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => onDelete(jobDescription.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
