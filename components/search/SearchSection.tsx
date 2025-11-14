// components/search/SearchSection.tsx
'use client';

import SearchBarHome from './SearchBarHome';

export default function SearchSection() {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            ¿A dónde quieres ir?
          </h2>
          <p className="text-lg text-gray-600">
            Comienza a planear tu próxima aventura
          </p>
        </div>

        <SearchBarHome />
      </div>
    </section>
  );
}

