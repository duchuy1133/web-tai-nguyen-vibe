
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Prevent crash if keys are missing (common in dev start)
export const supabase = (supabaseUrl && supabaseAnonKey)
    ? createClient(supabaseUrl, supabaseAnonKey)
    : {
        auth: {
            getUser: async () => ({ data: { user: null }, error: null }),
            getSession: async () => ({ data: { session: null }, error: null }),
            signInWithPassword: async () => ({ data: null, error: { message: "Chưa cấu hình Supabase URL/Key trong .env" } }),
            signUp: async () => ({ data: null, error: { message: "Chưa cấu hình Supabase URL/Key trong .env" } }),
            signOut: async () => ({ error: null }),
            onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
        }
    } as any;
