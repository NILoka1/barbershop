import { trpc } from "../../main";
export function useDeleteWorker() {
  const utils = trpc.useUtils();
  return trpc.workers.delete.useMutation({
    onMutate: async (variables: { id: string }) => {
      const deletedId = variables.id;
      await utils.workers.getAll.cancel();
      const previousWorkers = utils.workers.getAll.getData();

      utils.workers.getAll.setData(undefined, (old) => {
        if (!old) return old;
        return old.filter((w) => w.id !== deletedId);
      });

      return { previousWorkers };
    },
    onError: (err, deletedId, context) => {
      utils.workers.getAll.setData(undefined, context?.previousWorkers);
    },
    onSettled: () => {
      utils.workers.getAll.invalidate();
    },
  });
}
