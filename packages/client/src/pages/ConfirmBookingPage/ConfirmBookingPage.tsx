import { Button, Flex, Table, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconCheck } from "@tabler/icons-react";
import dayjs from "dayjs";
import { useConfirmBooking } from "src/api/booking/confirm";
import { trpc } from "src/api/client";

const ConfirmBookingPage = () => {
  const BookingToConfirm = trpc.booking.BookingToConfirm.useQuery();

  const toConfirm = useConfirmBooking();

  const handleConfirm = (id: string) => {
    modals.openConfirmModal({
      title: "Утвердить бронирование",
      size: "sm",
      children: (
        <>
          <Text>Хотите подтвердить запись?</Text>
        </>
      ),
      labels: { confirm: "Утвердить", cancel: "Отмена" },
      onConfirm: () => {
        toConfirm.mutate({ id });
      },
    });
  };

  return (
    <Table.ScrollContainer w={"100%"} minWidth={500}>
      <Table w={"100%"} striped highlightOnHover withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Исполнитель</Table.Th>
            <Table.Th>Клиент</Table.Th>
            <Table.Th>Услуга</Table.Th>
            <Table.Th>Начало</Table.Th>
            <Table.Th>Конец</Table.Th>
            <Table.Th>Телефон</Table.Th>
            <Table.Th>Действия</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {BookingToConfirm.data?.map((booking) => (
            <Table.Tr>
              <Table.Td>{booking.shift.worker.name}</Table.Td>
              <Table.Td>{booking.client.name}</Table.Td>
              <Table.Td>{booking.service.name}</Table.Td>
              <Table.Td>
                {dayjs(booking.startTime).format("DD.MM.YYYY HH:mm")}
              </Table.Td>
              <Table.Td>
                {dayjs(booking.endTime).format("DD.MM.YYYY HH:mm")}
              </Table.Td>
              <Table.Td>{booking.client.phone}</Table.Td>
              <Table.Td>
                <Flex>
                  <Button
                    onClick={() => handleConfirm(booking.id)}
                    variant="subtle"
                    size="xs"
                  >
                    <IconCheck size={16} />
                  </Button>
                </Flex>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
};

export default ConfirmBookingPage;
