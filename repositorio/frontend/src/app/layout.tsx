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
      <body className="bg-[#fbf9f8]">
        {/* TopAppBar */}
        <header className="fixed top-0 w-full z-50 bg-[#fbf9f8] shadow-sm flex items-center justify-between px-[20px] md:px-[40px] h-16 border-b border-[#ddc0ba]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#9f402d]" style={{ fontSize: '28px' }}>pets</span>
            <span className="font-headline-md text-[#9f402d]">Huellas Santa Marta</span>
          </div>
        </header>

        {/* Main Content - Centered mobile layout with max-w-md */}
        <main className="max-w-md mx-auto min-h-screen relative pt-16 pb-24">
          {children}
        </main>

        {/* Bottom Navigation - Mobile Only */}
        <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 bg-[#ffffff] border-t border-[#ddc0ba] flex justify-around items-center py-2 px-0">
          {/* Inicio (Active) */}
          <a
            href="/reportes"
            className="flex flex-col items-center justify-center text-center py-2 px-2 flex-1 rounded-2xl transition-colors hover:bg-[#f5f3f3]"
          >
            <span className="material-symbols-outlined text-[#9f402d]" style={{ fontSize: '24px' }}>home</span>
            <span className="text-[11px] font-label-md text-[#1b1c1c] mt-1">Inicio</span>
          </a>

          {/* Reportar (Active) */}
          <a
            href="/reportes/crear"
            className="flex flex-col items-center justify-center text-center py-2 px-2 flex-1 rounded-2xl transition-colors hover:bg-[#f5f3f3]"
          >
            <span className="material-symbols-outlined text-[#9f402d]" style={{ fontSize: '24px' }}>add_circle</span>
            <span className="text-[11px] font-label-md text-[#1b1c1c] mt-1">Reportar</span>
          </a>

          {/* Mapa (Disabled - TODO: feature 02-mapa-y-busqueda) */}
          <button
            disabled
            className="flex flex-col items-center justify-center text-center py-2 px-2 flex-1 rounded-2xl opacity-40 cursor-not-allowed"
            title="Próximamente"
          >
            <span className="material-symbols-outlined text-[#56423e]" style={{ fontSize: '24px' }}>map</span>
            <span className="text-[11px] font-label-md text-[#56423e] mt-1">Mapa</span>
          </button>

          {/* Alertas (Disabled - TODO: feature 06-notificaciones) */}
          <button
            disabled
            className="flex flex-col items-center justify-center text-center py-2 px-2 flex-1 rounded-2xl opacity-40 cursor-not-allowed"
            title="Próximamente"
          >
            <span className="material-symbols-outlined text-[#56423e]" style={{ fontSize: '24px' }}>notifications</span>
            <span className="text-[11px] font-label-md text-[#56423e] mt-1">Alertas</span>
          </button>

          {/* Perfil (Disabled - TODO: perfil de usuario pendiente) */}
          <button
            disabled
            className="flex flex-col items-center justify-center text-center py-2 px-2 flex-1 rounded-2xl opacity-40 cursor-not-allowed"
            title="Próximamente"
          >
            <span className="material-symbols-outlined text-[#56423e]" style={{ fontSize: '24px' }}>person</span>
            <span className="text-[11px] font-label-md text-[#56423e] mt-1">Perfil</span>
          </button>
        </nav>
      </body>
    </html>
  )
}
