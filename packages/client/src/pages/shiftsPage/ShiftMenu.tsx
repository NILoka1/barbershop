import { Paper, Tabs, Button, Text, Flex } from "@mantine/core";
import dayjs from "dayjs";
import { useState } from "react";
import type { ShiftFromDB } from "shared";
import { IconClock, IconCalendar, IconTrash } from "@tabler/icons-react";
import { useModalStore } from "src/stores/workerModalStore";
import { confirmModal } from "src/utils/confirmModals";
import { useDeleteShift } from "src/api/shifts/delete";

interface ShiftMenuProps {
  dayDatail: ShiftFromDB[];
  currentMonth: Date;
}

export const ShiftMenu = ({ dayDatail, currentMonth }: ShiftMenuProps) => {
  const [activeTab, setActiveTab] = useState<string | null>("shifts");

  const openCreateModal = useModalStore((state) => state.openCreateShiftModal);
  const deleteShift = useDeleteShift({
    startDate: dayjs(currentMonth).startOf("month").toISOString(),
    endDate: dayjs(currentMonth).endOf("month").toISOString(),
  });
  const handleDelete = (id: string) => {
    confirmModal("Вы действительно хотите удалить эту смену", () => {
      deleteShift.mutate({ id: id });
    });
  };

  if (!dayDatail || dayDatail.length === 0) {
    return (
      <Paper withBorder shadow="md" w="100%" h="100%" p="md">
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
                  <Flex gap={5} align="center">
                    <Text>
                      {dayjs(shift.startTime)
                        .tz("Europe/Moscow")
                        .format("HH:mm")}{" "}
                      —{" "}
                      {dayjs(shift.endTime).tz("Europe/Moscow").format("HH:mm")}
                    </Text>
                    <Button
                      onClick={() => handleDelete(shift.id)}
                      variant="subtle"
                      color="red"
                      size="xs"
                      
                    >
                      <IconTrash size={16} />
                    </Button>
                  </Flex>
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
    </>
  );
};
