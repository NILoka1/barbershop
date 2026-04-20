import { trpc } from "../../main";
export function useCreateWorkers() {
  const utils = trpc.useUtils();
  return trpc.workers.register.useMutation({
    onMutate: async (newWorker) => {
      await utils.workers.getAll.cancel();
      const previousServices = utils.workers.getAll.getData();

      const tempWorker = {
        id: `temp-${Date.now()}`, // временный id
        email: newWorker.email,
        name: newWorker.name,
        phone: newWorker.phone ?? null,
        isAdmin: false
      };

      utils.workers.getAll.setData(undefined, (old) => {
        if (!old) return [tempWorker];
        return [...old, tempWorker];
      });

      return { previousServices };
    },
    onError: (err, updatedService, context) => {
      utils.workers.getAll.setData(undefined, context?.previousServices);
    },
    onSettled: () => {
      utils.services.getAll.invalidate();
    },
  });
}
