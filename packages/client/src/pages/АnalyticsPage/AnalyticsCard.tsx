import {
  Card,
  Text,
  Group,
  Stack,
  ThemeIcon,
  SimpleGrid,
  Paper,
  ScrollArea,
} from "@mantine/core";
import {
  IconCalendar,
  IconCash,
  IconChartBar,
  IconCrown,
} from "@tabler/icons-react";
import React from "react";
import type { AnalyticsBookingFromDB } from "shared";

interface AnalyticsCardProps {
  totalBookings?: number;
  totalRevenue?: number;
  averagePerMonth?: number;
  bookings?: AnalyticsBookingFromDB[];
}

const MONTHS = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
];

const AnalyticsCard = React.memo(
  ({
    totalBookings,
    totalRevenue,
    averagePerMonth,
    bookings,
  }: AnalyticsCardProps) => {
    const maxRevenue = bookings
      ? Math.max(...bookings.map((b) => b.totalRevenue), 1)
      : 1;

    return (
      <Card shadow="sm" padding="md" radius="md" withBorder>
        <Stack gap="md">
          <SimpleGrid cols={3}>
            <div>
              <ThemeIcon variant="light" color="blue" size="lg" mb={8}>
                <IconCalendar size={18} />
              </ThemeIcon>
              <Text size="xs" c="dimmed" tt="uppercase">
                Записей
              </Text>
              <Text fw={700} size="lg">
                {totalBookings}
              </Text>
            </div>

            <div>
              <ThemeIcon variant="light" color="green" size="lg" mb={8}>
                <IconCash size={18} />
              </ThemeIcon>
              <Text size="xs" c="dimmed" tt="uppercase">
                Доход
              </Text>
              <Text fw={700} size="lg">
                {totalRevenue?.toLocaleString()} ₽
              </Text>
            </div>

            <div>
              <ThemeIcon variant="light" color="violet" size="lg" mb={8}>
                <IconChartBar size={18} />
              </ThemeIcon>
              <Text size="xs" c="dimmed" tt="uppercase">
                Среднее
              </Text>
              <Text fw={700} size="lg">
                {averagePerMonth?.toLocaleString()} ₽
              </Text>
            </div>
          </SimpleGrid>

          {bookings && (
            <ScrollArea h={"60vh"} type="auto" pr={"xs"}>
              <Stack gap={4}>
                {bookings.map((month) => {
                  const isBest =
                    month.totalRevenue === maxRevenue && month.totalRevenue > 0;
                  const widthPercent = (month.totalRevenue / maxRevenue) * 100;

                  return (
                    <Paper
                      key={month.month}
                      withBorder={isBest}
                      p="xs"
                      style={{
                        borderColor: isBest
                          ? "var(--mantine-color-green-4)"
                          : undefined,
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          left: 0,
                          top: 0,
                          bottom: 0,
                          width: `${widthPercent}%`,
                          zIndex: 0,
                        }}
                      />

                      <Group
                        justify="space-between"
                        style={{ position: "relative", zIndex: 1 }}
                      >
                        <Group gap="xs">
                          {isBest && (
                            <ThemeIcon variant="light" color="green" size="sm">
                              <IconCrown size={12} />
                            </ThemeIcon>
                          )}
                          <Text size="sm" fw={500}>
                            {MONTHS[month.month]}
                          </Text>
                        </Group>

                        <Group gap="md">
                          <Text size="sm" c="dimmed">
                            {month.totalBookings} записей
                          </Text>
                          <Text size="sm" fw={600}>
                            {month.totalRevenue.toLocaleString()} ₽
                          </Text>
                        </Group>
                      </Group>
                    </Paper>
                  );
                })}
              </Stack>
            </ScrollArea>
          )}
        </Stack>
      </Card>
    );
  },
);

export default AnalyticsCard;
