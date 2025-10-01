'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CompanyLogo } from '@/components/auth/CompanyLogo';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Mail, ArrowRight, RotateCcw } from 'lucide-react';
import { resendConfirmationEmail } from '@/lib/supabase';
import { handleAuthError, showAuthSuccess } from '@/lib/utils/authErrors';
import Link from 'next/link';

function SignUpSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    } else {
      // Si no hay email, redirigir al signup
      router.push('/signup');
    }
  }, [searchParams, router]);

  const handleResendEmail = async () => {
    if (!email) return;
    
    setIsResending(true);
    try {
      const { error } = await resendConfirmationEmail(email);
      
      if (error) {
        handleAuthError(error);
      } else {
        showAuthSuccess('¡Email de confirmación reenviado exitosamente!');
      }
    } catch (error) {
      handleAuthError(error);
    } finally {
      setIsResending(false);
    }
  };

  if (!email) {
    return null; // Evita flash mientras redirige
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md mx-auto">
        <div className="text-center">
          {/* Logo de la empresa */}
          <CompanyLogo className="mb-8" />
          
          {/* Mensaje principal */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              ¡Cuenta creada exitosamente!
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Hemos enviado un correo de confirmación a:
            </p>
            <p className="text-lg font-semibold text-app-primary dark:text-app-primary bg-app-primary/10 dark:bg-app-primary/20 px-4 py-2 rounded-lg border border-app-primary/30 dark:border-app-primary/40">
              {email}
            </p>
          </div>
          
          {/* Instrucciones */}
          <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-6 mb-8 text-left">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
              <Mail className="w-5 h-5 mr-2 text-app-primary dark:text-app-primary" />
              Próximos pasos:
            </h3>
            <ol className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <li className="flex items-start">
                <span className="bg-app-primary text-app-primary-text rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-3 mt-0.5 flex-shrink-0">1</span>
                Revisa tu bandeja de entrada y carpeta de spam
              </li>
              <li className="flex items-start">
                <span className="bg-app-primary text-app-primary-text rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-3 mt-0.5 flex-shrink-0">2</span>
                Haz clic en el enlace de confirmación en el correo
              </li>
              <li className="flex items-start">
                <span className="bg-app-primary text-app-primary-text rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-3 mt-0.5 flex-shrink-0">3</span>
                Inicia sesión y comienza a disfrutar Krewbi
              </li>
            </ol>
          </div>
          
          {/* Botones de acción */}
          <div className="space-y-4">
            <Link href="/login">
              <Button 
                className="w-full"
                size="lg"
              >
                Ir al inicio de sesión
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            
            <Button 
              variant="outline"
              className="w-full mt-2"
              size="lg"
              onClick={handleResendEmail}
              disabled={isResending}
            >
              <RotateCcw className={`w-4 h-4 mr-2 ${isResending ? 'animate-spin' : ''}`} />
              {isResending ? 'Reenviando...' : 'Reenviar correo'}
            </Button>
          </div>
          
          {/* Nota adicional */}
          <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p className="text-xs text-yellow-800 dark:text-yellow-200">
              <strong>¿No recibiste el correo?</strong> Puede tardar hasta 5 minutos en llegar. 
              También revisa tu carpeta de spam o promociones.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignUpSuccess() {
  return (
    <Suspense fallback={<LoadingSpinner size="lg" text="Cargando..." fullScreen />}>
      <SignUpSuccessContent />
    </Suspense>
  );
}
