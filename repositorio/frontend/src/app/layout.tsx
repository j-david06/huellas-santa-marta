import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Huellas Santa Marta - Mascotas Perdidas y Encontradas',
  description: 'Plataforma para reportar mascotas perdidas y encontradas en Santa Marta',
  generator: 'Next.js',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        <nav className="bg-blue-600 text-white p-4 shadow-lg">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold">🐾 Huellas Santa Marta</h1>
            <ul className="flex gap-4">
              <li><a href="/" className="hover:text-gray-200">Inicio</a></li>
              <li><a href="/reportes" className="hover:text-gray-200">Feed</a></li>
              <li><a href="/reportes/crear" className="hover:text-gray-200">Crear Reporte</a></li>
            </ul>
          </div>
        </nav>
        <main className="max-w-6xl mx-auto p-4">
          {children}
        </main>
        <footer className="bg-gray-800 text-white text-center p-4 mt-12">
          <p>&copy; 2024 Huellas Santa Marta. Todos los derechos reservados.</p>
        </footer>
      </body>
    </html>
  )
}
