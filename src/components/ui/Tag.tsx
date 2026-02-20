interface TagProps {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}

export function Tag({ children, active = false, onClick }: TagProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
        active
          ? 'bg-gold text-navy'
          : 'bg-black/5 text-cream/60 hover:bg-black/10 hover:text-cream'
      }`}
    >
      {children}
    </button>
  );
}
