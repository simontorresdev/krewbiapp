import toast from 'react-hot-toast';

export const handleAuthError = (error: { message?: string } | unknown) => {
  console.error('Auth error:', error);
  
  const errorMessage = (error as { message?: string })?.message;
  
  if (!errorMessage) {
    toast.error('Ocurrió un error inesperado. Intenta de nuevo.');
    return;
  }

  const message = errorMessage.toLowerCase();

  if (message.includes('invalid login credentials') || message.includes('invalid email or password')) {
    toast.error('Email o contraseña incorrectos. Verifica tus datos e intenta de nuevo.');
  } else if (message.includes('email not confirmed') || message.includes('signup_disabled')) {
    toast.error('Tu cuenta no ha sido confirmada. Revisa tu email y confirma tu cuenta antes de iniciar sesión.');
  } else if (message.includes('too many requests')) {
    toast.error('Demasiados intentos. Espera un momento e intenta de nuevo.');
  } else if (message.includes('user already registered')) {
    toast.error('Este email ya está registrado. Intenta iniciar sesión o usa otro email.');
  } else if (message.includes('weak password')) {
    toast.error('La contraseña es muy débil. Usa al menos 6 caracteres con números y letras.');
  } else if (message.includes('invalid email')) {
    toast.error('El formato del email no es válido.');
  } else {
    toast.error(`Error: ${errorMessage}`);
  }
};

export const showAuthSuccess = (message: string) => {
  toast.success(message);
};
