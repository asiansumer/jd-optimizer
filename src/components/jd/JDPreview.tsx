'use client';

import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Separator } from '@/shared/components/ui/separator';
import { Badge } from '@/shared/components/ui/badge';
import { Download, Copy, Save, Calendar, MapPin, DollarSign, Briefcase } from 'lucide-react';

interface JobDescription {
  id?: string;
  title: string;
  company?: string;
  location?: string;
  salary?: string;
  workType?: string;
  experience?: string;
  content: string;
  keywords?: string[];
  techStack?: string[];
  createdAt?: Date;
}

export type { JobDescription };

interface JDPreviewProps {
  jobDescription: JobDescription | null;
  onExportPDF?: () => void;
  onExportMarkdown?: () => void;
  onSave?: () => void;
  isLoading?: boolean;
}

export default function JDPreview({
  jobDescription,
  onExportPDF,
  onExportMarkdown,
  onSave,
  isLoading = false,
}: JDPreviewProps) {
  if (isLoading) {
    return (
      <Card className="h-full min-h-[600px] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-4 text-muted-foreground">Generating job description...</p>
        </div>
      </Card>
    );
  }

  if (!jobDescription) {
    return (
      <Card className="h-full min-h-[600px] flex items-center justify-center">
        <div className="text-center">
          <Briefcase className="mx-auto h-16 w-16 text-muted-foreground/30" />
          <p className="mt-4 text-muted-foreground">
            Fill in the form and click generate to see the job description preview
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-2xl mb-2">{jobDescription.title}</CardTitle>
            {jobDescription.company && (
              <p className="text-muted-foreground mb-3">{jobDescription.company}</p>
            )}
            <div className="flex flex-wrap gap-2 mb-3">
              {jobDescription.location && (
                <Badge variant="outline" className="gap-1">
                  <MapPin className="h-3 w-3" />
                  {jobDescription.location}
                </Badge>
              )}
              {jobDescription.salary && (
                <Badge variant="outline" className="gap-1">
                  <DollarSign className="h-3 w-3" />
                  {jobDescription.salary}
                </Badge>
              )}
              {jobDescription.workType && (
                <Badge variant="secondary">{jobDescription.workType}</Badge>
              )}
              {jobDescription.experience && (
                <Badge variant="secondary">{jobDescription.experience}</Badge>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            {onSave && (
              <Button variant="outline" size="icon" onClick={onSave} title="Save to History">
                <Save className="h-4 w-4" />
              </Button>
            )}
            <Button variant="outline" size="icon" onClick={onExportPDF} title="Export as PDF">
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={onExportMarkdown} title="Export as Markdown">
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="flex-1 overflow-auto">
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <div dangerouslySetInnerHTML={{ __html: jobDescription.content }} />
        </div>

        {jobDescription.keywords && jobDescription.keywords.length > 0 && (
          <div className="mt-6 pt-6 border-t">
            <h4 className="text-sm font-semibold mb-3">Keywords</h4>
            <div className="flex flex-wrap gap-2">
              {jobDescription.keywords.map((keyword) => (
                <Badge key={keyword} variant="outline">
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {jobDescription.techStack && jobDescription.techStack.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-semibold mb-3">Tech Stack</h4>
            <div className="flex flex-wrap gap-2">
              {jobDescription.techStack.map((tech) => (
                <Badge key={tech} variant="secondary">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {jobDescription.createdAt && (
          <div className="mt-4 pt-4 border-t text-xs text-muted-foreground flex items-center gap-2">
            <Calendar className="h-3 w-3" />
            Created on {new Date(jobDescription.createdAt).toLocaleDateString()}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
