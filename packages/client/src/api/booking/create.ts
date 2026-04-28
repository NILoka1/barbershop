import { trpc } from "../../main";

export function useCreateBooking({startDate, endDate}: {startDate: string, endDate: string}) {
  const utils = trpc.useUtils();

  return trpc.booking.createBooking.useMutation({
    onMutate: async (newBooking) => {
      await utils.booking.getByDay.cancel();

      const previousBookings = utils.booking.getByDay.getData();

      const tempBooking = {
        client: {
          id: newBooking.id,
          name: "Имя",
        },
        service: {
          id: newBooking.serviceId,
          name: "Услуга",
        },
        shift: {
          worker: {
            name: "Исполнитель",
          },
          id: newBooking.shiftId,
        },
        id: "temp-id",
        status: newBooking.status,
        startTime: new Date(newBooking.startTime),
        endTime: new Date(newBooking.endTime),
      };

      utils.booking.getByDay.setData({ startDate: startDate, endDate: endDate }, (old) =>
        old ? [...old, tempBooking] : [tempBooking],
      );

      return { previousBookings };
    },

    onError: (err, newBooking, context) => {
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
