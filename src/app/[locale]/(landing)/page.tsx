import { getTranslations, setRequestLocale } from 'next-intl/server';

import { Hero } from '@/components/ui/landing';
import { FeatureCard } from '@/components/ui/landing';
import { PricingCard } from '@/components/ui/landing';
import { Button } from '@/shared/components/ui/button';
import { Sparkles, Zap, Shield, Globe, ArrowRight, CheckCircle2, Star } from 'lucide-react';

export const revalidate = 3600;

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero locale={locale} />

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
              Everything You Need to Hire Better
            </h2>
            <p className="text-lg text-muted-foreground">
              Powerful features designed to streamline your recruitment process
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={Sparkles}
              title="AI-Powered Generation"
              description="Generate professional, tailored job descriptions in seconds using advanced AI technology."
            />
            <FeatureCard
              icon={Zap}
              title="Lightning Fast"
              description="Create comprehensive JDs in under 30 seconds, saving you hours of manual writing."
            />
            <FeatureCard
              icon={Shield}
              title="Industry Standard"
              description="Follows best practices and compliance guidelines for professional job postings."
            />
            <FeatureCard
              icon={Globe}
              title="Multi-Language Support"
              description="Generate job descriptions in multiple languages to reach global talent pools."
            />
            <FeatureCard
              icon={CheckCircle2}
              title="Quality Assured"
              description="Every JD is optimized for clarity, completeness, and candidate engagement."
            />
            <FeatureCard
              icon={Star}
              title="Customizable Templates"
              description="Tailor your job descriptions with custom sections, requirements, and company culture notes."
            />
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
              Trusted by Hiring Teams Worldwide
            </h2>
            <p className="text-lg text-muted-foreground">
              Join thousands of companies that have transformed their hiring process
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 text-center">
            <div>
              <div className="text-5xl font-bold text-primary mb-2">10,000+</div>
              <div className="text-muted-foreground">Active Users</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-primary mb-2">50,000+</div>
              <div className="text-muted-foreground">JDs Generated</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-primary mb-2">98%</div>
              <div className="text-muted-foreground">Satisfaction Rate</div>
            </div>
          </div>

          <div className="mt-16 flex justify-center gap-8 flex-wrap opacity-60">
            {['Acme Corp', 'TechFlow', 'InnovateLab', 'DataSystems', 'FutureTech'].map((company) => (
              <div key={company} className="text-xl font-semibold text-muted-foreground">
                {company}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-muted-foreground">
              Choose the plan that fits your hiring needs
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            <PricingCard
              title="Pay As You Go"
              price="$15"
              period="JD"
              description="Perfect for occasional hiring needs"
              features={[
                '1 Professional JD',
                'AI-powered generation',
                'Export to PDF/Markdown',
                'Basic customization',
                'Email support',
              ]}
              action={{
                label: 'Get Started',
                href: '/generator',
                variant: 'outline',
              }}
            />
            <PricingCard
              title="Professional"
              price="$39"
              period="JD"
              description="For companies with frequent hiring needs"
              features={[
                '3 Professional JDs',
                'All Pay As You Go features',
                'Advanced templates',
                'Priority support',
                'Company branding',
                'History management',
              ]}
              popular={true}
              action={{
                label: 'Get Started',
                href: '/generator',
              }}
            />
            <PricingCard
              title="Enterprise"
              price="$249"
              period="month"
              description="Unlimited access for high-volume hiring"
              features={[
                'Unlimited JDs',
                'All Professional features',
                'Custom integrations',
                'Team collaboration',
                'API access',
                'Dedicated account manager',
                'SLA guarantee',
              ]}
              action={{
                label: 'Contact Sales',
                href: '/contact',
                variant: 'outline',
              }}
            />
          </div>

          <div className="mt-12 text-center">
            <Button size="lg" variant="outline" asChild>
              <a href="/generator">
                Try Free Demo
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
              Ready to Transform Your Hiring?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Start generating professional job descriptions today. No credit card required.
            </p>
            <Button size="lg" className="text-lg px-8" asChild>
              <a href="/generator">
                Start Generating Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
