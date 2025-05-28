
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wrjbxcurjbjqgwkcnnbi.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndyamJ4Y3VyamJqcWd3a2NubmJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNTk2NTMsImV4cCI6MjA2MzkzNTY1M30.5zC3H9xHSlCHBFDdHLgN4tJQ4OqgUmYdnIF6OOHBAWs'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
