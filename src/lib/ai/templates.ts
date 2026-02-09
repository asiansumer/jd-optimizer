/**
 * Predefined JD templates for different roles
 */

/**
 * Template metadata
 */
export interface JDTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  content: string;
}

/**
 * Predefined JD templates
 */
export const JD_TEMPLATES: JDTemplate[] = [
  {
    id: "react-dev",
    name: "React Developer",
    category: "frontend",
    description: "Modern React developer template with focus on hooks, TypeScript, and state management",
    content: `**Position Overview**
We are looking for a skilled React Developer to join our growing team. You will be responsible for building and maintaining user interface components using React.js concepts and workflows such as Redux, Flux, and Webpack. You will also be responsible for profiling and improving front-end performance and documenting our front-end codebase.

**What You'll Do**
- Build modern, reusable React components using TypeScript
- Collaborate with designers to implement pixel-perfect UI/UX
- Optimize components for maximum performance across devices and browsers
- Write clean, maintainable, and well-documented code
- Participate in code reviews and contribute to technical discussions
- Stay up-to-date with the latest React ecosystem and best practices

**What We're Looking For**
- 3+ years of experience with React.js and modern JavaScript
- Strong proficiency in TypeScript and modern CSS
- Experience with state management libraries (Redux, Zustand, Context API)
- Knowledge of responsive design and cross-browser compatibility
- Experience with testing frameworks (Jest, React Testing Library)
- Understanding of web performance optimization techniques
- Familiarity with Git and collaborative development workflows`
  },
  {
    id: "python-dev",
    name: "Python Developer",
    category: "backend",
    description: "Python backend developer template with focus on APIs, databases, and cloud services",
    content: `**Position Overview**
We are seeking a talented Python Developer to design, develop, and implement high-quality software solutions. You will work with our team to build scalable backend services, APIs, and data processing systems using Python and related technologies.

**What You'll Do**
- Design and implement RESTful APIs using modern Python frameworks
- Develop and maintain backend services and microservices
- Write efficient, scalable, and well-tested Python code
- Collaborate with frontend developers to integrate APIs
- Optimize database queries and improve system performance
- Participate in architectural design and technical planning

**What We're Looking For**
- 3+ years of experience with Python development
- Strong knowledge of Django, Flask, or FastAPI
- Experience with SQL and NoSQL databases (PostgreSQL, MongoDB, Redis)
- Understanding of microservices architecture
- Experience with cloud platforms (AWS, GCP, or Azure)
- Knowledge of containerization (Docker) and CI/CD pipelines
- Familiarity with testing frameworks and TDD practices`
  },
  {
    id: "fullstack-dev",
    name: "Full Stack Developer",
    category: "fullstack",
    description: "Full stack developer template with experience in both frontend and backend technologies",
    content: `**Position Overview**
We are looking for a versatile Full Stack Developer to join our team. You will work across the entire technology stack, from building responsive user interfaces to designing robust backend systems and APIs.

**What You'll Do**
- Design and develop both frontend and backend components
- Build RESTful APIs and integrate with third-party services
- Create responsive and accessible user interfaces
- Implement database schemas and optimize queries
- Participate in code reviews and architectural decisions
- Collaborate with cross-functional teams to deliver features

**What We're Looking For**
- 4+ years of full stack development experience
- Strong proficiency in JavaScript/TypeScript and one backend language (Python, Node.js, or Go)
- Experience with modern frontend frameworks (React, Vue, or Angular)
- Knowledge of backend frameworks and API design
- Experience with SQL and NoSQL databases
- Understanding of cloud platforms and deployment strategies
- Strong problem-solving and communication skills`
  },
  {
    id: "ui-ux-designer",
    name: "UI/UX Designer",
    category: "design",
    description: "UI/UX designer template with focus on user research, interface design, and prototyping",
    content: `**Position Overview**
We are seeking a creative UI/UX Designer to join our product team. You will be responsible for creating intuitive, accessible, and visually appealing user experiences across our digital products.

**What You'll Do**
- Conduct user research and analyze user feedback
- Create user personas, journey maps, and information architecture
- Design wireframes, prototypes, and high-fidelity mockups
- Collaborate with developers to implement designs
- Conduct usability testing and iterate on designs
- Maintain and evolve our design system

**What We're Looking For**
- 3+ years of UI/UX design experience
- Proficiency in design tools (Figma, Sketch, or Adobe XD)
- Strong understanding of design principles and typography
- Experience with user research methods and usability testing
- Knowledge of accessibility standards (WCAG)
- Portfolio demonstrating design process and problem-solving
- Excellent communication and presentation skills`
  },
  {
    id: "devops-engineer",
    name: "DevOps Engineer",
    category: "devops",
    description: "DevOps engineer template with focus on CI/CD, infrastructure, and automation",
    content: `**Position Overview**
We are looking for a skilled DevOps Engineer to help us build and maintain our infrastructure, deployment pipelines, and monitoring systems. You will work closely with development teams to ensure smooth and reliable software delivery.

**What You'll Do**
- Design and implement CI/CD pipelines
- Manage cloud infrastructure using Infrastructure as Code
- Automate deployment processes and system configurations
- Monitor system performance and implement improvements
- Ensure security best practices across infrastructure
- Troubleshoot production issues and optimize performance

**What We're Looking For**
- 3+ years of DevOps or SRE experience
- Strong knowledge of cloud platforms (AWS, GCP, or Azure)
- Experience with containerization and orchestration (Docker, Kubernetes)
- Proficiency in CI/CD tools (Jenkins, GitLab CI, GitHub Actions)
- Knowledge of Infrastructure as Code (Terraform, CloudFormation)
- Experience with monitoring and logging (Prometheus, Grafana, ELK)
- Strong scripting skills (Python, Bash, or Go)`
  },
  {
    id: "data-engineer",
    name: "Data Engineer",
    category: "data",
    description: "Data engineer template with focus on ETL pipelines, data warehousing, and analytics",
    content: `**Position Overview**
We are seeking a Data Engineer to design, build, and maintain our data infrastructure. You will work with large-scale data processing systems and enable data-driven decision making across the organization.

**What You'll Do**
- Design and implement ETL/ELT data pipelines
- Build and maintain data warehouses and data lakes
- Optimize data processing for performance and cost
- Ensure data quality and implement validation processes
- Collaborate with data scientists and analysts
- Document data architecture and pipelines

**What We're Looking For**
- 3+ years of data engineering experience
- Strong knowledge of SQL and database systems
- Experience with data processing frameworks (Spark, Airflow, dbt)
- Proficiency in Python or Scala
- Knowledge of cloud data platforms (Snowflake, BigQuery, Redshift)
- Experience with real-time data processing
- Understanding of data modeling and architecture`
  },
  {
    id: "mobile-dev-ios",
    name: "iOS Developer",
    category: "mobile",
    description: "iOS developer template with focus on Swift, SwiftUI, and Apple ecosystem",
    content: `**Position Overview**
We are looking for a talented iOS Developer to build and maintain our mobile applications. You will work with the latest iOS technologies to create seamless and engaging user experiences on Apple devices.

**What You'll Do**
- Develop iOS applications using Swift and SwiftUI
- Implement complex UI/UX following Apple's Human Interface Guidelines
- Integrate with RESTful APIs and third-party services
- Optimize app performance and ensure smooth animations
- Write unit and UI tests to maintain code quality
- Stay current with iOS platform updates and features

**What We're Looking For**
- 3+ years of iOS development experience
- Strong proficiency in Swift and SwiftUI
- Experience with UIKit and Apple's frameworks
- Knowledge of iOS app lifecycle and memory management
- Familiarity with Core Data, Combine, and async/await
- Experience with testing frameworks (XCTest)
- Portfolio of published iOS apps`
  },
  {
    id: "security-engineer",
    name: "Security Engineer",
    category: "security",
    description: "Security engineer template with focus on application security, threat analysis, and compliance",
    content: `**Position Overview**
We are seeking a Security Engineer to help us build and maintain secure systems. You will be responsible for identifying vulnerabilities, implementing security measures, and ensuring our products meet security standards.

**What You'll Do**
- Conduct security assessments and penetration testing
- Design and implement security controls and monitoring
- Review code for security vulnerabilities
- Respond to security incidents and conduct investigations
- Develop security policies and best practices
- Train development teams on security practices

**What We're Looking For**
- 3+ years of security engineering experience
- Strong knowledge of OWASP Top 10 and common vulnerabilities
- Experience with security testing tools and techniques
- Understanding of secure coding practices
- Knowledge of compliance frameworks (SOC 2, ISO 27001, GDPR)
- Strong analytical and problem-solving skills
- Security certifications (CISSP, CEH, or similar) are a plus`
  }
];

