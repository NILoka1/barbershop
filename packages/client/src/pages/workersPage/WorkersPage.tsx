import {
  Button,
  Flex,
  Stack,
  Table,
  Title,
  Text,
  Alert,
  Loader,
  TextInput,
} from "@mantine/core";
import useWorkers from "./useWorkers";
import {
  IconAlertCircle,
  IconEdit,
  IconSearch,
  IconTrash,
} from "@tabler/icons-react";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { CreateServiceModal } from "../servicesPage/modals/CreateServiceModal";
import UpdateWorkersModal from "./modals/UpdateWorkersModal";
import { useState } from "react";
import type { workersUpdateInput } from "shared";

const WorkersPage = () => {
  const {
    workersList,
    isLoading,
    error,
    handleDelete,
    query,
    setQuery,
    filtered,
  } = useWorkers();

  const [
    createModalOpened,
    { open: createModalOpen, close: createModalClose },
  ] = useDisclosure();
  const [editModalOpened, { open: editModalOpen, close: editModalClose }] =
    useDisclosure();

  const [editingWorker, setEditingWorker] = useState<workersUpdateInput | null>(
    null,
  );

  const isMobile = useMediaQuery("(max-width: 768px)");

  const handleOpenCreateModal = (worker: workersUpdateInput) => {
    editModalOpen();
    setEditingWorker(worker);
  };

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
        <Button onClick={createModalOpen}>Добавить работника</Button>
      </Stack>
    );
  }
  return (
    <>
      <Stack w={"100%"}>
        <Flex gap={10} justify="space-between" w={"100%"} align="flex-start">
          <Title order={2}>Мастера</Title>

          {!isMobile && (
            <TextInput
              placeholder="Поиск по мастерам..."
              leftSection={<IconSearch size={16} />}
              value={query}
              onChange={(e) => setQuery(e.currentTarget.value)}
              style={{ width: 250 }}
            />
          )}

          <Button onClick={createModalOpen}>Добавить мастера</Button>
        </Flex>
        {isMobile && (
          <TextInput
            placeholder="Поиск по мастерам..."
            leftSection={<IconSearch size={16} />}
            value={query}
            onChange={(e) => setQuery(e.currentTarget.value)}
            w={"100%"}
          />
        )}
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
              {filtered.map((worker) => (
                <Table.Tr key={worker.id}>
                  <Table.Td>{worker.name}</Table.Td>
                  <Table.Td>{worker.email}</Table.Td>
                  <Table.Td>{worker.phone}</Table.Td>
                  <Table.Td>{worker.isAdmin ? "Да" : "Нет"}</Table.Td>
                  <Table.Td>
                    <Flex gap="xs">
                      <Button
                        onClick={() => handleOpenCreateModal(worker)}
                        variant="subtle"
                        size="xs"
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
      </Stack>
      <CreateServiceModal
        opened={createModalOpened}
        onClose={createModalClose}
      />
      <UpdateWorkersModal
        opened={editModalOpened}
        onClose={editModalClose}
        editingWorker={editingWorker}
      />
    </>
  );
};

export default WorkersPage;
