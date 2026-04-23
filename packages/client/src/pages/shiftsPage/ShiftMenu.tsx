import { Paper, Tabs, Button, Text, Flex } from "@mantine/core";
import dayjs from "dayjs";
import { useState } from "react";
import type { ShiftFromDB } from "shared";
import { IconClock, IconCalendar } from "@tabler/icons-react";
import { useModalStore } from "src/stores/workerModalStore";
import { CreateShiftModal } from "./CreateShiftModal";

interface ShiftMenuProps {
  dayDatail: ShiftFromDB[];
  selected: Date | null; // 👈 ДОБАВИТЬ
}

export const ShiftMenu = ({ dayDatail, selected }: ShiftMenuProps) => {
  const [activeTab, setActiveTab] = useState<string | null>("shifts");

  const openCreateModal = useModalStore((state) => state.openCreateShiftModal);

  if (!dayDatail || dayDatail.length === 0) {
    return (
      <Paper withBorder shadow="sm" p="md">
        <Text ta="center">Нет данных для выбранного дня</Text>
        <Button mb="sm" w={"100%"} onClick={openCreateModal}>
          Добавить смену
        </Button>
      </Paper>
    );
  }

  return (
    <>
      <Paper withBorder shadow="md" w="100%" h="100%" p="md">
        <Tabs value={activeTab} onChange={setActiveTab} h={"100%"}>
          <Tabs.List justify="center">
            <Tabs.Tab value="shifts" leftSection={<IconClock size={16} />}>
              Смены
            </Tabs.Tab>
            <Tabs.Tab value="bookings" leftSection={<IconCalendar size={16} />}>
              Записи
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="shifts" pt="sm" h={"80%"}>
            <Button mb="sm" w={"100%"} onClick={openCreateModal}>
              Добавить смену
            </Button>
            {dayDatail.map((shift) => (
              <Paper withBorder shadow="xs" p="3" mb="sm" key={shift.id}>
                <Flex justify="space-between" align="center">
                  <Text>{shift.worker.name}</Text>
                  <Text>
                    {dayjs(shift.startTime).tz("Europe/Moscow").format("HH:mm")}{" "}
                    — {dayjs(shift.endTime).tz("Europe/Moscow").format("HH:mm")}
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
      <CreateShiftModal date={dayjs(selected).format("YYYY-MM-DD")} />
    </>
  );
};
