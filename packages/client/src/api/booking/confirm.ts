import { trpc } from "src/api/client";

export function useConfirmBooking() {
  const utils = trpc.useUtils();

  return trpc.booking.сonfirmBooking.useMutation({
    onMutate: async ({ id }) => {
      await utils.booking.BookingToConfirm.cancel();

      const previousBookings = utils.booking.BookingToConfirm.getData();

      utils.booking.BookingToConfirm.setData(undefined, (old) => {
        if (!old) return old;
        return old.filter((booking) => booking.id != id);
      });

      return { previousBookings };
    },
    onError: (err, updatedBooking, context) => {
      utils.booking.BookingToConfirm.setData(
        undefined,
        context?.previousBookings,
      );
    },

    onSettled: () => {
      utils.booking.BookingToConfirm.invalidate();
    },
  });
}
