import {
  Text,
  Paper,
  Stack,
  Group,
  Badge,
  Box,
  Tooltip,
  ScrollArea,
} from "@mantine/core";
import dayjs from "dayjs";
import { trpc } from "src/api/client";

interface CalendarShiftsMenuProps {
  workerId: string;
  date: Date;
}

const CalendarShiftsMenu = ({ workerId, date }: CalendarShiftsMenuProps) => {
  const shifts = trpc.shifts.getInDateRangeToCalendarMenu.useQuery({
    startDate: dayjs(date).startOf("day").toISOString(),
    endDate: dayjs(date).endOf("day").toISOString(),
    id: workerId,
  }).data;

  if (!workerId) {
    return <Text c="dimmed">Выберите работника</Text>;
  }
  if (!date) {
    return <Text c="dimmed">Выберите дату</Text>;
  }
  if (!shifts) {
    return <Text c="dimmed">Загрузка...</Text>;
  }
  if (shifts.length === 0) {
    return <Text c="dimmed">Нет смен в этот день</Text>;
  }

  return (
    <ScrollArea h={"100%"}>
      <Stack gap="lg">
        {shifts.map((shift) => {
          const shiftStart = dayjs(shift.startTime);
          const shiftEnd = dayjs(shift.endTime);

          const sortedBookings = [...shift.bookings].sort(
            (a, b) =>
              dayjs(a.startTime).valueOf() - dayjs(b.startTime).valueOf(),
          );

          return (
            <Paper key={shift.id} withBorder p="md" radius="md">

              <Group justify="space-between" mb="md">
                <Text fw={600} size="sm">
                  Смена {shiftStart.format("HH:mm")} —{" "}
                  {shiftEnd.format("HH:mm")}
                </Text>
                <Badge variant="light" color="blue" size="sm">
                  {sortedBookings.length} записей
                </Badge>
              </Group>

              <Box style={{ position: "relative" }}>
                {sortedBookings.length === 0 ? (
                  <Paper
                    withBorder
                    p="xl"
                    bg="gray.0"
                    style={{ borderStyle: "dashed" }}
                  >
                    <Text ta="center" c="dimmed" size="sm">
                      Нет записей
                    </Text>
                  </Paper>
                ) : (
                  <Stack gap={0}>
                    {sortedBookings.map((booking, index) => {
                      const bookingStart = dayjs(booking.startTime);
                      const bookingEnd = dayjs(booking.endTime);
                      const bookingDuration = bookingEnd.diff(
                        bookingStart,
                        "minute",
                      );

                      return (
                        <div key={`${booking.client.id}-${booking.startTime}`}>
                          {index === 0 &&
                            bookingStart.diff(shiftStart, "minute") > 0 && (
                              <Box
                                py="xs"
                                px="md"
                                style={{
                                  borderLeft:
                                    "2px dashed var(--mantine-color-gray-4)",
                                  marginLeft: 16,
                                  opacity: 0.5,
                                }}
                              >
                                <Text size="xs" c="dimmed">
                                  {shiftStart.format("HH:mm")} — Начало смены
                                </Text>
                              </Box>
                            )}

                          {index > 0 && (
                            <Box
                              py="xs"
                              px="md"
                              style={{
                                borderLeft:
                                  "2px dashed var(--mantine-color-gray-4)",
                                marginLeft: 16,
                                opacity: 0.5,
                              }}
                            >
                              <Text size="xs" c="dimmed">
                                Перерыв{" "}
                                {dayjs(sortedBookings[index - 1].endTime).diff(
                                  bookingStart,
                                  "minute",
                                )}{" "}
                                мин
                              </Text>
                            </Box>
                          )}

                          <Tooltip
                            label={
                              booking.client.phone
                                ? `Телефон: ${booking.client.phone}`
                                : undefined
                            }
                            withArrow
                            disabled={!booking.client.phone}
                          >
                            <Paper
                              withBorder
                              p="sm"
                              mb={index === sortedBookings.length - 1 ? 0 : 0}
                              style={{
                                borderLeft:
                                  "3px solid var(--mantine-color-blue-6)",
                                cursor: booking.client.phone
                                  ? "pointer"
                                  : "default",
                              }}
                            >
                              <Group
                                justify="space-between"
                                align="flex-start"
                                wrap="nowrap"
                              >
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <Text size="sm" fw={500} truncate>
                                    {booking.client.name}
                                  </Text>
                                  {booking.client.phone && (
                                    <Text size="xs" c="dimmed">
                                      {booking.client.phone}
                                    </Text>
                                  )}
                                </div>
                                <div
                                  style={{ textAlign: "right", flexShrink: 0 }}
                                >
                                  <Text size="sm" fw={500}>
                                    {bookingStart.format("HH:mm")}
                                  </Text>
                                  <Text size="xs" c="dimmed">
                                    {bookingEnd.format("HH:mm")}
                                  </Text>
                                  <Badge
                                    size="xs"
                                    variant="light"
                                    color="blue"
                                    mt={2}
                                  >
                                    {bookingDuration} мин
                                  </Badge>
                                </div>
                              </Group>
                            </Paper>
                          </Tooltip>
                        </div>
                      );
                    })}

                    {sortedBookings.length > 0 && (
                      <Box
                        py="xs"
                        px="md"
                        style={{
                          borderLeft: "2px dashed var(--mantine-color-gray-4)",
                          marginLeft: 16,
                          opacity: 0.5,
                        }}
                      >
                        <Text size="xs" c="dimmed">
                          {shiftEnd.format("HH:mm")} — Конец смены
                        </Text>
                      </Box>
                    )}
                  </Stack>
                )}
              </Box>
            </Paper>
          );
        })}
      </Stack>
    </ScrollArea>
  );
};

export default CalendarShiftsMenu;
