import { trpc } from "../../main";
export function useCreateServices() {
  const utils = trpc.useUtils();
  return trpc.services.create.useMutation({
    onMutate: async (newService) => {
      await utils.services.getAll.cancel();
      const previousServices = utils.services.getAll.getData();

      utils.services.getAll.setData(undefined, (old)=> {
        if(!old) return [newService as any]
        return [...old, newService as any]
      })

      return {previousServices}
    },
     onError: (err, updatedService, context) => {
      utils.services.getAll.setData(undefined, context?.previousServices);
    },
    onSettled: () => {
      utils.services.getAll.invalidate();
    },
  });
}