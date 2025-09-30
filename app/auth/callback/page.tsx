'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function AuthCallback() {
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
          const { error } = await supabase.auth.exchangeCodeForSession(code);

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
    <LoadingSpinner 
      size="lg" 
      text="Procesando autenticación..." 
      fullScreen 
    />
  );
}
