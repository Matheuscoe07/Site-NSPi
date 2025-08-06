import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wcooihewjgachmdqyaoj.supabase.co'; // 🔁 substitua pela sua URL real
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indjb29paGV3amdhY2htZHF5YW9qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTIsImV4cCI6MjA2Mzg1OTg1Mn0.B1ascoWcjnoM2FKRrLuu_E5xeLBDU7xa4XjDd82Dolg'; // 🔁 substitua pela sua chave anon real

export const supabase = createClient(supabaseUrl, supabaseKey);