/**
 * Custom hook: useMemberships
 * ────────────────────────────────────────────────────────────────────────────
 * Fetches the current user’s memberships with TanStack Query.
 *
 * queryKey  → ['memberships', userId]
 *   • First element is a stable string that identifies “memberships”.
 *   • Second element scopes the cache per-user; if userId changes, React Query
 *     treats it as a different query and won’t leak data between users.
 *
 * enabled   → Boolean(token && userId)
 *   • Don’t run until we actually have a token *and* a userId.
 *
 * staleTime → 5 min (data stays “fresh” for 5 × 60 s)
 *   • During those 5 min `useQuery` will return cached data instantly and will
 *     NOT refetch on re-mount/focus unless you call refetch() manually.
 *   • After the period, the next window focus or mount triggers a background
 *     refetch.
 */

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Membership } from '@/types';

export const useMemberships = () => {
  // 1 pull auth info from Redux
  const { token, userId } = useSelector((state: RootState) => state.auth);

  // 2 base API URL
  const baseUrl = process.env.EXPO_PUBLIC_API_URL;

  // 3 declare the query
  return useQuery<Membership[]>({
    queryKey: ['memberships', userId],

    /** queryFn runs every time React Query decides data might be stale.
     *  It must return (or resolve to) the data shape declared in <TData>. */
    queryFn: async () => {
      const resp = await axios.get<Membership[]>(
        `${baseUrl}user/${userId}/memberships/`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      return resp.data; // becomes `data` in the hook’s return object
    },

    enabled: Boolean(token && userId), // gate until we’re authenticated
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/*
our usage:

  const {
    data: memberships,
    isLoading: membershipsLoading,
    isError: membershipsError,
    error: membershipsErrorObj,
  } = useMemberships();
*/
