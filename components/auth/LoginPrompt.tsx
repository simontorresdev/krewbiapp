import Link from 'next/link';

interface LoginPromptProps {
  className?: string;
}

export function LoginPrompt({ className = '' }: LoginPromptProps) {
  return (
    <div className={`text-center text-sm ${className}`}>
      <p className="text-gray-600 dark:text-gray-300">
        ¿Ya tienes una cuenta?{' '}
        <Link 
          href="/login" 
          className="text-white hover:underline transition-colors"
        >
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}
