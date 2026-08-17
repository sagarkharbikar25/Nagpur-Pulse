// Environment validation and type-safe config
const requiredEnvVars = [
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'GEMINI_API_KEY',
  'PORT',
  'CLIENT_URL',
  'NODE_ENV'
] as const;

type EnvVar = typeof requiredEnvVars[number];

const getEnv = (key: EnvVar): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

export const env = {
  SUPABASE_URL: getEnv('SUPABASE_URL'),
  SUPABASE_ANON_KEY: getEnv('SUPABASE_ANON_KEY'),
  SUPABASE_SERVICE_ROLE_KEY: getEnv('SUPABASE_SERVICE_ROLE_KEY'),
  GEMINI_API_KEY: getEnv('GEMINI_API_KEY'),
  PORT: parseInt(getEnv('PORT'), 10),
  CLIENT_URL: getEnv('CLIENT_URL'),
  NODE_ENV: getEnv('NODE_ENV') as 'development' | 'production' | 'test',
};