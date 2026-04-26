import { trpc } from "src/main";

export function useDeleteShift(dates: { startDate: string; endDate: string }) {
  const utils = trpc.useUtils();

  return trpc.shifts.deleteShift.useMutation({
    onMutate: async (variables: { id: string }) => {
      await utils.shifts.getInDateRange.cancel(dates);

      const previousShifts = utils.shifts.getInDateRange.getData(dates);

      utils.shifts.getInDateRange.setData(dates, (old) => {
        if (!old) return old;
        return old.filter((shift) => shift.id !== variables.id);
      });

      return { previousShifts };
    },

    onError: (err, variables, context) => {
      if (context?.previousShifts) {
        utils.shifts.getInDateRange.setData(dates, context.previousShifts);
      }
    },

    onSettled: () => {
      utils.shifts.getInDateRange.invalidate(dates);
    },
  });
}