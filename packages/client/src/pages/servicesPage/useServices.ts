import { trpc } from "../../main";
import { useState } from "react";
import { type AddServiceInput } from "shared";
import { useDisclosure } from "@mantine/hooks";
import { useCreateServices } from "../../api/services/create";
import { useUpdateServices } from "../../api/services/update";
import { useDeleteServices } from "../../api/services/delete";

interface EditingService {
  id: string;
  name: string;
  category: AddServiceInput["category"];
  duration: number;
  price: number;
  description?: string;
}

const useServices = () => {
  const servicesList = trpc.services.getAll.useQuery();

  const [opened, { open, close }] = useDisclosure(false);
  const [editingService, setEditingService] = useState<EditingService | null>(
    null,
  );

  const CreateServices = useCreateServices();
  const UpdateServices = useUpdateServices();

  const handleCreate = () => {
    setEditingService(null);
    open();
  };

  type ServiceItem = NonNullable<typeof servicesList.data>[number];
  const handleUpdate = (service: ServiceItem) => {
    console.log(1, service);
    setEditingService({
      id: service.id,
      name: service.name,
      category: service.category as EditingService["category"],
      duration: service.duration,
      price: Number(service.price),
      description: service.description || undefined,
    });
    open();
  };
  const handleSubmit = async (values: AddServiceInput & { id: string }) => {
    if (editingService) {
      UpdateServices.mutate(values);
      console.log("Обновить:", values);
    } else {
      CreateServices.mutate(values);
      console.log("Создать:", values);
    }
    close();
  };

  const deleteService = useDeleteServices();
  const handleDelete = async (id: string) => {
    if (confirm("Удалить услугу? ")) {
      deleteService.mutate({ id: id });
    }
  };

  return {
    servicesList,
    isLoading: servicesList.isLoading,
    error: servicesList.error,
    opened,
    handleCreate,
    handleUpdate,
    handleSubmit,
    handleDelete,
    close,
    editingService,
  };
};

export default useServices;
