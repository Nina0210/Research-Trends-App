'use client';

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">CS Paper Trends</h1>
            <p className="text-blue-100 mt-1">Discover trending research & AI-generated summaries</p>
          </div>
          <div className="flex items-center space-x-4">
            <nav className="hidden md:flex space-x-6">
              <a href="/" className="hover:text-blue-100 transition">
                Home
              </a>
              <a href="#trending" className="hover:text-blue-100 transition">
                Trending
              </a>
              <a href="#about" className="hover:text-blue-100 transition">
                About
              </a>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
