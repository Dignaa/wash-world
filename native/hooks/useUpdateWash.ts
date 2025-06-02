import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { WashResponse } from '@/types';

export const useUpdateWash = () => {
  const { token } = useSelector((state: RootState) => state.auth);
  const baseUrl = process.env.EXPO_PUBLIC_API_URL;

  return useMutation<
    WashResponse,
    unknown,
    { washId: number; payload: { emergencyStop?: boolean; rating?: number } }
  >({
    mutationFn: async ({ washId, payload }) => {
      const resp = await axios.patch<WashResponse>(
        `${baseUrl}wash/${washId}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      return resp.data;
    },
  });
};
