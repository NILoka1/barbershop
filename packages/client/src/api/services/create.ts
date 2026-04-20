import { trpc } from "../../main";
export function useCreateServices() {
  const utils = trpc.useUtils();
  return trpc.services.create.useMutation({
    onMutate: async (newService) => {
      await utils.services.getAll.cancel();
      const previousServices = utils.services.getAll.getData();

      const tempService = {
        ...newService,
        id: `temp-${Date.now()}`, // временный id
        createdAt: new Date(),
        updatedAt: new Date(),
        color: null,
        description: newService.description ?? null,
      };

      utils.services.getAll.setData(undefined, (old) => {
        if (!old) return [tempService];
        return [...old, tempService];
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
