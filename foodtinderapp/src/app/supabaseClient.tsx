import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://qfepnscudzjqwndfxaft.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmZXBuc2N1ZHpqcXduZGZ4YWZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDA4NzM2NDksImV4cCI6MjAxNjQ0OTY0OX0.nrmx49pG6rVCExlYtaXW35aQZDGZu5pToNbRyhXbTYU'
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;


