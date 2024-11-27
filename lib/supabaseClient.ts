import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://pjxnzjnbnpstpeoimztk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqeG56am5ibnBzdHBlb2ltenRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI2Nzk2MjAsImV4cCI6MjA0ODI1NTYyMH0.zIkOSFr0sohOa-2-V8zHopLVp1bEaVs-Bw1j25Uh494';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);