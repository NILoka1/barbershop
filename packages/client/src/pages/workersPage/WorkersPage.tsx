import {
  Button,
  Flex,
  Stack,
  Table,
  Title,
  Text,
  Alert,
  Loader,
} from "@mantine/core";
import useWorkers from "./useWorkers";
import { IconAlertCircle, IconEdit, IconTrash } from "@tabler/icons-react";
import AddWorkersModal from "./AddWorkersModal";

const WorkersPage = () => {
  const {
    workersList,
    isLoading,
    error,
    opened,
    close,
    open,
    handleCreate,
    handleUpdate,
  } = useWorkers();

  if (isLoading) {
    return (
      <Flex justify="center" align="center" h={200}>
        <Loader />
      </Flex>
    );
  }

  if (error) {
    return (
      <Alert icon={<IconAlertCircle size={16} />} color="red">
        {error.message}
      </Alert>
    );
  }

  if (!workersList?.data?.length) {
    return (
      <Stack>
        <Text>Ещё нет ни одного работника</Text>
        <Button onClick={open}>Добавить работника</Button>
      </Stack>
    );
  }

  return (
    <>
      <Stack>
        <Flex justify="space-between" align="center">
          <Title order={2}>Мастера</Title>
          <Button onClick={open}>Добавить мастера</Button>
        </Flex>

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
            {workersList.data?.map((worker) => (
              <Table.Tr key={worker.id}>
                <Table.Td>{worker.name}</Table.Td>
                <Table.Td>{worker.email}</Table.Td>
                <Table.Td>{worker.phone}</Table.Td>
                <Table.Td>{worker.isAdmin ? "Да" : "Нет"}</Table.Td>
                <Table.Td>
                  <Flex gap="xs">
                    <Button variant="subtle" size="xs">
                      <IconEdit size={16} />
                    </Button>
                    <Button variant="subtle" color="red" size="xs">
                      <IconTrash size={16} />
                    </Button>
                  </Flex>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Stack>

      <AddWorkersModal
        isLoading={isLoading}
        onClose={close}
        opened={opened}
        handleSubmit={handleCreate}
      />
    </>
  );
};

export default WorkersPage;
