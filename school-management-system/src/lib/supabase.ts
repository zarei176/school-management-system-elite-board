import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://btvksaocmjufgfshyqfb.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0dmtzYW9jbWp1Zmdmc2h5cWZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwODczMDEsImV4cCI6MjA3NDY2MzMwMX0.YdY465d7i8HRn5JV9dc8vZ5CRDTs_Og3DfZwzuxRU1o"

// Create Supabase client instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for database
export interface Student {
  id?: number
  first_name: string
  last_name: string
  father_name: string
  father_job?: string
  mother_job?: string
  national_id: string
  home_address?: string
  special_illness?: string
  father_phone?: string
  mother_phone?: string
  student_phone?: string
  class_name: string
  created_at?: string
  updated_at?: string
}

export interface ExpectedStudent {
  id?: number
  first_name: string
  last_name: string
  national_id: string
  class_name: string
  is_registered?: boolean
  upload_session_id?: string
  created_at?: string
}

export interface AdminUser {
  id?: number
  email: string
  password_hash: string
  full_name: string
  role?: string
  is_active?: boolean
  created_at?: string
}