import { Button } from '@/shared/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

interface HeroProps {
  locale?: string;
}

export default function Hero({ locale = 'en' }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/20 py-20 sm:py-32">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center rounded-full border bg-background/50 px-4 py-2 text-sm backdrop-blur-sm">
            <Sparkles className="mr-2 h-4 w-4 text-primary" />
            <span className="font-medium">AI-Powered Job Description Generator</span>
          </div>

          <h1 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Create Perfect{' '}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Job Descriptions
            </span>{' '}
            in Seconds
          </h1>

          <p className="mb-8 max-w-2xl text-lg text-muted-foreground sm:text-xl md:text-2xl">
            Transform your hiring process with AI-generated, professionally crafted job
            descriptions that attract top talent.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" className="text-base" asChild>
              <a href="/generator">
                Start Generating Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
            <Button size="lg" variant="outline" className="text-base" asChild>
              <a href="#features">View Features</a>
            </Button>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">10K+</div>
              <div className="text-sm text-muted-foreground">Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">50K+</div>
              <div className="text-sm text-muted-foreground">JDs Generated</div>
            </div>
            <div className="text-center col-span-2 sm:col-span-1">
              <div className="text-3xl font-bold text-primary">98%</div>
              <div className="text-sm text-muted-foreground">Satisfaction</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
