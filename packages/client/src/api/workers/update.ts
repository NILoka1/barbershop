import type { workersUpdateInput } from "shared";
import { trpc } from "../../main";

export function useUpdateWorker() {
  const utils = trpc.useUtils();
  return trpc.workers.update.useMutation({
    onMutate: async (updatedWorker: workersUpdateInput) => {
      await utils.workers.getAll.cancel();

      const previousWorker = utils.workers.getAll.getData();

      utils.workers.getAll.setData(undefined, (old) => {
        if (!old) return old;
        return old.map((s) =>
          s.id === updatedWorker.id ? { ...s, ...updatedWorker } : s,
        );
      });

      return { previousWorker };
    },
    onError: (err, updatedService, context) => {
      utils.workers.getAll.setData(undefined, context?.previousWorker);
    },
    onSettled: () => {
      utils.workers.getAll.invalidate();
    },
  });
}
