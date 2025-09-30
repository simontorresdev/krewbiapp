'use client';

import { usePathname } from 'next/navigation';
import BottomNavigation from './BottomNavigation';

export default function ConditionalBottomNav() {
  const pathname = usePathname();
  
  // Rutas donde SÍ queremos mostrar la navegación inferior
  const showNavRoutes = [
    '/',
    '/mis-partidos',
    '/perfil',
    '/perfil/editar',
    '/perfil/cambiar-contrasena',
    '/perfil/informacion',
  ];
  
  // Verificar si la ruta actual debería mostrar la navegación
  const shouldShowNav = showNavRoutes.includes(pathname);
  
  if (!shouldShowNav) {
    return null;
  }
  
  return <BottomNavigation />;
}
