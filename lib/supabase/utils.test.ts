import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { cleanSupabaseUrl, getSupabaseUrl, getSupabaseAnonKey } from './utils';

describe('cleanSupabaseUrl', () => {
  it('should return empty string for null, undefined, or empty string', () => {
    expect(cleanSupabaseUrl(null)).toBe('');
    expect(cleanSupabaseUrl(undefined)).toBe('');
    expect(cleanSupabaseUrl('')).toBe('');
    expect(cleanSupabaseUrl('   ')).toBe('');
  });

  it('should leave clean Supabase URL unchanged', () => {
    expect(cleanSupabaseUrl('https://ghosopesjhwxqkafnsrf.supabase.co')).toBe(
      'https://ghosopesjhwxqkafnsrf.supabase.co'
    );
  });

  it('should strip trailing slash', () => {
    expect(cleanSupabaseUrl('https://ghosopesjhwxqkafnsrf.supabase.co/')).toBe(
      'https://ghosopesjhwxqkafnsrf.supabase.co'
    );
  });

  it('should strip multiple trailing slashes', () => {
    expect(cleanSupabaseUrl('https://ghosopesjhwxqkafnsrf.supabase.co///')).toBe(
      'https://ghosopesjhwxqkafnsrf.supabase.co'
    );
  });

  it('should strip /rest/v1/ suffix', () => {
    expect(cleanSupabaseUrl('https://ghosopesjhwxqkafnsrf.supabase.co/rest/v1/')).toBe(
      'https://ghosopesjhwxqkafnsrf.supabase.co'
    );
  });

  it('should strip /rest/v1 suffix without trailing slash', () => {
    expect(cleanSupabaseUrl('https://ghosopesjhwxqkafnsrf.supabase.co/rest/v1')).toBe(
      'https://ghosopesjhwxqkafnsrf.supabase.co'
    );
  });

  it('should trim surrounding whitespace and newlines', () => {
    expect(cleanSupabaseUrl('  https://ghosopesjhwxqkafnsrf.supabase.co/rest/v1/ \n ')).toBe(
      'https://ghosopesjhwxqkafnsrf.supabase.co'
    );
  });
});

describe('getSupabaseUrl and getSupabaseAnonKey', () => {
  const origUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const origKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  beforeEach(() => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  });

  afterEach(() => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = origUrl;
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = origKey;
  });

  it('should fallback to placeholder when env is not set', () => {
    expect(getSupabaseUrl()).toBe('https://placeholder.supabase.co');
    expect(getSupabaseAnonKey()).toBe('placeholder-anon-key');
  });

  it('should clean and return configured env URL and key', () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://ghosopesjhwxqkafnsrf.supabase.co/rest/v1/ ';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = ' test-anon-key ';
    expect(getSupabaseUrl()).toBe('https://ghosopesjhwxqkafnsrf.supabase.co');
    expect(getSupabaseAnonKey()).toBe('test-anon-key');
  });
});
