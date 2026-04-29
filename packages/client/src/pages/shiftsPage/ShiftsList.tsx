import React from "react";
import type { ShiftFromDB } from "shared";
import { Button, Flex, Table, Text } from "@mantine/core";
import dayjs from "dayjs";
import { IconEdit, IconTrash } from "@tabler/icons-react";

interface ShifttsListProps {
  ShiftsData: ShiftFromDB[] | undefined;
  openEditModal: (item: ShiftFromDB) => void;
  handleDelete: (id: string) => void;
}

export const ShiftsList = React.memo(
  ({ ShiftsData, openEditModal, handleDelete }: ShifttsListProps) => {
    if (ShiftsData && ShiftsData.length === 0) {
      return <Text>Нет смен за выбранный период</Text>;
    }

    return (
      <>
        <Table.ScrollContainer minWidth={500}>
          <Table striped highlightOnHover withTableBorder>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Имя</Table.Th>
                <Table.Th>Начало</Table.Th>
                <Table.Th>Конец</Table.Th>
                <Table.Th>Действия</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {ShiftsData?.map((shift) => (
                <Table.Tr>
                  <Table.Td>{shift.worker.name}</Table.Td>
                  <Table.Td>
                    {dayjs(shift.startTime).format("DD.MM.YYYY HH:mm")}
                  </Table.Td>
                  <Table.Td>
                    {dayjs(shift.endTime).format("DD.MM.YYYY HH:mm")}
                  </Table.Td>
                  <Table.Td>
                    <Flex>
                      <Button
                        onClick={() => {
                          openEditModal(shift);
                        }}
                        variant="subtle"
                        size="xs"
                      >
                        <IconEdit size={16} />
                      </Button>
                      <Button
                        onClick={() => handleDelete(shift.id)}
                        variant="subtle"
                        color="red"
                        size="xs"
                      >
                        <IconTrash size={16} />
                      </Button>
                    </Flex>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </>
    );
  },
);
