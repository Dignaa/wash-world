import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { WashType } from '@/types';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

export const useWashTypes = () => {
  const { token } = useSelector((state: RootState) => state.auth);
  const baseUrl = process.env.EXPO_PUBLIC_API_URL;

  return useQuery<WashType[]>({
    queryKey: ['washTypes'],
    queryFn: async () => {
      const resp = await axios.get<WashType[]>(`${baseUrl}wash-types`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return resp.data;
    },
    staleTime: 1000 * 60 * 5,
  });
};
