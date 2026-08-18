import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Look for .env in current cwd, server folder, or parent folder
const possiblePaths = [
  path.resolve(process.cwd(), '.env'),
  path.resolve(process.cwd(), 'server', '.env'),
  path.resolve(__dirname, '../../.env'),
  path.resolve(__dirname, '../.env'),
  path.resolve(__dirname, '.env'),
];

for (const envPath of possiblePaths) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
  }
}

const getEnv = (key: string, defaultValue: string): string => {
  return process.env[key] || defaultValue;
};

export const env = {
  SUPABASE_URL: getEnv('SUPABASE_URL', 'https://jxogyatmvnwehtikbmjl.supabase.co'),
  SUPABASE_ANON_KEY: getEnv(
    'SUPABASE_ANON_KEY',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4b2d5YXRtdm53ZWh0aWtibWpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY5ODMyMDYsImV4cCI6MjEwMjU1OTIwNn0.-fuLpD9U68NR4EhWigJU3ClHXAnAu2iJl4c-B6Racq4'
  ),
  SUPABASE_SERVICE_ROLE_KEY: getEnv(
    'SUPABASE_SERVICE_ROLE_KEY',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4b2d5YXRtdm53ZWh0aWtibWpsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4Njk4MzIwNiwiZXhwIjoyMTAyNTU5MjA2fQ.NaY0nEj_LSJS7uj023qClii9sKIXYhoifxOSP5c9Xbc'
  ),
  NVIDIA_API_KEY: process.env.NVIDIA_API_KEY || '',
  PORT: parseInt(process.env.PORT || '3001', 10),
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  NODE_ENV: (process.env.NODE_ENV as 'development' | 'production' | 'test') || 'development',
};