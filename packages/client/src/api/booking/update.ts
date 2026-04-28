import { trpc } from "src/main";

export function useUpdateBooking({
  startDate,
  endDate,
}: {
  startDate: string;
  endDate: string;
}) {
  const utils = trpc.useUtils();

  return trpc.booking.updateBooking.useMutation({
    onMutate: async (updatedBooking) => {
      await utils.booking.getByDay.cancel();

      const previousBookings = utils.booking.getByDay.getData();

      const tempBooking = {
        client: {
          id: updatedBooking.id,
          name: updatedBooking.client.name,
        },
        service: {
          id: updatedBooking.service.id,
          name: updatedBooking.service.name,
        },
        shift: {
          worker: {
            name: updatedBooking.shift.worker.name,
          },
          id: updatedBooking.shift.id,
        },
        id: updatedBooking.id,
        status: updatedBooking.status,
        startTime: new Date(updatedBooking.startTime),
        endTime: new Date(updatedBooking.endTime),
      };

      utils.booking.getByDay.setData(
        { startDate: startDate, endDate: endDate },
        (old) => {
          if (!old) return old;
          return old.map((booking) =>
            booking.id === updatedBooking.id
              ? {
                  ...tempBooking,
                }
              : booking,
          );
        },
      );

      return { previousBookings };
    },
    onError: (err, updatedBooking, context) => {
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
