import { Paper, Text, Group, ActionIcon, Badge } from "@mantine/core";
import dayjs from "dayjs";
import { IconTrash, IconEdit } from "@tabler/icons-react";
import type { ShiftFromDB } from "shared";
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(isBetween);

interface ShiftsListProps {
  dayDatail: ShiftFromDB[];
  onEdit: (shift: ShiftFromDB) => void;
  onDelete: (id: string) => void;
}

export const ShiftsList = ({
  dayDatail,
  onEdit,
  onDelete,
}: ShiftsListProps) => {
  return dayDatail.map((shift) => {
    const isPast = dayjs(shift.endTime).isBefore(dayjs());
    const isCurrent = dayjs().isBetween(shift.startTime, shift.endTime);
    
    return (
      <Paper
        key={shift.id}
        withBorder
        shadow="xs"
        p="xs"
        mb="xs"
        style={{
          borderLeft: `3px solid ${
            isCurrent ? "#40C057" : isPast ? "#CED4DA" : "#228be6"
          }`,
          opacity: isPast ? 0.6 : 1,
        }}
      >
        <Group justify="space-between" mb={4}>
          <div>
            <Text size="sm" fw={500}>
              {shift.worker.name}
            </Text>
            {shift.worker.isAdmin && (
              <Text size="xs" c="dimmed">
                Администратор
              </Text>
            )}
          </div>
          
          {isCurrent && (
            <Badge size="xs" color="green" variant="light">
              Сейчас
            </Badge>
          )}
          {isPast && (
            <Badge size="xs" color="gray" variant="light">
              Завершена
            </Badge>
          )}
        </Group>

        <Group justify="space-between" align="center">
          <Text size="xs" fw={500}>
            {dayjs(shift.startTime).format("HH:mm")} —{" "}
            {dayjs(shift.endTime).format("HH:mm")}
          </Text>
          
          <Group gap={2}>
            <ActionIcon
              variant="subtle"
              color="gray"
              size="sm"
              onClick={() => onEdit(shift)}
              title="Редактировать"
            >
              <IconEdit size={14} />
            </ActionIcon>
            <ActionIcon
              variant="subtle"
              color="red"
              size="sm"
              onClick={() => onDelete(shift.id)}
              title="Удалить"
            >
              <IconTrash size={14} />
            </ActionIcon>
          </Group>
        </Group>
      </Paper>
    );
  });
};