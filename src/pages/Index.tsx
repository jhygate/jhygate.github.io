import { Github, Linkedin, Mail } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import ExperienceCard from "@/components/ExperienceCard";
import ProjectCard from "@/components/ProjectCard";
import Footer from "@/components/Footer";

const Index = () => {
  const experiences = [
    {
      company: "Urban Jungle",
      role: "Full-Stack Software Engineer",
      dates: "Jun 2024 – Present",
      context:
        "Insurtech startup building consumer insurance products with complex pricing models, eligibility logic, and heavy third-party insurer and PCW integrations.",
      contributions: [
        "Built and shipped production insurance products across Angular/TypeScript frontends and Python/FastAPI backends.",
        "Implemented complex eligibility and pricing rules under regulatory and insurer constraints.",
        "Played a core engineering role on the Non-Standard Home product, expanding customer eligibility and reducing quote rejections.",
        "Integrated new products with multiple price comparison websites under strict external deadlines.",
        "Built the company's first internal claims management system, now live and used daily by operations teams.",
        "Worked closely with product, data, design, and insurance stakeholders to scope, ship, and support features.",
        "Took part in on-call rotation, monitored production systems, and resolved live issues post-launch.",
      ],
      techStack: [
        "Python",
        "FastAPI",
        "TypeScript",
        "Angular",
        "SQL",
        "Third-party APIs",
        "PCWs",
        "Production systems",
      ],
    },
    {
      company: "Skuuudle",
      role: "Software Engineer",
      dates: "Jun 2023 – Jun 2024",
      context:
        "Pricing intelligence platform built on large-scale web scraping and data processing, operating under high delivery pressure and legacy constraints.",
      contributions: [
        "Owned and maintained large-scale web scraping pipelines for major e-commerce platforms.",
        "Refactored legacy scraping systems, reducing request volume by ~50% and lowering operational costs.",
        "Designed and implemented a product matching system to improve pricing data accuracy.",
        "Handled brittle, inconsistent HTML and real-world data quality issues at scale.",
        "Delivered up to ~50 client reports per day while balancing speed, accuracy, and reliability.",
      ],
      techStack: [
        "Python",
        "Web scraping",
        "Data pipelines",
        "Legacy systems",
        "Cost optimisation",
        "Data quality",
      ],
    },
  ];

  const projects = [
    {
      name: "Loop-Pad",
      description: "Browser-based audio loop pedal built with the Web Audio API.",
      bullets: [
        "Real-time audio recording and looped playback in the browser.",
        "Automatic loop alignment and latency compensation.",
        "Built from scratch in TypeScript with a focus on performance and state management.",
      ],
      techStack: ["TypeScript", "Web Audio API"],
      githubUrl: "https://github.com/jhygate",
      projectUrl: "https://jackhygate.co.uk/looppad/",
    },
    {
      name: "CSS Museum",
      description: "A curated collection of reusable CSS concepts and patterns.",
      bullets: [
        "Visual reference for core CSS techniques and layout patterns.",
        "Focused on clarity, minimal examples, and long-term reuse.",
        "Built as a personal reference and teaching tool.",
      ],
      techStack: ["CSS", "HTML", "Frontend fundamentals"],
      githubUrl: "https://github.com/jhygate",
    },
    {
      name: "Git Commit Visualiser -TEST AGAIN",
      description: "A tool to visualise code changes over time as animated text diffs.",
      bullets: [
        "Plays back commits as animated edits to show how code evolves.",
        "Designed to improve understanding of code history and change impact.",
        "Focus on developer tooling and clarity.",
      ],
      techStack: ["TypeScript", "Git", "Developer tooling"],
      githubUrl: "https://github.com/jhygate",
    },
  ];

  const focusAreas = [
    "Production backend systems (Python, APIs, business logic)",
    "Frontend application development (TypeScript, Angular)",
    "Complex business rules, pricing, and eligibility logic",
    "Third-party integrations and live system ownership",
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-3xl py-16 sm:py-24 relative">
        {/* Intro Section */}
        <header className="mb-section animate-fade-in">
          <h1 className="text-2xl sm:text-3xl font-semibold text-foreground mb-1 tracking-tight">
            Jack Hygate
          </h1>
          <p className="text-base text-muted-foreground font-mono mb-6">
            Full-Stack Software Engineer
          </p>

          <p className="text-base text-foreground/90 leading-relaxed mb-6 max-w-2xl">
            A pragmatic full-stack software engineer with experience building and operating 
            production systems in insurtech and data-heavy environments. Comfortable working 
            across frontend, backend, data, and integrations, with a strong focus on clarity, 
            reliability, and shipping real products under real constraints.
          </p>

          <ul className="space-y-1.5 mb-6">
            {focusAreas.map((area, index) => (
              <li
                key={index}
                className="text-sm text-foreground/80 pl-4 relative before:content-['→'] before:absolute before:left-0 before:text-accent"
              >
                {area}
              </li>
            ))}
          </ul>

          <nav className="flex items-center gap-5">
            <a
              href="https://github.com/jhygate"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-accent transition-colors duration-150 flex items-center gap-1.5 text-sm"
            >
              <Github className="w-4 h-4" />
              <span>GitHub</span>
            </a>
            <a
              href="https://www.linkedin.com/in/jack-hygate/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-accent transition-colors duration-150 flex items-center gap-1.5 text-sm"
            >
              <Linkedin className="w-4 h-4" />
              <span>LinkedIn</span>
            </a>
            <a
              href="mailto:jhygate@gmail.com"
              className="text-muted-foreground hover:text-accent transition-colors duration-150 flex items-center gap-1.5 text-sm"
            >
              <Mail className="w-4 h-4" />
              <span>Email</span>
            </a>
          </nav>
        </header>

        {/* Experience Section */}
        <section className="mb-section" style={{ animationDelay: "100ms" }}>
          <SectionHeader id="experience">Experience</SectionHeader>
          <div className="space-y-12">
            {experiences.map((exp) => (
              <ExperienceCard key={exp.company} {...exp} />
            ))}
          </div>
        </section>

        {/* Projects Section */}
        <section className="mb-section" style={{ animationDelay: "200ms" }}>
          <SectionHeader id="projects">Projects</SectionHeader>
          <div className="space-y-2">
            {projects.map((project) => (
              <ProjectCard key={project.name} {...project} />
            ))}
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default Index;
