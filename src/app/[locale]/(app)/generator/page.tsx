'use client';

import { useState, useEffect } from 'react';
import { JDForm, JDFormData } from '@/components/jd/JDForm';
import { JDPreview, JobDescription } from '@/components/jd/JDPreview';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { LogIn } from 'lucide-react';

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

export default function GeneratorPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [jobDescription, setJobDescription] = useState<JobDescription | null>(null);

  // Check authentication status
  useEffect(() => {
    // This would be replaced with actual auth check
    const authStatus = localStorage.getItem('isAuthenticated');
    setIsAuthenticated(!!authStatus);
  }, []);

  const handleGenerate = async (data: JDFormData) => {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const generatedJD: JobDescription = {
        id: Date.now().toString(),
        title: data.jobTitle,
        content: generateJDContent(data),
        keywords: data.jobKeywords,
        techStack: data.techStack,
        salary: `${data.salaryMin} - ${data.salaryMax}`,
        workType: data.workType,
        experience: data.experienceLevel,
        createdAt: new Date(),
      };

      setJobDescription(generatedJD);
      setIsLoading(false);
    }, 2000);
  };

  const generateJDContent = (data: JDFormData) => {
    return `
<h3>Position Overview</h3>
<p>We are looking for an exceptional ${data.jobTitle} to join our innovative team. This is an exciting opportunity for a ${data.experienceLevel}-level professional who is passionate about building exceptional products and delivering high-quality results.</p>

<h3>Key Responsibilities</h3>
<ul>
  <li>Lead and contribute to the development of cutting-edge solutions in the ${data.jobKeywords.join(', ')} space</li>
  <li>Collaborate with cross-functional teams to design and implement features</li>
  <li>Write clean, maintainable, and efficient code using ${data.techStack.join(', ')}</li>
  <li>Participate in code reviews and provide constructive feedback</li>
  <li>Mentor junior team members and contribute to team growth</li>
  <li>Identify and resolve technical issues and performance bottlenecks</li>
</ul>

<h3>Requirements</h3>
<ul>
  <li>3+ years of experience as a ${data.jobTitle}</li>
  <li>Strong proficiency in ${data.techStack.slice(0, 3).join(', ')}</li>
  <li>Experience with modern development practices and methodologies</li>
  <li>Excellent problem-solving and analytical skills</li>
  <li>Strong communication and collaboration abilities</li>
  <li>Bachelor's degree in Computer Science or related field (or equivalent experience)</li>
</ul>

<h3>Preferred Qualifications</h3>
<ul>
  <li>Experience with ${data.techStack.slice(3).join(', ') || 'additional technologies'}</li>
  <li>Familiarity with cloud platforms (AWS, GCP, Azure)</li>
  <li>Experience with agile development methodologies</li>
  <li>Knowledge of industry best practices and standards</li>
</ul>

<h3>What We Offer</h3>
<ul>
  <li>Competitive salary: ${data.salaryMin} - ${data.salaryMax}</li>
  <li>${data.workType === 'remote' ? 'Fully remote work' : data.workType === 'hybrid' ? 'Flexible hybrid schedule' : 'Modern office environment'}</li>
  <li>Comprehensive health and wellness benefits</li>
  <li>Professional development opportunities</li>
  <li>Dynamic and inclusive company culture</li>
  <li>State-of-the-art tools and equipment</li>
</ul>

<p>If you're passionate about ${data.jobKeywords[0] || 'technology'} and want to make a significant impact, we'd love to hear from you!</p>
    `.trim();
  };

  const handleExportPDF = () => {
    if (!jobDescription) return;

    // This would integrate with a PDF generation library
    alert('PDF export feature - would be integrated with a PDF library like jsPDF or react-pdf');
  };

  const handleExportMarkdown = () => {
    if (!jobDescription) return;

    const markdown = `# ${jobDescription.title}\n\n${jobDescription.content.replace(/<[^>]*>/g, '')}`;
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${jobDescription.title.replace(/\s+/g, '-').toLowerCase()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSaveToHistory = () => {
    if (!jobDescription) return;

    // This would save to a database
    const history = JSON.parse(localStorage.getItem('jdHistory') || '[]');
    history.unshift(jobDescription);
    localStorage.setItem('jdHistory', JSON.stringify(history.slice(0, 50))); // Keep last 50

    alert('Job description saved to history!');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/20">
        <Card className="max-w-md w-full mx-4">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Authentication Required</CardTitle>
            <p className="text-muted-foreground mt-2">
              Please sign in to access the Job Description Generator
            </p>
          </CardHeader>
          <CardContent className="text-center">
            <Button size="lg" className="w-full" asChild>
              <a href="/auth/signin">
                <LogIn className="mr-2 h-5 w-5" />
                Sign In to Continue
              </a>
            </Button>
            <p className="mt-4 text-sm text-muted-foreground">
              Don't have an account?{' '}
              <a href="/auth/signup" className="text-primary hover:underline">
                Sign up
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Job Description Generator</h1>
          <p className="text-muted-foreground mt-2">
            Create professional job descriptions powered by AI
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left Column - Form */}
          <div>
            <JDForm onSubmit={handleGenerate} isLoading={isLoading} />
          </div>

          {/* Right Column - Preview */}
          <div className="lg:sticky lg:top-4 h-fit">
            <JDPreview
              jobDescription={jobDescription}
              onExportPDF={handleExportPDF}
              onExportMarkdown={handleExportMarkdown}
              onSave={handleSaveToHistory}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
