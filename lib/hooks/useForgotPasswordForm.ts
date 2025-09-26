import { useState } from 'react';
import { ForgotPasswordFormData } from '@/lib/types/auth';

export function useForgotPasswordForm() {
  const [formData, setFormData] = useState<ForgotPasswordFormData>({
    email: '',
  });
  
  const [errors, setErrors] = useState<Partial<ForgotPasswordFormData>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<ForgotPasswordFormData> = {};

    // Validar email
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateField = (field: keyof ForgotPasswordFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (onSubmit: (data: ForgotPasswordFormData) => Promise<void>) => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error en recuperación de contraseña:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    errors,
    isLoading,
    updateField,
    handleSubmit,
  };
}
