'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Calendar, User } from 'lucide-react';

export default function BottomNavigation() {
  const pathname = usePathname();

  const navItems = [
    {
      name: 'Inicio',
      href: '/',
      icon: Home,
    },
    {
      name: 'Mis Partidos',
      href: '/mis-partidos',
      icon: Calendar,
    },
    {
      name: 'Perfil',
      href: '/perfil',
      icon: User,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center">
      <nav className="w-full md:max-w-[1000px] md:mx-4 bg-white dark:bg-gray-900 border-t md:border md:rounded-t-2xl border-gray-200 dark:border-gray-700 md:shadow-lg">
        <div className="flex justify-around items-center h-16 px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center space-y-1 min-w-0 flex-1 ${
                isActive
                  ? 'text-app-primary dark:text-app-primary'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              } transition-colors duration-200`}
            >
              <Icon
                size={20}
                className={`${
                  isActive ? 'fill-current' : ''
                }`}
              />
              <span className="text-xs font-medium truncate">
                {item.name}
              </span>
            </Link>
          );
        })}
        </div>
      </nav>
    </div>
  );
}
