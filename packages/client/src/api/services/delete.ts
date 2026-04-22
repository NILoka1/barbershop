import { trpc } from "../../main";
export function useDeleteServices() {
  const utils = trpc.useUtils();
  return trpc.services.delete.useMutation({
    onMutate: async (variables: { id: string }) => {
      const deletedId = variables.id;
      await utils.services.getAll.cancel();
      const previousServices = utils.services.getAll.getData();

      utils.services.getAll.setData(undefined, (old) => {
        if (!old) return old;
        return old.filter((s) => s.id !== deletedId);
      });

      return { previousServices };
    },
    onError: (err, deletedId, context) => {
      utils.services.getAll.setData(undefined, context?.previousServices);
    },
    onSettled: () => {
      utils.services.getAll.invalidate();
    },
  });
}
