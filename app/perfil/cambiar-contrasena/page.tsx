'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { updatePassword } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { handleAuthError, showAuthSuccess } from '@/lib/utils/authErrors';
import { AuthGuard } from '@/components/auth';

function ChangePasswordContent() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      handleAuthError(new Error('Las contraseñas no coinciden'));
      return;
    }

    if (formData.newPassword.length < 6) {
      handleAuthError(new Error('La contraseña debe tener al menos 6 caracteres'));
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await updatePassword(formData.newPassword);

      if (error) {
        handleAuthError(error);
        return;
      }

      showAuthSuccess('¡Contraseña actualizada exitosamente!');
      router.push('/perfil');
    } catch (error) {
      console.error('Error updating password:', error);
      handleAuthError(new Error('Error inesperado al cambiar la contraseña'));
    } finally {
      setIsLoading(false);
    }
  };



  // Verificar si el usuario puede cambiar contraseña (no usuarios de Google)
  const isGoogleUser = user?.app_metadata?.provider === 'google';

  if (isGoogleUser) {
    return (
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
              Cambiar contraseña
            </h1>
          </div>

          {/* Mensaje para usuarios de Google */}
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">🔒</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Autenticación con Google
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Tu cuenta está vinculada con Google. Para cambiar tu contraseña, 
              debes hacerlo directamente en tu cuenta de Google.
            </p>
            <Button
              onClick={() => router.back()}
              variant="outline"
            >
              Volver al perfil
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
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
            Cambiar contraseña
          </h1>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="newPassword">Nueva contraseña</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  name="newPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Ingresa tu nueva contraseña"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirma tu nueva contraseña"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              <strong>Requisitos:</strong>
              <br />
              • Mínimo 6 caracteres
              <br />
              • Se recomienda usar mayúsculas, minúsculas y números
            </p>
          </div>

          <div className="space-y-3">
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Cambiando...' : 'Cambiar contraseña'}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => router.back()}
              disabled={isLoading}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ChangePassword() {
  return (
    <AuthGuard>
      <ChangePasswordContent />
    </AuthGuard>
  );
}
