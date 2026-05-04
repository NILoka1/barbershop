import { Flex, Alert, Stack, Button, Text, Loader } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import useServices from "./useServices";
import { type UpdateServiceInput } from "shared";
import { useDisclosure } from "@mantine/hooks";
import { CreateServiceModal } from "./modals/CreateServiceModal";
import { EditServiceModal } from "./modals/EditServiceModal";
import { useState } from "react";
import { ServicesHeader } from "./ServicesHeader";
import { ServicesList } from "./ServicesList";

const ServicesPage = () => {
  const {
    servicesList,
    isLoading,
    error,
    handleDelete,
    query,
    setQuery,
    filtered,
  } = useServices();

  const [createOpened, { open: createOpen, close: createClose }] =
    useDisclosure();
  const [editOpened, { open: editOpen, close: editClose }] = useDisclosure();
  const [editingSetvice, setEditingService] =
    useState<UpdateServiceInput | null>(null);

  const handleOpenEdit = (service: UpdateServiceInput) => {
    setEditingService(service);
    editOpen();
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

  if (!servicesList.data?.length) {
    return (
      <Stack>
        <Text>Ещё нет ни одной услуги</Text>
        <Button onClick={createOpen}>Добавить услугу</Button>
      </Stack>
    );
  }

  return (
    <>
      <Stack w={"100%"}>
        <ServicesHeader
          query={query}
          setQuery={setQuery}
          openCreateModal={createOpen}
        />
        <ServicesList
          services={filtered}
          handleDelete={handleDelete}
          openEditModal={handleOpenEdit}
        />
      </Stack>
      {createOpened && (
        <CreateServiceModal opened={createOpened} onClose={createClose} />
      )}
      {editOpened && editingSetvice && (
        <EditServiceModal
          opened={editOpened}
          onClose={editClose}
          service={editingSetvice}
        />
      )}
    </>
  );
};

export default ServicesPage;
