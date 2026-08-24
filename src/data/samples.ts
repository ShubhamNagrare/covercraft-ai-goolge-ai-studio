export interface SampleProfile {
  id: string;
  title: string;
  category: string;
  candidateName: string;
  email: string;
  phone: string;
  location: string;
  links: string;
  resumeText: string;
  sampleJob: {
    jobTitle: string;
    companyName: string;
    recipientName: string;
    jobDescriptionText: string;
    recommendedTemplateId: string;
  };
}

export const SAMPLE_PROFILES: SampleProfile[] = [
  {
    id: 'sample-swe',
    title: 'Senior Full-Stack / Cloud Engineer',
    category: 'Engineering',
    candidateName: 'Alex Mercer',
    email: 'alex.mercer.dev@example.com',
    phone: '+1 (415) 890-2341',
    location: 'San Francisco, CA',
    links: 'github.com/alexmercer • linkedin.com/in/alexmercer',
    resumeText: `ALEX MERCER
San Francisco, CA | alex.mercer.dev@example.com | +1 (415) 890-2341 | github.com/alexmercer | linkedin.com/in/alexmercer

PROFESSIONAL SUMMARY
Senior Software Engineer with 6+ years of experience architecting distributed backend services, high-concurrency microservices, and modern React/TypeScript frontends. Proven track record reducing API latency by 45%, scaling platforms to 3M+ active monthly users, and leading cross-functional engineering pods.

CORE TECHNICAL SKILLS
- Languages: TypeScript, JavaScript, Python, Go, SQL
- Frontend: React 19, Next.js, Tailwind CSS, Redux Toolkit, WebSockets
- Backend & Cloud: Node.js, Express, FastAPI, PostgreSQL, Redis, AWS (ECS, Lambda, S3, RDS), Docker, Kubernetes, CI/CD (GitHub Actions)
- System Design: Event-driven architecture, REST/GraphQL APIs, Kafka, Microservices, Caching strategies

WORK EXPERIENCE

Senior Software Engineer | CloudScale Technologies (San Francisco, CA) | 2022 - Present
- Architected and deployed a multi-tenant microservices architecture handling 15M+ daily requests with 99.98% uptime.
- Optimized PostgreSQL queries and implemented Redis multi-tier caching, slashing 95th percentile API response latency from 320ms to 48ms (85% reduction).
- Spearheaded the frontend migration to React with TypeScript, improving Core Web Vitals score from 68 to 96 and reducing client bundle size by 38%.
- Mentored 5 junior and mid-level engineers, instituted automated linting and PR review standards that reduced production regression tickets by 30%.

Full-Stack Software Engineer | FinLeap Solutions (San Francisco, CA) | 2019 - 2022
- Built automated payment reconciliation workflows processing $12M+ monthly transaction volume with zero discrepancy.
- Designed real-time websocket analytics dashboard for fraud detection used by 120+ internal risk analysts.
- Automated deployment pipelines using Docker and AWS ECS, cutting deployment release cycle time from 4 hours to 12 minutes.

EDUCATION
Bachelor of Science in Computer Science | University of California, Berkeley (2015 - 2019)
- Dean's Honors List | Focus on Distributed Systems & Database Design`,
    sampleJob: {
      jobTitle: 'Senior Full-Stack Engineer (Core Platform)',
      companyName: 'Stripe / Vercel Ecosystem',
      recipientName: 'Platform Engineering Team',
      recommendedTemplateId: 'eng-modern',
      jobDescriptionText: `About the Role:
We are looking for a Senior Full-Stack Engineer to join our Core Platform team. In this role, you will design, build, and scale resilient microservices and high-performance web applications that power payments, developer tools, and real-time dashboards for thousands of businesses worldwide.

Key Responsibilities:
- Design and scale distributed backend APIs and frontend user experiences in TypeScript, React, Node.js, and cloud infrastructure.
- Lead architectural decisions for database scaling (PostgreSQL, Redis) and low-latency API design.
- Collaborate with product managers, designers, and infrastructure teams to deliver high-velocity features.
- Champion engineering excellence, automated testing, CI/CD, and system reliability (99.99% availability).

Requirements:
- 5+ years of experience building modern full-stack web applications at scale.
- Deep proficiency in TypeScript, React, Node.js, and relational databases (PostgreSQL).
- Strong background in cloud platforms (AWS/GCP), containerization (Docker, Kubernetes), and caching (Redis).
- Proven track record optimizing performance, reducing latency, and mentoring engineering peers.`,
    },
  },
  {
    id: 'sample-pm',
    title: 'Lead Product Manager',
    category: 'Product',
    candidateName: 'Elena Rostova',
    email: 'elena.rostova.pm@example.com',
    phone: '+1 (646) 432-8765',
    location: 'New York, NY',
    links: 'linkedin.com/in/elenarostova • medium.com/@elenapm',
    resumeText: `ELENA ROSTOVA
New York, NY | elena.rostova.pm@example.com | +1 (646) 432-8765 | linkedin.com/in/elenarostova

PROFESSIONAL SUMMARY
Data-driven Senior Product Manager with 7 years of experience taking B2B SaaS and consumer tech products from zero-to-one and scaling them past $25M ARR. Expert in user research, continuous discovery, hypothesis testing, and cross-functional leadership across engineering, design, and GTM teams.

CORE COMPETENCIES
- Product Strategy: 0-to-1 Discovery, Product-Led Growth (PLG), Roadmap prioritization (RICE, Kano), Market analysis
- Analytics & Tech: Mixpanel, Amplitude, SQL, Tableau, Figma, Jira, Postman, A/B testing
- Leadership: Agile/Scrum ceremonies, Stakeholder management, Pricing & packaging, Customer Advisory Boards

EXPERIENCE

Senior Product Manager | Veloce SaaS (New York, NY) | 2021 - Present
- Led product strategy and roadmap for core onboarding and collaboration features, boosting 30-day user retention by 28% and driving $8.4M in new Annual Recurring Revenue (ARR).
- Executed 40+ user interviews and iterative A/B testing experiments, leading to a redesigned self-serve checkout funnel that increased conversion by 34%.
- Managed a pod of 9 engineers, 2 product designers, and 1 dedicated data scientist across 2-week agile sprints.

Product Manager | Omnichannel Media (New York, NY) | 2018 - 2021
- Launched AI-powered recommendation engine for enterprise clients, increasing weekly active engagement by 42%.
- Partnered with marketing and enterprise sales to overhaul pricing tiers, increasing Average Revenue Per User (ARPU) by 22%.

EDUCATION
B.S. in Management Information Systems & Business Economics | New York University (NYU Stern)`,
    sampleJob: {
      jobTitle: 'Principal / Group Product Manager',
      companyName: 'Notion / Miro Group',
      recipientName: 'VP of Product',
      recommendedTemplateId: 'product-impact',
      jobDescriptionText: `Position: Group Product Manager - Growth & Self-Serve
Location: New York / Remote

We are seeking an experienced Product Manager to own our Growth & Self-Serve Product pillar. You will lead the team responsible for user acquisition, seamless self-serve onboarding, and in-product collaboration viral loops.

What You'll Do:
- Define product vision and OKRs for the self-serve funnel and PLG product experience.
- Conduct continuous quantitative analysis (SQL, Amplitude) and qualitative research to uncover growth opportunities.
- Partner with engineering, design, and marketing to test, ship, and iterate on high-leverage product bets.
- Build and scale features that directly expand ARR and customer lifetime value.

Qualifications:
- 6+ years in product management with proven experience in B2B SaaS or Product-Led Growth.
- Strong technical fluency, ability to write SQL, and comfort analyzing complex conversion funnels.
- Exceptional track record driving measurable retention and revenue improvements.`,
    },
  },
  {
    id: 'sample-marketing',
    title: 'Director of Growth & Performance Marketing',
    category: 'Marketing',
    candidateName: 'Marcus Vance',
    email: 'marcus.vance.growth@example.com',
    phone: '+1 (312) 555-0199',
    location: 'Chicago, IL',
    links: 'linkedin.com/in/marcusvance • marcusgrowth.io',
    resumeText: `MARCUS VANCE
Chicago, IL | marcus.vance.growth@example.com | +1 (312) 555-0199 | linkedin.com/in/marcusvance

PROFESSIONAL SUMMARY
Growth & Performance Marketing Leader with 8+ years managing $5M+ annual paid acquisition budgets across Google, Meta, TikTok, LinkedIn, and programmatic channels. Proven expertise in reducing Blended CAC by 35% while scaling customer acquisition 3x.

CORE SKILLS
- Acquisition: Google Ads, Meta Ads Manager, LinkedIn Campaign Manager, Programmatic DSPs, SEO, Content Marketing
- Analytics & Attribution: Google Analytics 4, Segment, Looker, Triple Whale, Multi-touch attribution modeling
- CRO & Automation: Webflow, Optimizely, HubSpot, Klaviyo, Zapier, Funnel optimization

EXPERIENCE
Head of Growth Marketing | Apex Digital Brands (Chicago, IL) | 2021 - Present
- Scaled quarterly paid media spend from $400k to $1.8M profitably, maintaining a ROAS of 3.8x.
- Implemented comprehensive landing page personalization and A/B testing program, lifting site conversion rate from 2.1% to 4.4%.
- Overhauled email lifecycle automation flows (Klaviyo), generating $3.2M in incremental repeat revenue (a 55% YoY increase).

Growth Marketing Manager | ScaleUp Direct (Chicago, IL) | 2017 - 2021
- Managed paid search and paid social campaigns resulting in 180,000+ new verified user signups.
- Reduced overall customer acquisition cost (CAC) by 32% through rigorous creative iteration and bid strategy optimization.

EDUCATION
B.A. in Marketing & Data Analytics | Northwestern University`,
    sampleJob: {
      jobTitle: 'Head of Growth Marketing',
      companyName: 'FastTrack Fintech',
      recipientName: 'Chief Marketing Officer',
      recommendedTemplateId: 'marketing-conversion',
      jobDescriptionText: `Role: Head of Growth Marketing
Company: FastTrack Fintech
Location: Chicago, IL / Hybrid

We are searching for a high-performing Head of Growth to spearhead our paid acquisition, organic growth, and conversion rate optimization strategies.

Key Responsibilities:
- Manage multi-million dollar annual performance marketing budget across search, social, and affiliate channels.
- Build attribution models to understand customer journeys and optimize blended CAC and LTV/CAC ratios.
- Drive rapid creative testing cycles with in-house design and copywriting teams.
- Lead retention and lifecycle marketing to maximize subscriber engagement.

Requirements:
- 7+ years of experience in growth marketing with direct hands-on paid media management.
- Strong analytical chops (SQL, GA4, Looker) and deep experience in CRO.
- History of scaling customer acquisition while maintaining profitability.`,
    },
  },
];
