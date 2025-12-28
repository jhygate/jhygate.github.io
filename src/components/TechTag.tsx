interface TechTagProps {
  children: React.ReactNode;
}

const TechTag = ({ children }: TechTagProps) => {
  return (
    <span className="inline-flex items-center px-2 py-0.5 text-xs font-mono text-muted-foreground bg-secondary rounded border border-border">
      {children}
    </span>
  );
};

export default TechTag;
