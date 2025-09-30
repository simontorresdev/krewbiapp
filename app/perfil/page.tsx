'use client';

import { useAuth } from '@/lib/contexts/AuthContext';
import { signOut } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { User, Edit, Lock, Info, LogOut, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { showAuthSuccess } from '@/lib/utils/authErrors';
import { useState } from 'react';
import { AuthGuard } from '@/components/auth';
import Image from 'next/image';

function ProfileContent() {
  const { user } = useAuth();
  const router = useRouter();
  const [imageError, setImageError] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    showAuthSuccess('¡Sesión cerrada exitosamente!');
    router.push('/login');
  };

  const profileOptions = [
    {
      icon: Edit,
      title: 'Edición de perfil',
      description: 'Actualiza tu información personal',
      href: '/perfil/editar',
      bgColor: 'bg-app-primary hover:bg-app-primary-hover',
      textColor: 'text-app-primary-text',
    },
    {
      icon: Lock,
      title: 'Cambiar contraseña',
      description: 'Modifica tu contraseña de acceso',
      href: '/perfil/cambiar-contrasena',
      bgColor: 'bg-app-primary hover:bg-app-primary-hover',
      textColor: 'text-app-primary-text',
    },
    {
      icon: Info,
      title: 'Información de la cuenta',
      description: 'Ver detalles de tu cuenta',
      href: '/perfil/informacion',
      bgColor: 'bg-app-primary hover:bg-app-primary-hover',
      textColor: 'text-app-primary-text',
    },
  ];



  return (
    <div className="min-h-screen py-8 px-4">
        <div className="w-full max-w-md mx-auto">
          {/* Header del perfil */}
          <div className="text-center mb-8">
            {/* Avatar */}
            <div className="relative mb-6">
                            {user?.user_metadata?.avatar_url ? (
                <div className="w-28 h-28 rounded-full mx-auto shadow-xl overflow-hidden">
                  <img
                    src={user.user_metadata.avatar_url}
                    alt="Avatar"
                    className="w-full h-full object-cover rounded-full bg-white"
                  />
                </div>
              ) : (
                <div className="w-28 h-28 rounded-full mx-auto bg-app-primary shadow-xl flex items-center justify-center ring-4 ring-app-primary/20">
                  <User className="h-12 w-12 text-app-primary-icon" />
                </div>
              )}
            </div>
            
            {/* Nombre */}
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {user?.user_metadata?.full_name || 'Usuario'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {user?.email}
            </p>
          </div>

          {/* Opciones del perfil */}
          <div className="space-y-4 mb-8">
            {profileOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.href}
                  onClick={() => router.push(option.href)}
                  className="w-full bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-lg transition-all duration-300 flex items-center justify-between group"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-xl ${option.bgColor} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                      <Icon size={22} className={option.textColor} />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {option.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {option.description}
                      </p>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-300" />
                </button>
              );
            })}
          </div>

          {/* Botón de cerrar sesión */}
          <Button
            onClick={handleSignOut}
            variant="outline"
            className="w-full border-2 border-red-300 text-red-600 hover:bg-gradient-to-r hover:from-red-500 hover:to-red-600 hover:text-white hover:border-red-500 dark:border-red-600 dark:text-red-400 dark:hover:bg-gradient-to-r dark:hover:from-red-600 dark:hover:to-red-700 dark:hover:text-white dark:hover:border-red-500 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <LogOut size={20} className="mr-2" />
            Cerrar sesión
          </Button>
        </div>
      </div>
    );
}

export default function Profile() {
  return (
    <AuthGuard>
      <ProfileContent />
    </AuthGuard>
  );
}
