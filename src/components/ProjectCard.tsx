import TechTag from "./TechTag";
import { ExternalLink } from "lucide-react";

interface ProjectCardProps {
  name: string;
  description: string;
  bullets: string[];
  techStack: string[];
  githubUrl?: string;
}

const ProjectCard = ({
  name,
  description,
  bullets,
  techStack,
  githubUrl,
}: ProjectCardProps) => {
  return (
    <article className="group p-5 -mx-5 rounded-lg transition-colors duration-150 hover:bg-secondary/50">
      <header className="mb-3">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-base font-semibold text-foreground">
            {name}
          </h3>
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-accent transition-colors duration-150"
              aria-label={`View ${name} on GitHub`}
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </header>

      <ul className="space-y-1.5 mb-4">
        {bullets.map((bullet, index) => (
          <li
            key={index}
            className="text-sm text-foreground/80 leading-relaxed pl-4 relative before:content-['·'] before:absolute before:left-0.5 before:text-muted-foreground"
          >
            {bullet}
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

export default ProjectCard;
