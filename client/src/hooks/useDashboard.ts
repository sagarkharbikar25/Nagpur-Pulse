import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

export const useDashboard = () =>
  useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const { data } = await api.get('/api/dashboard');
      return data.data;
    },
    staleTime: 30000,
    refetchInterval: 60000,
  });
