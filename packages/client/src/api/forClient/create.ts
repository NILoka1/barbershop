import { trpc } from "src/api/client";

export function useCreateBookingForClients({ date }: { date: string }) {
  const utils = trpc.useUtils();

  return trpc.forClients.createBooking.useMutation({
    onMutate: async (newBooking) => {
      await utils.forClients.getSpareWindows.cancel();

      const previousBookings = utils.forClients.getSpareWindows.getData();
      utils.forClients.getSpareWindows.setData(
        {
          date: date,
          workerId: newBooking.workerId,
          serviceId: newBooking.serviceId,
        },
        (old) =>
          old?.filter(
            (slot) =>
              !(
                slot.startTime.toISOString() === newBooking.startTime &&
                slot.endTime.toISOString() === newBooking.endTime
              ),
          ) ?? [],
      );

      return { previousBookings };
    },

    onError: (err, newBooking, context) => {
      utils.forClients.getSpareWindows.setData(
        {
          date: date,
          workerId: newBooking.workerId,
          serviceId: newBooking.serviceId,
        },
        context?.previousBookings,
      );
    },

    onSettled: () => {
      utils.booking.getByDay.invalidate();
    },
  });
}
