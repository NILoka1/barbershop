import { trpc } from "../../main";
import { useDeleteServices } from "../../api/services/delete";
import { useEffect } from "react";

const useServices = () => {
  const servicesList = trpc.services.getAll.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

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
    handleDelete,
  };
};

export default useServices;
