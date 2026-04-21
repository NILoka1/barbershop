import { trpc } from "../..//main";

const useWorkers = () => {
  const workersList = trpc.workers.getAll.useQuery();

  return {
    workersList,
    isLoading: workersList.isLoading,
    error: workersList.error,
  };
};

export default useWorkers;
