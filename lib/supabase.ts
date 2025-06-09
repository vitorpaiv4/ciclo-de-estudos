import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://hjvktqonmgnphtuoqdbl.supabase.co"
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhqdmt0cW9ubWducGh0dW9xZGJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0OTQ1NjMsImV4cCI6MjA2NTA3MDU2M30.mn6gwWeIipKKm9YXMesFqf4Pz7-nbs_Bdj6cdRxSaHk"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type StudyList = {
  id: string
  user_id: string
  title: string
  description: string | null
  cycle_duration: number
  created_at: string
  updated_at: string
}

export type StudyItem = {
  id: string
  list_id: string
  title: string
  estimated_time: number
  is_completed: boolean
  order_index: number
  created_at: string
  updated_at: string
}

export type StudyCycle = {
  id: string
  list_id: string
  completed_at: string
  total_time: number
  cycle_number: number
}
