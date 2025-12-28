import { Github, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  const links = [
    {
      label: "GitHub",
      href: "https://github.com/jhygate",
      icon: Github,
    },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/jack-hygate/",
      icon: Linkedin,
    },
    {
      label: "Email",
      href: "mailto:jhygate@gmail.com",
      icon: Mail,
    },
  ];

  return (
    <footer className="border-t border-border py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <p className="text-sm text-muted-foreground font-mono">
          Jack Hygate
        </p>
        <nav className="flex items-center gap-6">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("mailto") ? undefined : "_blank"}
              rel={link.href.startsWith("mailto") ? undefined : "noopener noreferrer"}
              className="text-muted-foreground hover:text-foreground transition-colors duration-150 flex items-center gap-1.5 text-sm"
              aria-label={link.label}
            >
              <link.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{link.label}</span>
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
