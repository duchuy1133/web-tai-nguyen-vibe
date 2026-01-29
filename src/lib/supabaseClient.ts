import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Tạo kết nối 1 lần duy nhất và dùng chung cho toàn web
export const supabase = createClient(supabaseUrl, supabaseKey)