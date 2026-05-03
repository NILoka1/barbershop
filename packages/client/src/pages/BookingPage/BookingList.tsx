import { Button, Flex, Table } from "@mantine/core";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import dayjs from "dayjs";
import React, { memo } from "react";
import type { BookingFromDB } from "shared";

interface BookingListProps {
  BookingData: BookingFromDB[] | undefined;
  openEditModal: (item: BookingFromDB) => void;
  handleDelete: (id: string) => void;
}

export default memo(function BookingList({
  BookingData,
  openEditModal,
  handleDelete,
}: BookingListProps) {
  return (
    <>
      <Table.ScrollContainer w={"100%"} minWidth={500}>
        <Table w={"100%"} striped highlightOnHover withTableBorder>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Исполнитель</Table.Th>
              <Table.Th>Клиент</Table.Th>
              <Table.Th>Услуга</Table.Th>
              <Table.Th>Статус</Table.Th>
              <Table.Th>Начало</Table.Th>
              <Table.Th>Конец</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {BookingData?.map((booking) => (
              <Table.Tr>
                <Table.Td>{booking.shift.worker.name}</Table.Td>
                <Table.Td>{booking.client.name}</Table.Td>
                <Table.Td>{booking.service.name}</Table.Td>
                <Table.Td>{booking.status}</Table.Td>
                <Table.Td>
                  {dayjs(booking.startTime).format("DD.MM.YYYY HH:mm")}
                </Table.Td>
                <Table.Td>
                  {dayjs(booking.endTime).format("DD.MM.YYYY HH:mm")}
                </Table.Td>
                <Table.Td>
                  <Flex>
                    <Button
                      onClick={() => {
                        openEditModal(booking);
                      }}
                      variant="subtle"
                      size="xs"
                    >
                      <IconEdit size={16} />
                    </Button>
                    <Button
                      onClick={() => handleDelete(booking.id)}
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
});
