import OpenAI from 'openai';
import { env } from './env';

export const nvidiaClient = new OpenAI({
  apiKey: env.NVIDIA_API_KEY || 'dummy_key',
  baseURL: 'https://integrate.api.nvidia.com/v1',
});

export const NVIDIA_MODEL = 'nvidia/nemotron-3-super-120b-a12b';
