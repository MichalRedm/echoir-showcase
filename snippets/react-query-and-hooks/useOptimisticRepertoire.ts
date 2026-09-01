import { useMutation, useQueryClient } from "@tanstack/react-query";
import { choirQueryKeys, type ChoirWorkspaceAPI } from "./useChoirWorkspace.js";

export interface RenameLabelPayload {
  choirId: string;
  oldLabel: string;
  newLabel: string;
}

export interface RepertoireMutationsAPI {
  renameLabel: (payload: RenameLabelPayload) => Promise<ChoirWorkspaceAPI>;
  deleteSong: (choirId: string, songId: string) => Promise<void>;
}

/**
 * Custom hook providing optimistic repertoire updates for high-responsiveness UI
 *
 * Demonstrates:
 * - Canceling ongoing refetches to prevent race conditions (`cancelQueries`)
 * - Snapshotting previous query state for automatic rollback on network failure
 * - Optimistically mutating the client cache before server responds
 * - Invalidation contracts to synchronize with backend reality
 */
export function useOptimisticRepertoire(api: RepertoireMutationsAPI) {
  const queryClient = useQueryClient();

  /**
   * Optimistic mutation for batch-renaming a label across all songs in a choir
   */
  const renameLabelMutation = useMutation({
    mutationFn: (payload: RenameLabelPayload) => api.renameLabel(payload),

    // 1. When mutate is called:
    onMutate: async ({ choirId, oldLabel, newLabel }) => {
      const queryKey = choirQueryKeys.detail(choirId);

      // Cancel outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey });

      // Snapshot the previous workspace data
      const previousChoir = queryClient.getQueryData<ChoirWorkspaceAPI>(queryKey);

      // Optimistically update the cache
      if (previousChoir) {
        queryClient.setQueryData<ChoirWorkspaceAPI>(queryKey, {
          ...previousChoir,
          songs: previousChoir.songs.map((song) => ({
            ...song,
            labels: song.labels.map((l) => (l === oldLabel ? newLabel : l)),
          })),
        });
      }

      // Return context object with snapshotted value for rollback
      return { previousChoir, queryKey };
    },

    // 2. If the mutation fails, roll back to the snapshotted state:
    onError: (_err, _variables, context) => {
      if (context?.previousChoir) {
        queryClient.setQueryData(context.queryKey, context.previousChoir);
      }
    },

    // 3. Always refetch after error or success to guarantee synchronization:
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({ queryKey: choirQueryKeys.detail(variables.choirId) });
    },
  });

  return {
    renameLabel: renameLabelMutation.mutate,
    isRenamingLabel: renameLabelMutation.isPending,
  };
}
