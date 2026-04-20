import { trpc } from "../../main";



export function useUpdateServices() {
  const utils = trpc.useUtils();
  return trpc.services.update.useMutation({
    onMutate: async (updatedService) => {
      await utils.services.getAll.cancel();

      const previousServices = utils.services.getAll.getData();

      utils.services.getAll.setData(undefined, (old) => {
        if (!old) return old;
        return old.map((s) =>
          s.id === updatedService.id
            ? { ...s, ...updatedService, price: updatedService.price as any }
            : s,
        );
      });

      return { previousServices };
    },
    onError: (err, updatedService, context) => {
      utils.services.getAll.setData(undefined, context?.previousServices);
    },
    onSettled: () => {
      utils.services.getAll.invalidate();
    },
  });
}
