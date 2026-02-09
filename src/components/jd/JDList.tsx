'use client';

import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { MoreHorizontal, Eye, Trash2, Calendar, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface JD {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

interface JDListProps {
  jds: JD[];
  loading?: boolean;
  onView?: (jd: JD) => void;
  onDelete?: (id: number) => Promise<void>;
  onCreateNew?: () => void;
}

export function JDList({ jds, loading, onView, onDelete, onCreateNew }: JDListProps) {
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this JD?')) {
      return;
    }

    try {
      setDeletingId(id);
      if (onDelete) {
        await onDelete(id);
        toast.success('JD deleted successfully');
      }
    } catch (error) {
      toast.error('Failed to delete JD');
    } finally {
      setDeletingId(null);
    }
  };

  const getPreviewText = (content: string, maxLength = 150) => {
    return content.length > maxLength
      ? content.substring(0, maxLength) + '...'
      : content;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-muted rounded w-3/4" />
            </CardHeader>
            <CardContent>
              <div className="h-4 bg-muted rounded w-full mb-2" />
              <div className="h-4 bg-muted rounded w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (jds.length === 0) {
    return (
      <Card className="p-12 text-center">
        <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Job Descriptions Yet</h3>
        <p className="text-muted-foreground mb-6">
          Create your first job description to get started
        </p>
        {onCreateNew && (
          <Button onClick={onCreateNew}>
            Create Your First JD
          </Button>
        )}
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Your Job Descriptions</h2>
          <p className="text-muted-foreground">
            {jds.length} {jds.length === 1 ? 'JD' : 'JDs'} created
          </p>
        </div>
        {onCreateNew && (
          <Button onClick={onCreateNew}>
            Create New JD
          </Button>
        )}
      </div>

      <div className="grid gap-4">
        {jds.map((jd) => (
          <Card key={jd.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{jd.title}</CardTitle>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(jd.createdAt)}
                    </span>
                    {new Date(jd.updatedAt) > new Date(jd.createdAt) && (
                      <Badge variant="outline" className="text-xs">
                        Updated
                      </Badge>
                    )}
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {onView && (
                      <DropdownMenuItem onClick={() => onView(jd)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                    )}
                    {onDelete && (
                      <DropdownMenuItem
                        onClick={() => handleDelete(jd.id)}
                        className="text-destructive focus:text-destructive"
                        disabled={deletingId === jd.id}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        {deletingId === jd.id ? 'Deleting...' : 'Delete'}
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-3">
                {getPreviewText(jd.content)}
              </p>
            </CardContent>
            <CardFooter className="pt-3">
              <div className="flex gap-2">
                <Badge variant="secondary" className="text-xs">
                  {jd.content.split('\n').length} lines
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {Math.ceil(jd.content.length / 100)} chars
                </Badge>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
