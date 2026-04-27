import { Text } from "@mantine/core";
import { trpc } from "src/main";
import type { ShiftFromDB } from "shared";
import dayjs from "dayjs";

interface BookingListInput {
  dayDatail: ShiftFromDB[];
}

const BookingList = ({ dayDatail }: BookingListInput) => {
  const {data} = trpc.booking.getByDay.useQuery({
    startDate: dayjs(dayDatail[0].startTime)
      .tz("Europe/Moscow")
      .startOf("day")
      .toISOString(),
    endDate: dayjs(dayDatail[0].endTime)
      .tz("Europe/Moscow")
      .endOf("day")
      .toISOString(),
  });

  console.log(data);
  return (
    <div>
      <Text>efewfew</Text>
    </div>
  );
};

export default BookingList;
