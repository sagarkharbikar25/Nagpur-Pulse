import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

export const useIssues = (filters?: Record<string, string | undefined>) =>
  useQuery({
    queryKey: ['issues', filters],
    queryFn: async () => {
      const params = Object.fromEntries(
        Object.entries(filters ?? {}).filter(([, v]) => v !== undefined)
      );
      const { data } = await api.get('/api/issues', { params });
      return data.data as { issues: any[]; count: number };
    },
    staleTime: 30000,
  });
