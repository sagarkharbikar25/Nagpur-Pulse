import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

export const useHotspots = () =>
  useQuery({
    queryKey: ['hotspots'],
    queryFn: async () => {
      const { data } = await api.get('/api/hotspots');
      return data.data as any[];
    },
    staleTime: 30000,
    refetchInterval: 60000, // auto-refresh every minute
  });
