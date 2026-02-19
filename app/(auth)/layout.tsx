// app/(auth)/layout.tsx

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
            {children}
          </div>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="p-4 sm:p-6 text-center text-sm text-gray-600">
        <p>
          © {new Date().getFullYear()} VoyagerAuMaroc. Todos los derechos reservados.
        </p>
      </footer>
    </div>
  );
}


