import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useResetPasswordForm } from '@/lib/hooks/useResetPasswordForm';
import { ResetPasswordFormData } from '@/lib/types/auth';

interface ResetPasswordFormProps {
  onSubmit: (data: ResetPasswordFormData) => Promise<void>;
  isLoading?: boolean;
}

export function ResetPasswordForm({ onSubmit, isLoading = false }: ResetPasswordFormProps) {
  const { formData, errors, updateField, handleSubmit } = useResetPasswordForm();

  return (
    <form 
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(onSubmit);
      }}
      className="space-y-4"
    >
      {/* Nueva contraseña */}
      <div className="space-y-2">
        <Label htmlFor="password">Nueva contraseña</Label>
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
          placeholder="Repite tu nueva contraseña"
          value={formData.confirmPassword}
          onChange={(e) => updateField('confirmPassword', e.target.value)}
          className={errors.confirmPassword ? 'border-red-500' : ''}
          disabled={isLoading}
        />
        {errors.confirmPassword && (
          <p className="text-sm text-red-500">{errors.confirmPassword}</p>
        )}
      </div>

      {/* Botón de actualización */}
      <Button
        type="submit"
        className="w-full"
        disabled={isLoading}
        size="lg"
      >
        {isLoading ? 'Actualizando...' : 'Actualizar contraseña'}
      </Button>
    </form>
  );
}
