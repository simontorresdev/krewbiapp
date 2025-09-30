'use client';

import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
  fullScreen?: boolean;
}

export function LoadingSpinner({ 
  size = 'md', 
  className,
  text = 'Cargando...',
  fullScreen = false
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center space-y-3">
      {/* Spinner */}
      <div className={cn(
        "animate-spin rounded-full border-2 border-gray-300 border-t-blue-600",
        sizeClasses[size],
        className
      )} />
      
      {/* Texto de carga */}
      {text && (
        <p className={cn(
          "text-gray-600 dark:text-gray-400 font-medium",
          textSizeClasses[size]
        )}>
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {spinner}
      </div>
    );
  }

  return spinner;
}

// Componente específico para pantallas completas de autenticación
export function AuthLoadingScreen() {
  return (
    <LoadingSpinner 
      size="lg" 
      text="Verificando autenticación..." 
      fullScreen 
    />
  );
}

// Componente para estados de carga en formularios
export function FormLoadingSpinner({ text = 'Procesando...' }: { text?: string }) {
  return (
    <LoadingSpinner 
      size="sm" 
      text={text}
      className="border-white border-t-transparent"
    />
  );
}
