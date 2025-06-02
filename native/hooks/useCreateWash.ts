import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { CreateWashDto, WashResponse } from '@/types';

/**
 * Custom hook: useCreateWash
 * -----------------------------------------------------------------------------
 * Encapsulates the POST /wash   mutation in a reusable TanStack Query hook.
 *
 * Why TanStack useMutation?
 * ─────────────────────────
 * • Automatically tracks and exposes the async lifecycle (status, error, data).
 * • Gives an imperative .mutate / .mutateAsync API that fits perfectly for
 *   button-click handlers (“Start wash”) where you only call it on demand.
 * • Integrates with TanStack’s global query-cache, so you could invalidate or
 *   update related queries (e.g. ['washes'] list) in onSuccess if needed.
 *
 * Type parameters provided to useMutation  <TData, TError, TVariables>
 * ─────────────────────────────────────────────────────────────────────────────
 * ▸ TData        → WashResponse          (data returned from the server)
 * ▸ TError       → unknown               (we let errors bubble in any shape;
 *                                         narrow if you have a custom error type)
 * ▸ TVariables   → CreateWashDto         (payload you pass into mutate())
 */

export const useCreateWash = () => {
  const { token } = useSelector((state: RootState) => state.auth);
  const baseUrl = process.env.EXPO_PUBLIC_API_URL;

  /**
   * useMutation returns an object with:
   *   - mutate        (fire-and-forget, callbacks in options)
   *   - mutateAsync   (awaitable promise)
   *   - status / isPending / isError / isSuccess
   *   - data / error
   *
   * You can consume these in the UI to show spinners, toasts, etc.
   */

  return useMutation<WashResponse, unknown, CreateWashDto>({
    mutationFn: async (newWashDto) => {
      const resp = await axios.post<WashResponse>(
        `${baseUrl}wash`,
        newWashDto,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      return resp.data;
    },
  });
};

/*
our usage:

    createWashMutation.mutate(dto, {
      onSuccess: (data) => setWashId(data.id),
    });
*/
