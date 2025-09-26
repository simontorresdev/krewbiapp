import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Función helper para autenticación con Google
export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/`
    }
  })
  
  return { data, error }
}

// Función helper para cerrar sesión
export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

// Función para obtener la sesión actual
export const getCurrentSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession()
  return { session, error }
}

// Función para obtener el usuario actual
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error }
}

// Función para registrarse con email y contraseña
export const signUpWithEmail = async (email: string, password: string, fullName?: string, phoneNumber?: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      data: {
        full_name: fullName,
        phone_number: phoneNumber,
      }
    }
  })
  
  return { data, error }
}

// Función para iniciar sesión con email y contraseña
export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  
  return { data, error }
}

// Función para reenviar email de confirmación
export const resendConfirmationEmail = async (email: string) => {
  const { data, error } = await supabase.auth.resend({
    type: 'signup',
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
    }
  })
  
  return { data, error }
}

// Función para solicitar recuperación de contraseña
export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
  });
  
  return { error };
}

// Función para actualizar contraseña
export const updatePassword = async (newPassword: string) => {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword
  })
  
  return { data, error }
}
