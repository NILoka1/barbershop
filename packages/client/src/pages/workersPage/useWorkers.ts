import { useDeleteWorker } from "src/api/workers/delete";
import { trpc } from "../..//main";
import { confirmModal } from "src/utils/confirmModals";
import { useSearch } from "src/utils/useSearch";
import { filterWorkers } from "src/utils/searchers/filterWorkers";

const useWorkers = () => {
  const workersList = trpc.workers.getAll.useQuery();

  const deleteService = useDeleteWorker();
  const handleDelete = async (id: string) => {
    confirmModal("Вы действительно хотите удалить этого сотрудника?", () =>
      deleteService.mutate({ id: id }),
    );
  };
  const { query, setQuery, filtered } = useSearch(
    workersList.data,
    filterWorkers,
  );
  return {
    workersList,
    isLoading: workersList.isLoading,
    error: workersList.error,
    handleDelete,
    query,
    setQuery,
    filtered,
  };
};

export default useWorkers;
