
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pueppppcykahheepwoqn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1ZXBwcHBjeWthaGhlZXB3b3FuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3MDgwNjYsImV4cCI6MjA4MzI4NDA2Nn0.6Am2RTIe06Bylr71ooe_qlM4v4YBZtuVFF1pnKvGry0';

export const supabase = createClient(supabaseUrl, supabaseKey);
