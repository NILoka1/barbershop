import { useDeleteWorker } from "src/api/workers/delete";
import { trpc } from "../..//main";
import { confirmModal } from "src/utils/confirmModals";

const useWorkers = () => {
  const workersList = trpc.workers.getAll.useQuery();

  const deleteService = useDeleteWorker();
  const handleDelete = async (id: string) => {
    confirmModal("Вы действительно хотите удалить этого сотрудника?", () =>
      deleteService.mutate({ id: id }),
    );
  };

  return {
    workersList,
    isLoading: workersList.isLoading,
    error: workersList.error,
    handleDelete,
  };
};

export default useWorkers;
