import { Button, Flex, Stack, Text, Alert, Loader } from "@mantine/core";
import useWorkers from "./useWorkers";
import { IconAlertCircle } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import UpdateWorkersModal from "./modals/UpdateWorkersModal";
import { useState } from "react";
import type { workersUpdateInput } from "shared";
import AddWorkersModal from "./modals/AddWorkersModal";
import { WorkersHeader } from "./WorkersHeader";
import { WorkersList } from "./WorkersList";

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

  const handleOpenCreateModal = (worker: workersUpdateInput) => {
    editModalOpen();
    setEditingWorker(worker);
  };

  if (isLoading) {
    return (
      <Flex justify="center" align="center" h={200}>
        <Loader data-testid="WorkersLoader" />
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
      <Stack w="100%">
        <WorkersHeader 
          query={query} 
          setQuery={setQuery} 
          openCreateModal={createModalOpen} 
        />
        <WorkersList 
          workers={filtered} 
          handleDelete={handleDelete} 
          openEditModal={handleOpenCreateModal} 
        />
      </Stack>
      {createModalOpened && (
        <AddWorkersModal
          opened={createModalOpened}
          onClose={createModalClose}
        />
      )}
      {editModalOpened && editingWorker && (
        <UpdateWorkersModal
          opened={editModalOpened}
          onClose={editModalClose}
          editingWorker={editingWorker}
        />
      )}
    </>
  );
};

export default WorkersPage;
