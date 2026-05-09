import { Button, Table } from "@mantine/core";
import React from "react";
import { trpc } from "src/api/client";

export const ClientsPage = () => {
  const clients = trpc.clients.getAll.useQuery().data;

  if (!clients) {
    return <div>Нет клиентов</div>;
  }

  return (
    <>
      <Table.ScrollContainer minWidth={500}>
        <Table>
          <Table.Thead>
            <Table.Tr>
                <Table.Td>Имя</Table.Td>
                <Table.Td>Телефон</Table.Td>
                <Table.Td>Почта</Table.Td>
                <Table.Td>Действия</Table.Td>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {clients.map((client) => (
                <Table.Tr key={client.id}>
                    <Table.Td>{client.name}</Table.Td>
                    <Table.Td>{client.phone}</Table.Td>
                    <Table.Td>{client.email}</Table.Td>
                    <Table.Td>
                        <Button>Изменить</Button>
                    </Table.Td>
                </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </>
  );
};
