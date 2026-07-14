"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { UseQueryOptions, UseMutationOptions } from "@tanstack/react-query";
import api from "@/lib/api";

/**
 * Generic GET query hook using TanStack Query + Axios.
 *
 * @example
 * const { data, isLoading } = useApiQuery<Publication[]>(
 *   ["publications"],
 *   "/api/publications"
 * );
 */
export function useApiQuery<TData = unknown>(
  queryKey: string[],
  url: string,
  options?: Omit<UseQueryOptions<TData>, "queryKey" | "queryFn">
) {
  return useQuery<TData>({
    queryKey,
    queryFn: async () => {
      const { data } = await api.get<TData>(url);
      return data;
    },
    ...options,
  });
}

/**
 * Generic POST/PUT/DELETE mutation hook using TanStack Query + Axios.
 *
 * @example
 * const { mutateAsync } = useApiMutation<Publication, CreatePublicationDto>(
 *   "POST",
 *   "/api/publications",
 *   { onSuccess: () => queryClient.invalidateQueries(["publications"]) }
 * );
 */
export function useApiMutation<TData = unknown, TVariables = unknown>(
  method: "POST" | "PUT" | "PATCH" | "DELETE",
  url: string | ((vars: TVariables) => string),
  options?: Omit<UseMutationOptions<TData, Error, TVariables>, "mutationFn">
) {
  return useMutation<TData, Error, TVariables>({
    mutationFn: async (variables) => {
      const resolvedUrl = typeof url === "function" ? url(variables) : url;

      if (method === "DELETE") {
        const { data } = await api.delete<TData>(resolvedUrl);
        return data;
      }

      const { data } = await api[method.toLowerCase() as "post" | "put" | "patch"]<TData>(
        resolvedUrl,
        variables
      );
      return data;
    },
    ...options,
  });
}

/**
 * Helper hook to invalidate query caches after mutations.
 *
 * @example
 * const invalidate = useInvalidate();
 * await invalidate(["publications"]);
 */
export function useInvalidate() {
  const queryClient = useQueryClient();
  return (queryKey: string[]) =>
    queryClient.invalidateQueries({ queryKey });
}
