'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';

const jdFormSchema = z.object({
  position: z.string().min(1, 'Position is required'),
  techStack: z.array(z.string()).min(1, 'At least one technology is required'),
  salaryRange: z.string().optional(),
  experience: z.string().optional(),
  templateId: z.string().optional(),
});

export type JDFormData = z.infer<typeof jdFormSchema>;

interface JDFormProps {
  onSubmit: (data: JDFormData) => void;
  isLoading?: boolean;
}

export function JDForm({ onSubmit, isLoading }: JDFormProps) {
  const [techInput, setTechInput] = useState('');
  const [techStack, setTechStack] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<JDFormData>({
    resolver: zodResolver(jdFormSchema),
    defaultValues: {
      position: '',
      techStack: [],
      salaryRange: '',
      experience: '',
      templateId: '',
    },
  });

  const addTech = () => {
    const trimmed = techInput.trim();
    if (trimmed && !techStack.includes(trimmed)) {
      const newTechStack = [...techStack, trimmed];
      setTechStack(newTechStack);
      setValue('techStack', newTechStack);
      setTechInput('');
    }
  };

  const removeTech = (tech: string) => {
    const newTechStack = techStack.filter((t) => t !== tech);
    setTechStack(newTechStack);
    setValue('techStack', newTechStack);
  };

  const handleTechInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTech();
    }
  };

  const onFormSubmit = (data: JDFormData) => {
    onSubmit({
      ...data,
      techStack,
    });
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* Position */}
      <div className="space-y-2">
        <Label htmlFor="position">
          Position Title <span className="text-destructive">*</span>
        </Label>
        <Input
          id="position"
          placeholder="e.g., Senior Frontend Developer"
          {...register('position')}
        />
        {errors.position && (
          <p className="text-sm text-destructive">{errors.position.message}</p>
        )}
      </div>

      {/* Tech Stack */}
      <div className="space-y-2">
        <Label>
          Tech Stack <span className="text-destructive">*</span>
        </Label>
        <div className="flex gap-2">
          <Input
            placeholder="e.g., React, TypeScript"
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            onKeyDown={handleTechInputKeyDown}
          />
          <Button type="button" onClick={addTech} variant="outline" size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {errors.techStack && (
          <p className="text-sm text-destructive">{errors.techStack.message}</p>
        )}
        <div className="flex flex-wrap gap-2">
          {techStack.map((tech) => (
            <Badge key={tech} variant="secondary" className="gap-1">
              {tech}
              <button
                type="button"
                onClick={() => removeTech(tech)}
                className="hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      {/* Experience Level */}
      <div className="space-y-2">
        <Label htmlFor="experience">Experience Level</Label>
        <Select
          onValueChange={(value) => setValue('experience', value)}
          value={watch('experience')}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select experience level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="entry">Entry Level (0-2 years)</SelectItem>
            <SelectItem value="mid">Mid Level (2-5 years)</SelectItem>
            <SelectItem value="senior">Senior Level (5-10 years)</SelectItem>
            <SelectItem value="lead">Team Lead (10+ years)</SelectItem>
            <SelectItem value="executive">Executive (15+ years)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Salary Range */}
      <div className="space-y-2">
        <Label htmlFor="salaryRange">Salary Range</Label>
        <Input
          id="salaryRange"
          placeholder="e.g., $80,000 - $120,000"
          {...register('salaryRange')}
        />
      </div>

      {/* Template */}
      <div className="space-y-2">
        <Label htmlFor="template">Template (Optional)</Label>
        <Select
          onValueChange={(value) => setValue('templateId', value)}
          value={watch('templateId')}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a template" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tech">Tech Startup</SelectItem>
            <SelectItem value="enterprise">Enterprise</SelectItem>
            <SelectItem value="remote">Remote-First</SelectItem>
            <SelectItem value="consulting">Consulting Firm</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Generating JD...' : 'Generate Job Description'}
      </Button>
    </form>
  );
}
