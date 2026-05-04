import React from "react";
import { Button, Flex, Table, Text } from "@mantine/core";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { getCategoryLabel, type UpdateServiceInput } from "shared";

interface ServicesListProps {
  services: UpdateServiceInput[];
  handleDelete: (id: string) => void;
  openEditModal: (service: UpdateServiceInput) => void;
}

export const ServicesList = React.memo(
  ({ services, handleDelete, openEditModal }: ServicesListProps) => {
    if (!services.length) {
      return <Text>Нет услуг для отображения</Text>;
    }

    return (
      <Table.ScrollContainer minWidth={500}>
        <Table striped highlightOnHover withTableBorder>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Название</Table.Th>
              <Table.Th>Категория</Table.Th>
              <Table.Th>Длительность</Table.Th>
              <Table.Th>Цена</Table.Th>
              <Table.Th>Действия</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {services.map((service) => (
              <Table.Tr key={service.id}>
                <Table.Td>{service.name}</Table.Td>
                <Table.Td>
                  {getCategoryLabel(service.category || "SALON")}
                </Table.Td>
                <Table.Td>{service.duration} мин</Table.Td>
                <Table.Td>{String(service.price)} ₽</Table.Td>
                <Table.Td>
                  <Flex gap="xs">
                    <Button
                      onClick={() => {
                        openEditModal(service);
                      }}
                      variant="subtle"
                      size="xs"
                    >
                      <IconEdit size={16} />
                    </Button>
                    <Button
                      onClick={() => handleDelete(service.id)}
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
    );
  },
);
