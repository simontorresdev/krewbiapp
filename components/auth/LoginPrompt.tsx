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
          className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
        >
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}
