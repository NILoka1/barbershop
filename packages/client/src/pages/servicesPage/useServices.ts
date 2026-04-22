import { trpc } from "../../main";
import { useDeleteServices } from "../../api/services/delete";
import { confirmModal } from "src/utils/confirmModals";
import { useSearch } from "src/utils/useSearch";
import { filterServices } from "src/utils/searchers/filterServices";

const useServices = () => {
  const servicesList = trpc.services.getAll.useQuery();

  const deleteService = useDeleteServices();
  const handleDelete = async (id: string) => {
    confirmModal("Вы действительно хотите удалить эту услугу?", () =>
      deleteService.mutate({ id: id }),
    );
  };

  const { query, setQuery, filtered } = useSearch(
  servicesList.data,
  filterServices
);

  return {
    servicesList,
    isLoading: servicesList.isLoading,
    error: servicesList.error,
    handleDelete,
    query,
    setQuery,
    filtered,
  };
};

export default useServices;
