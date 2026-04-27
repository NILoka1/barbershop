import { Badge, Group, Paper, Text } from "@mantine/core";
import { trpc } from "src/main";
import type { ShiftFromDB } from "shared";
import dayjs from "dayjs";
import React from "react";

interface BookingListInput {
  dayDatail: ShiftFromDB[];
  onOpenBookingModal: () => void;
}

const BookingList = React.memo(({ dayDatail, onOpenBookingModal }: BookingListInput) => {
  const { data } = trpc.booking.getByDay.useQuery({
    startDate: dayjs(dayDatail[0].startTime)
      .tz("Europe/Moscow")
      .startOf("day")
      .toISOString(),
    endDate: dayjs(dayDatail[0].endTime)
      .tz("Europe/Moscow")
      .endOf("day")
      .toISOString(),
  });

  if (!data || data.length === 0) {
    return <Text ta="center">Нет записей для выбранного дня</Text>;
  }
  return data.map((booking) => (
    <Paper
      withBorder
      shadow="xs"
      p="xs"
      mb="xs"
      key={booking.id}
      style={{ borderLeft: `3px solid ${"#228be6"}` }}
    >
      <Group justify="space-between" mb={2}>
        <Text size="sm" fw={500} lineClamp={1}>
          {booking.client.name}
        </Text>
        <Badge
          size="xs"
          color={
            booking.status === "CONFIRMED"
              ? "green"
              : booking.status === "PENDING"
                ? "yellow"
                : "gray"
          }
        >
          {booking.status === "PENDING" ? "Ожидает" : "Подтверждён"}
        </Badge>
      </Group>

      <Group justify="space-between">
        <Text size="xs" fw={500}>
          {dayjs(booking.startTime).format("HH:mm")} —{" "}
          {dayjs(booking.endTime).format("HH:mm")}
        </Text>
        <Text size="xs" c="dimmed">
          {booking.shift.worker.name.split(" ")[0]}
        </Text>
      </Group>
    </Paper>
  ));
});

export default BookingList;
