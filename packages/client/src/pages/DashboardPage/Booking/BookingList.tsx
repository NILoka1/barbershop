import { ActionIcon, Badge, Group, Paper, Text } from "@mantine/core";
import { trpc } from "src/main";
import type { BookingFromDB, ShiftFromDB } from "shared";
import dayjs from "dayjs";
import React from "react";
import { IconEdit, IconTrash } from "@tabler/icons-react";

interface BookingListInput {
  dayDatail: ShiftFromDB[];
  onOpenBookingModal: (item: BookingFromDB) => void;
  onDelete: (id: string) => void;
}

const BookingList = React.memo(
  ({ dayDatail, onOpenBookingModal, onDelete }: BookingListInput) => {
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
        key={booking.id}
        withBorder
        shadow="xs"
        p="xs"
        mb="xs"
        style={{
          borderLeft: `3px solid ${
            booking.status === "CONFIRMED"
              ? "#40C057"
              : booking.status === "PENDING"
                ? "#FAB005"
                : booking.status === "CANCELLED"
                  ? "#FA5252"
                  : "#CED4DA"
          }`,
          opacity:
            booking.status === "CANCELLED" || booking.status === "COMPLETED"
              ? 0.6
              : 1,
        }}
      >
        <Group justify="space-between" mb={4}>
          <div>
            <Text size="sm" fw={500}>
              {booking.client.name}
            </Text>
            <Text size="xs" c="dimmed">
              {booking.service.name}
            </Text>
          </div>

          <Badge
            size="xs"
            color={
              booking.status === "CONFIRMED"
                ? "green"
                : booking.status === "PENDING"
                  ? "yellow"
                  : booking.status === "CANCELLED"
                    ? "red"
                    : "gray"
            }
            variant="light"
          >
            {booking.status === "PENDING" && "Ожидает"}
            {booking.status === "CONFIRMED" && "Подтверждён"}
            {booking.status === "CANCELLED" && "Отменён"}
            {booking.status === "COMPLETED" && "Выполнен"}
            {booking.status === "NOSHOW" && "Не пришёл"}
          </Badge>
        </Group>

        <Group justify="space-between" align="center">
          <Text size="xs" fw={500}>
            {dayjs(booking.startTime).format("HH:mm")} —{" "}
            {dayjs(booking.endTime).format("HH:mm")}
          </Text>

          <Group gap={2}>
            <ActionIcon
              variant="subtle"
              color="gray"
              size="sm"
              onClick={() => onOpenBookingModal(booking)}
              title="Редактировать"
            >
              <IconEdit size={14} />
            </ActionIcon>
            <ActionIcon
              onClick={() => {
                onDelete(booking.id);
              }}
              variant="subtle"
              color="red"
              size="sm"
              title="Удалить"
            >
              <IconTrash size={14} />
            </ActionIcon>
          </Group>
        </Group>
      </Paper>
    ));
  },
);

export default BookingList;
