import { Paper, Tabs, Button, Text } from "@mantine/core";
import React, { useState } from "react";
import type { ShiftFromDB } from "shared";
import { IconClock, IconCalendar } from "@tabler/icons-react";
import { confirmModal } from "src/utils/confirmModals";
import { useDeleteShift } from "src/api/shifts/delete";
import { ShiftsList } from "./Shift/ShiftsList";
import BookingList from "./Booking/BookingList";

interface ShiftMenuProps {
  dayDatail: ShiftFromDB[];
  currentMonth: {
    startDate: string;
    endDate: string;
  };
  onEdit: (shift: ShiftFromDB) => void;
  onCreate: () => void;
}

export const DashboardMenu = React.memo(
  ({ dayDatail, currentMonth, onEdit, onCreate }: ShiftMenuProps) => {
    const [activeTab, setActiveTab] = useState<string | null>("shifts");
    const deleteShift = useDeleteShift(currentMonth);
    const handleDelete = (id: string) => {
      confirmModal("Вы действительно хотите удалить эту смену", () => {
        deleteShift.mutate({ id: id });
      });
    };

    if (!dayDatail || dayDatail.length === 0) {
      return (
        <>
          <Paper withBorder shadow="md" w="100%" h="100%" p="md">
            <Text ta="center">Нет данных для выбранного дня</Text>
            <Button mb="sm" w={"100%"} onClick={onCreate}>
              Добавить смену
            </Button>
          </Paper>
        </>
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
              <Tabs.Tab
                value="bookings"
                leftSection={<IconCalendar size={16} />}
              >
                Записи
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="shifts" pt="sm" h={"80%"}>
              <Button mb="sm" w={"100%"} onClick={onCreate}>
                Добавить смену
              </Button>
              <ShiftsList
                dayDatail={dayDatail}
                onEdit={onEdit}
                onDelete={handleDelete}
              />
            </Tabs.Panel>

            <Tabs.Panel value="bookings" pt="md">
              <Button mb="md" w={"100%"}>
                Добавить запись
              </Button>
              <BookingList />
            </Tabs.Panel>
          </Tabs>
        </Paper>
      </>
    );
  },
);
