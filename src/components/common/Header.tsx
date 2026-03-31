'use client';

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-[#0a1628] to-[#0f2a5e] text-white shadow-lg border-b border-[#1e3461]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Trending CS</h1>
            <p className="text-blue-200 mt-1">Discover trending research & AI-generated summaries</p>
          </div>
          <div className="flex items-center space-x-4">
            <nav className="hidden md:flex space-x-6">
              <a href="/" className="hover:text-blue-200 transition">
                Home
              </a>
              <a href="#trending" className="hover:text-blue-200 transition">
                Trending
              </a>
              <a href="#about" className="hover:text-blue-200 transition">
                About
              </a>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
