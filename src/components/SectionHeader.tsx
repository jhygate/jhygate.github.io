interface SectionHeaderProps {
  children: React.ReactNode;
  id?: string;
}

const SectionHeader = ({ children, id }: SectionHeaderProps) => {
  return (
    <h2 
      id={id}
      className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-8 pb-2 border-b border-border"
    >
      {children}
    </h2>
  );
};

export default SectionHeader;
