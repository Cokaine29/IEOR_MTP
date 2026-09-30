export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-sm text-zinc-700 font-medium">
            <span>AGV Dispatching - M.Tech Thesis Project</span>
          </div>
          <p className="text-sm text-zinc-700 font-medium">
            Niraj Kamble &middot; IEOR &middot; IIT Bombay &middot; 2025-26
          </p>
        </div>
      </div>
    </footer>
  );
}
