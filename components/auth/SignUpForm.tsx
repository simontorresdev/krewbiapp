import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSignUpForm } from '@/lib/hooks/useSignUpForm';
import { FormLoadingSpinner } from '@/components/ui/loading-spinner';
import { SignUpFormData } from '@/lib/types/auth';

interface SignUpFormProps {
  onSubmit: (data: SignUpFormData) => Promise<void>;
  isLoading?: boolean;
}

export function SignUpForm({ onSubmit, isLoading = false }: SignUpFormProps) {
  const { formData, errors, updateField, handleSubmit } = useSignUpForm();

  return (
    <form 
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(onSubmit);
      }}
      className="space-y-4"
    >
      {/* Nombre completo */}
      <div className="space-y-2">
        <Label htmlFor="fullName">Nombre completo</Label>
        <Input
          id="fullName"
          type="text"
          placeholder="Tu nombre completo"
          value={formData.fullName}
          onChange={(e) => updateField('fullName', e.target.value)}
          className={errors.fullName ? 'border-red-500' : ''}
          disabled={isLoading}
        />
        {errors.fullName && (
          <p className="text-sm text-red-500">{errors.fullName}</p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="tu@email.com"
          value={formData.email}
          onChange={(e) => updateField('email', e.target.value)}
          className={errors.email ? 'border-red-500' : ''}
          disabled={isLoading}
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email}</p>
        )}
      </div>

      {/* Número de teléfono */}
      <div className="space-y-2">
        <Label htmlFor="phoneNumber">Número de teléfono</Label>
        <Input
          id="phoneNumber"
          type="tel"
          placeholder="3015254461"
          value={formData.phoneNumber}
          onChange={(e) => updateField('phoneNumber', e.target.value)}
          className={errors.phoneNumber ? 'border-red-500' : ''}
          disabled={isLoading}
        />
        {errors.phoneNumber && (
          <p className="text-sm text-red-500">{errors.phoneNumber}</p>
        )}
      </div>

      {/* Contraseña */}
      <div className="space-y-2">
        <Label htmlFor="password">Contraseña</Label>
        <Input
          id="password"
          type="password"
          placeholder="Mínimo 6 caracteres"
          value={formData.password}
          onChange={(e) => updateField('password', e.target.value)}
          className={errors.password ? 'border-red-500' : ''}
          disabled={isLoading}
        />
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password}</p>
        )}
      </div>

      {/* Confirmar contraseña */}
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="Repite tu contraseña"
          value={formData.confirmPassword}
          onChange={(e) => updateField('confirmPassword', e.target.value)}
          className={errors.confirmPassword ? 'border-red-500' : ''}
          disabled={isLoading}
        />
        {errors.confirmPassword && (
          <p className="text-sm text-red-500">{errors.confirmPassword}</p>
        )}
      </div>

      {/* Botón de registro */}
      <Button
        type="submit"
        className="w-full"
        disabled={isLoading}
        size="lg"
      >
        {isLoading ? (
          <FormLoadingSpinner text="Creando cuenta..." />
        ) : (
          'Crear cuenta'
        )}
      </Button>
    </form>
  );
}
