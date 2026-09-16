import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Testing Supabase keep-alive ping...');
console.log('Supabase URL:', supabaseUrl);

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const start = Date.now();
const { data, error } = await supabase.from('products').select('id, name, slug').limit(1);
const duration = Date.now() - start;

if (error) {
  console.error('Ping failed:', error.message);
  process.exit(1);
} else {
  console.log('Ping SUCCESS!');
  console.log('Latency:', duration, 'ms');
  console.log('Sample record:', data[0]);
  process.exit(0);
}
