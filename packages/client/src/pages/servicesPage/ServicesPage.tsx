import {
  Flex,
  Table,
  Loader,
  Alert,
  Title,
  Stack,
  Button,
  Text,
} from "@mantine/core";
import { IconAlertCircle, IconEdit, IconTrash } from "@tabler/icons-react";
import useServices from "./useServices";
import { getCategoryLabel } from "shared";
import { useModalStore } from "../../stores/workerModalStore";
import { EditServiceModalContainer } from "./modals/EditModalContainer";
import { CreateServiceModalContainer } from "./modals/CreateModalContainer";
const ServicesPage = () => {
  const { servicesList, isLoading, error, handleDelete } = useServices();
  const openEditModal = useModalStore((state) => state.openEditServiceModal);
  const openCreateModal = useModalStore(
    (state) => state.openCreateServiceModal,
  );

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

  if (!servicesList?.data?.length) {
    return (
      <Stack>
        <Text>Ещё нет ни одной услуги</Text>
        <Button
          onClick={() => {
            openCreateModal();
          }}
        >
          Добавить услугу
        </Button>
      </Stack>
    );
  }

  return (
    <>
      <Stack>
        <Flex justify="space-between" align="center">
          <Title order={2}>Услуги</Title>
          <Button
            onClick={() => {
              openCreateModal();
            }}
          >
            Добавить услугу
          </Button>
        </Flex>

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
            {servicesList.data.map((service) => (
              <Table.Tr key={service.id}>
                <Table.Td>{service.name}</Table.Td>
                <Table.Td>{getCategoryLabel(service.category)}</Table.Td>
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
      </Stack>
      <CreateServiceModalContainer />
      <EditServiceModalContainer />
    </>
  );
};

export default ServicesPage;
