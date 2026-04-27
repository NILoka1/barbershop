import { trpc } from "src/main";

export function useUpdateShift(dates: { startDate: string; endDate: string }) {
  const utils = trpc.useUtils();

  return trpc.shifts.update.useMutation({
    onMutate: async (updatedShift) => {
      await utils.shifts.getInDateRange.cancel(dates);

      const previousShifts = utils.shifts.getInDateRange.getData(dates);

      utils.shifts.getInDateRange.setData(dates, (old) => {
        if (!old) return old;
        return old.map((shift) =>
          shift.id === updatedShift.id
            ? { ...shift, startTime: new Date(updatedShift.startDate), endTime: new Date(updatedShift.endDate) }
            : shift,
        );
      });

      return { previousShifts };
    },

    onError: (err, updatedShift, context) => {
      if (context?.previousShifts) {
        utils.shifts.getInDateRange.setData(dates, context.previousShifts);
      }
    },

    onSettled: () => {
      utils.shifts.getInDateRange.invalidate(dates);
    },
  });
}