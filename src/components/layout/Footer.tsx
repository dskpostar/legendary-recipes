export function Footer() {
  return (
    <footer className="border-t border-gold/10 bg-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center">
            <span className="font-display text-sm font-bold text-cream/50 tracking-[0.25em] uppercase">
              The Recipe
            </span>
          </div>
          <p className="text-cream/25 text-xs tracking-wider uppercase">
            World-class recipes &middot; For professional chefs
          </p>
        </div>
      </div>
    </footer>
  );
}
