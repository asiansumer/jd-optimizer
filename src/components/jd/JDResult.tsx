'use client';

import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Textarea } from '@/shared/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Copy, Edit3, Save, Download, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

interface JDResultProps {
  jd: {
    id?: number;
    title: string;
    content: string;
    generated?: {
      requirements?: string[];
      responsibilities?: string[];
      benefits?: string[];
    };
  };
  onEdit?: (id: number, data: { title: string; content: string }) => Promise<void>;
  onSave?: (data: { title: string; content: string }) => Promise<number>;
  onBack?: () => void;
  isSaving?: boolean;
}

export function JDResult({ jd, onEdit, onSave, onBack, isSaving }: JDResultProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(jd.title);
  const [editedContent, setEditedContent] = useState(jd.content);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(editedContent);
      toast.success('JD copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy JD');
    }
  };

  const handleDownload = () => {
    const blob = new Blob([editedContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${editedTitle.replace(/\s+/g, '_')}_JD.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('JD downloaded successfully');
  };

  const handleSave = async () => {
    try {
      if (onSave) {
        await onSave({
          title: editedTitle,
          content: editedContent,
        });
        toast.success('JD saved successfully');
        setIsEditing(false);
      }
    } catch (error) {
      toast.error('Failed to save JD');
    }
  };

  const handleUpdate = async () => {
    try {
      if (onEdit && jd.id) {
        await onEdit(jd.id, {
          title: editedTitle,
          content: editedContent,
        });
        toast.success('JD updated successfully');
        setIsEditing(false);
      }
    } catch (error) {
      toast.error('Failed to update JD');
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing - revert changes
      setEditedTitle(jd.title);
      setEditedContent(jd.content);
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {onBack && (
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <div>
            <h2 className="text-2xl font-bold">Generated Job Description</h2>
            <p className="text-muted-foreground">
              {isEditing ? 'Editing mode' : 'Review and customize your JD'}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {!isEditing && (
            <>
              <Button variant="outline" size="icon" onClick={handleCopy} title="Copy to clipboard">
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleDownload} title="Download as file">
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleEditToggle} title="Edit JD">
                <Edit3 className="h-4 w-4" />
              </Button>
            </>
          )}
          {isEditing && (
            <>
              <Button variant="outline" onClick={handleEditToggle}>
                Cancel
              </Button>
              <Button onClick={jd.id ? handleUpdate : handleSave} disabled={isSaving}>
                {isSaving ? (
                  'Saving...'
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {jd.id ? 'Update' : 'Save'}
                  </>
                )}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {isEditing ? (
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="text-2xl font-bold bg-transparent border-b-2 border-input focus:outline-none focus:border-primary w-full"
              />
            ) : (
              <span>{editedTitle}</span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <Textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="min-h-[500px] font-mono text-sm"
              placeholder="Edit your JD content here..."
            />
          ) : (
            <Tabs defaultValue="full" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="full">Full JD</TabsTrigger>
                <TabsTrigger value="requirements">Requirements</TabsTrigger>
                <TabsTrigger value="responsibilities">Responsibilities</TabsTrigger>
                <TabsTrigger value="benefits">Benefits</TabsTrigger>
              </TabsList>

              <TabsContent value="full" className="mt-4">
                <div className="prose prose-sm max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-base leading-relaxed">
                    {editedContent}
                  </pre>
                </div>
              </TabsContent>

              {jd.generated?.requirements && (
                <TabsContent value="requirements" className="mt-4">
                  <div className="space-y-3">
                    {jd.generated.requirements.map((req, index) => (
                      <div key={index} className="flex gap-2 items-start">
                        <Badge variant="outline" className="mt-0.5">
                          {index + 1}
                        </Badge>
                        <span className="text-sm">{req}</span>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              )}

              {jd.generated?.responsibilities && (
                <TabsContent value="responsibilities" className="mt-4">
                  <div className="space-y-3">
                    {jd.generated.responsibilities.map((resp, index) => (
                      <div key={index} className="flex gap-2 items-start">
                        <Badge variant="outline" className="mt-0.5">
                          {index + 1}
                        </Badge>
                        <span className="text-sm">{resp}</span>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              )}

              {jd.generated?.benefits && (
                <TabsContent value="benefits" className="mt-4">
                  <div className="space-y-3">
                    {jd.generated.benefits.map((benefit, index) => (
                      <div key={index} className="flex gap-2 items-start">
                        <Badge variant="secondary" className="mt-0.5">
                          {index + 1}
                        </Badge>
                        <span className="text-sm">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              )}
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
