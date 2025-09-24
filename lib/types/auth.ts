export interface LoginFormData {
  email: string;
  password: string;
}

export interface AuthProvider {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
}

export interface LoginProps {
  onLogin?: (data: LoginFormData) => Promise<void>;
  onAppleLogin?: () => Promise<void>;
  onGoogleLogin?: () => Promise<void>;
  isLoading?: boolean;
}
