export default function Navbar() {
  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex flex-col mt-6 space-y-1">
        <span className="text-sm text-muted">Desktop Navigation</span>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden h-16 border-t border-border backdrop-blur-lg px-6 flex items-center justify-between fixed bottom-0 left-0 right-0 z-50">
        <span className="text-xs text-muted">Mobile Navigation</span>
      </nav>
    </>
  );
}