/**
 * Get template by ID
 */
export function getTemplateById(id: string): JDTemplate | undefined {
  return JD_TEMPLATES.find(template => template.id === id);
}

/**
 * Get templates by category
 */
export function getTemplatesByCategory(category: string): JDTemplate[] {
  return JD_TEMPLATES.filter(template => template.category === category);
}

/**
 * Get all template categories
 */
export function getTemplateCategories(): string[] {
  const categories = new Set(JD_TEMPLATES.map(template => template.category));
  return Array.from(categories).sort();
}

/**
 * Apply company information to template
 */
export function applyCompanyInfo(
  template: JDTemplate,
  companyInfo: {
    companyName?: string;
    industry?: string;
    companySize?: string;
    culture?: string;
    location?: string;
    remotePolicy?: string;
  }
): string {
  let content = template.content;

  // Add company introduction at the top
  if (companyInfo.companyName || companyInfo.industry) {
    const companyIntro = `**About ${companyInfo.companyName || 'Our Company'}${companyInfo.industry ? ` - ${companyInfo.industry}` : ''}**
${companyInfo.companySize ? `Company Size: ${companyInfo.companySize}` : ''}
${companyInfo.culture ? `Culture: ${companyInfo.culture}` : ''}

`;
    content = companyIntro + content;
  }

  // Add location/remote policy information
  if (companyInfo.location || companyInfo.remotePolicy) {
    const locationInfo = `\n**Location & Work Arrangement**
${companyInfo.location ? `Location: ${companyInfo.location}` : ''}
${companyInfo.remotePolicy ? `Work Arrangement: ${companyInfo.remotePolicy}` : ''}`;
    content += locationInfo;
  }

  return content;
}

/**
 * Get all templates
 */
export function getAllTemplates(): JDTemplate[] {
  return [...JD_TEMPLATES];
}
