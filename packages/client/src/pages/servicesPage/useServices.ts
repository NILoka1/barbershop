import { trpc } from "../../main";
import { useDeleteServices } from "../../api/services/delete";
import { confirmModal } from "src/utils/confirmModals";

const useServices = () => {
  const servicesList = trpc.services.getAll.useQuery();

  const deleteService = useDeleteServices();
  const handleDelete = async (id: string) => {
    confirmModal("Вы действительно хотите удалить эту услугу?", () => deleteService.mutate({ id: id }));
  };


 
  
  return {
    servicesList,
    isLoading: servicesList.isLoading,
    error: servicesList.error,
    handleDelete,
  };
};

export default useServices;
