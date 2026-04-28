import { trpc } from "src/main";

export function useDeleteBooking({
  startDate,
  endDate,
}: {
  startDate: string;
  endDate: string;
}) {
  const utils = trpc.useUtils();

  return trpc.booking.deleteBooking.useMutation({
    onMutate: async ({ id }) => {
      await utils.booking.getByDay.cancel();

      const previousBookings = utils.booking.getByDay.getData();

      utils.booking.getByDay.setData(
        { startDate: startDate, endDate: endDate },
        (old) => {
          if (!old) return old;
          return old.filter((booking) => booking.id != id);
        },
      );

      return { previousBookings };
    },
    onError: (err, id, context) => {
      utils.booking.getByDay.setData(
        { startDate: "", endDate: "" },
        context?.previousBookings,
      );
    },

    onSettled: () => {
      utils.booking.getByDay.invalidate();
    },
  });
}
