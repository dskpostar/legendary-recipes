interface HeroSectionProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  children?: React.ReactNode;
}

export function HeroSection({ title, subtitle, backgroundImage, children }: HeroSectionProps) {
  return (
    <section
      className="relative overflow-hidden bg-navy"
      style={backgroundImage ? {
        backgroundImage: `linear-gradient(to bottom, rgba(245,244,240,0.2), rgba(245,244,240,0.92)), url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      } : undefined}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-cream tracking-[0.15em] uppercase">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 text-lg sm:text-xl text-cream/60 max-w-2xl">
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}
