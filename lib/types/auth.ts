export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignUpFormData {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  phoneNumber: string;
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

export interface SignUpProps {
  onSignUp?: (data: SignUpFormData) => Promise<void>;
  onGoogleSignUp?: () => Promise<void>;
  isLoading?: boolean;
}
