import { trpc } from "../../main";
import { useState } from "react";
import { type AddServiceInput, type UpdateServiceInput } from "shared";
import { useDisclosure } from "@mantine/hooks";
import { useCreateServices } from "../../api/services/create";
import { useUpdateServices } from "../../api/services/update";
import { useDeleteServices } from "../../api/services/delete";


const useServices = () => {
  const servicesList = trpc.services.getAll.useQuery();

  const [opened, { open, close }] = useDisclosure(false);
  const [editingService, setEditingService] = useState<UpdateServiceInput | null>(
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
      category: service.category as UpdateServiceInput["category"],
      duration: service.duration,
      price: Number(service.price),
      description: service.description || undefined,
    });
    open();
  };
  const handleSubmit = async (values: AddServiceInput & { id?: string }) => {
    if (values.id) {
    const updateData = {
      id: values.id,
      name: values.name,
      category: values.category,
      duration: values.duration,
      price: values.price,
      description: values.description,
    };
    UpdateServices.mutate(updateData);
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
