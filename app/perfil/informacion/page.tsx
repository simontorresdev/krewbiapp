'use client';

import { useAuth } from '@/lib/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Mail, Phone, Shield, Clock, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AuthGuard } from '@/components/auth';

export default function AccountInfo() {
  const { user } = useAuth();
  const router = useRouter();



  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getProviderName = (provider: string) => {
    switch (provider) {
      case 'google':
        return 'Google';
      case 'email':
        return 'Email/Contraseña';
      default:
        return provider || 'Desconocido';
    }
  };

  const infoItems = [
    {
      icon: User,
      label: 'Nombre completo',
      value: user?.user_metadata?.full_name || 'No especificado',
    },
    {
      icon: Mail,
      label: 'Email',
      value: user?.email || 'No disponible',
    },
    {
      icon: Phone,
      label: 'Teléfono',
      value: user?.user_metadata?.phone_number || 'No especificado',
    },
    {
      icon: Shield,
      label: 'Método de autenticación',
      value: getProviderName(user?.app_metadata?.provider || ''),
    },
    {
      icon: Calendar,
      label: 'Fecha de registro',
      value: user?.created_at ? formatDate(user.created_at) : 'No disponible',
    },
    {
      icon: Clock,
      label: 'Último acceso',
      value: user?.last_sign_in_at ? formatDate(user.last_sign_in_at) : 'No disponible',
    },
  ];

  return (
    <AuthGuard>

      <div className="min-h-screen py-8 px-4">
        <div className="w-full max-w-md mx-auto">
          {/* Header */}
          <div className="flex items-center mb-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="mr-4"
            >
              <ArrowLeft size={20} />
            </Button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Información de la cuenta
            </h1>
          </div>

          {/* Información */}
          <div className="space-y-4">
            {infoItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
                      <Icon size={20} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                        {item.label}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 break-words">
                        {item.value}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ID de usuario (para desarrolladores/soporte) */}
          <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="font-medium text-gray-900 dark:text-white mb-2 text-sm">
              ID de usuario (soporte técnico)
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-mono break-all">
              {user?.id || 'No disponible'}
            </p>
          </div>

          {/* Botón para volver */}
          <div className="mt-8">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.back()}
            >
              Volver al perfil
            </Button>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
