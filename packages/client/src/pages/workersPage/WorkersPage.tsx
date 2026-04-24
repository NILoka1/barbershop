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
import AddWorkersModal from "./AddWorkersModal";
import UpdateWorkersModal from "./UpdateWorkersModal";
import { useModalStore } from "../../stores/workerModalStore";
import { useMediaQuery } from "@mantine/hooks";

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
  const openEditModal = useModalStore((state) => state.openEditWorkerModal);
  const openCreateModal = useModalStore((state) => state.openCreateWorkerModal);
  const isMobile = useMediaQuery("(max-width: 768px)");

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
        <Button onClick={openCreateModal}>Добавить работника</Button>
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

          <Button onClick={openCreateModal}>
            Добавить мастера
          </Button>
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
                        onClick={() => openEditModal(worker)}
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
      <AddWorkersModal />
      <UpdateWorkersModal />
    </>
  );
};

export default WorkersPage;
