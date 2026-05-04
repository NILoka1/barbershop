import React from "react";
import { Button, Flex, Table, Text } from "@mantine/core";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import type { workersUpdateInput } from "shared";

interface WorkersListProps {
  workers: workersUpdateInput[];
  handleDelete: (id: string) => void;
  openEditModal: (worker: workersUpdateInput) => void;
}

export const WorkersList = React.memo(
  ({ workers, handleDelete, openEditModal }: WorkersListProps) => {
    if (!workers.length) {
      return <Text>Нет мастеров для отображения</Text>;
    }

    return (
      <Table.ScrollContainer minWidth={500}>
        <Table striped highlightOnHover withTableBorder>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Имя</Table.Th>
              <Table.Th>Почта</Table.Th>
              <Table.Th>Телефон</Table.Th>
              <Table.Th>Администрация</Table.Th>
              <Table.Th>Действия</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {workers.map((worker) => (
              <Table.Tr key={worker.id}>
                <Table.Td>{worker.name}</Table.Td>
                <Table.Td>{worker.email}</Table.Td>
                <Table.Td>{worker.phone}</Table.Td>
                <Table.Td>{worker.isAdmin ? "Да" : "Нет"}</Table.Td>
                <Table.Td>
                  <Flex gap="xs">
                    <Button
                      onClick={() => openEditModal(worker)}
                      variant="subtle"
                      size="xs"
                      aria-label="edit"
                    >
                      <IconEdit size={16} />
                    </Button>
                    <Button
                      onClick={() => {
                        handleDelete(worker.id);
                      }}
                      variant="subtle"
                      color="red"
                      size="xs"
                      aria-label="delete"
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
