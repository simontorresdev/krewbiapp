'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      const { searchParams } = new URL(window.location.href);
      const type = searchParams.get('type');
      const next = searchParams.get('next');
      const code = searchParams.get('code');

      try {
        if (code) {
          // Intercambiar el código por una sesión
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);

          if (error) {
            console.error('Error en callback:', error);
            router.push('/login?error=' + encodeURIComponent(error.message));
            return;
          }
        }

        // Redirigir según el tipo, sin importar si había código
        if (type === 'recovery') {
          router.push(next || '/auth/reset-password');
        } else if (type === 'signup') {
          router.push('/signup/success');
        } else {
          router.push('/');
        }
      } catch (error) {
        console.error('Error inesperado:', error);
        router.push('/login');
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300">
          Procesando autenticación...
        </p>
      </div>
    </div>
  );
}
