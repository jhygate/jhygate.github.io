import TechTag from "./TechTag";

interface ExperienceCardProps {
  company: string;
  role: string;
  dates: string;
  context: string;
  contributions: string[];
  techStack: string[];
}

const ExperienceCard = ({
  company,
  role,
  dates,
  context,
  contributions,
  techStack,
}: ExperienceCardProps) => {
  return (
    <article className="group">
      <header className="mb-4">
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-1">
          <h3 className="text-base font-semibold text-foreground">
            {company}
          </h3>
          <span className="text-sm font-mono text-muted-foreground">
            {dates}
          </span>
        </div>
        <p className="text-sm text-foreground/80">{role}</p>
      </header>

      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
        {context}
      </p>

      <ul className="space-y-2 mb-5">
        {contributions.map((contribution, index) => (
          <li 
            key={index} 
            className="text-sm text-foreground/85 leading-relaxed pl-4 relative before:content-['–'] before:absolute before:left-0 before:text-muted-foreground"
          >
            {contribution}
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap gap-1.5">
        {techStack.map((tech) => (
          <TechTag key={tech}>{tech}</TechTag>
        ))}
      </div>
    </article>
  );
};

export default ExperienceCard;
