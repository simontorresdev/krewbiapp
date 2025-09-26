import { useState } from 'react';
import { ResetPasswordFormData } from '@/lib/types/auth';

export function useResetPasswordForm() {
  const [formData, setFormData] = useState<ResetPasswordFormData>({
    password: '',
    confirmPassword: '',
  });
  
  const [errors, setErrors] = useState<Partial<ResetPasswordFormData>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<ResetPasswordFormData> = {};

    // Validar contraseña
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    // Validar confirmación de contraseña
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateField = (field: keyof ResetPasswordFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (onSubmit: (data: ResetPasswordFormData) => Promise<void>) => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
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
