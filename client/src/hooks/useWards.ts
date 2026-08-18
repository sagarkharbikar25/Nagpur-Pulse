import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

export const useWards = () =>
  useQuery({
    queryKey: ['wards'],
    queryFn: async () => {
      const { data } = await api.get('/api/wards');
      return data.data as any[];
    },
    staleTime: 60000 * 10, // wards rarely change
  });
