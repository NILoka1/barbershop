import { Paper, Tabs, Button, Text, Flex } from "@mantine/core";
import dayjs from "dayjs";
import { useState } from "react";
import type { ShiftFromDB } from "shared";

import { IconClock, IconCalendar } from "@tabler/icons-react";

interface ShiftMenuProps {
  dayDatail: ShiftFromDB[];
}

export const ShiftMenu = ({ dayDatail }: ShiftMenuProps) => {
  const [activeTab, setActiveTab] = useState<string | null>("shifts");

  if (!dayDatail || dayDatail.length === 0) {
    return (
      <Paper withBorder shadow="sm" p="md">
        <Text ta="center">Нет данных для выбранного дня</Text>
      </Paper>
    );
  }

  return (
    <Paper withBorder shadow="md" w="100%" h="100%" p="md">
      <Tabs value={activeTab} onChange={setActiveTab} h={"100%"}>
        <Tabs.List>
          <Tabs.Tab value="shifts" leftSection={<IconClock size={16} />}>
            Смены
          </Tabs.Tab>
          <Tabs.Tab value="bookings" leftSection={<IconCalendar size={16} />}>
            Записи
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="shifts" pt="sm" h={"80%"}>
          <Button mb="sm" w={"100%"}>
            Добавить смену
          </Button>
          {dayDatail.map((shift) => (
            <Paper withBorder shadow="xs" p="3" mb="sm" key={shift.id}>
              <Flex justify="space-between" align="center">
                <Text>{shift.worker.name}</Text>
                <Text>
                  {dayjs(shift.startTime).format("HH:mm")} —{" "}
                  {dayjs(shift.endTime).format("HH:mm")}
                </Text>
              </Flex>
            </Paper>
          ))}
        </Tabs.Panel>

        <Tabs.Panel value="bookings" pt="md">
          <Button mb="md" w={"100%"}>
            Добавить запись
          </Button>
        </Tabs.Panel>
      </Tabs>
    </Paper>
  );
};
