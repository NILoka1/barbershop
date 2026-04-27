import { Paper,Button, Text, Flex } from "@mantine/core";
import dayjs from "dayjs";
import {
  IconTrash,
  IconEdit,
} from "@tabler/icons-react";
import type { ShiftFromDB } from "shared";


interface ShiftsListProps {
  dayDatail: ShiftFromDB[];
  onEdit: (shift: ShiftFromDB) => void;
  onDelete: (id: string) => void;
}

export const ShiftsList = ({ dayDatail, onEdit, onDelete }: ShiftsListProps) => {
  return dayDatail.map((shift) => (
                <Paper withBorder shadow="xs" p="3" mb="sm" key={shift.id}>
                  <Flex justify="space-between" align="center">
                    <Text>{shift.worker.name}</Text>
                    <Flex gap={5} align="center">
                      <Text>
                        {dayjs(shift.startTime)
                          .tz("Europe/Moscow")
                          .format("HH:mm")}{" "}
                        —{" "}
                        {dayjs(shift.endTime)
                          .tz("Europe/Moscow")
                          .format("HH:mm")}
                      </Text>
                      <Button
                        onClick={() => onEdit(shift)}
                        variant="subtle"
                        size="xs"
                      >
                        <IconEdit size={16} />
                      </Button>
                      <Button
                        onClick={() => onDelete(shift.id)}
                        variant="subtle"
                        color="red"
                        size="xs"
                      >
                        <IconTrash size={16} />
                      </Button>
                    </Flex>
                  </Flex>
                </Paper>
              ))
}

