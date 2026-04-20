import { useDisclosure } from "@mantine/hooks";
import { trpc } from "../..//main";
import type { workersRegistrateInput } from "shared";
import { useCreateWorkers } from "../../api/workers/create";

const useWorkers = () => {
  const workersList = trpc.workers.getAll.useQuery();
  const [opened, { open, close }] = useDisclosure(false);

  const CreateWorkers = useCreateWorkers();

  const handleCreate = (values: workersRegistrateInput) => {
    CreateWorkers.mutate(values);
  };

  const handleUpdate = () => {};

  return {
    workersList,
    isLoading: workersList.isLoading,
    error: workersList.error,
    opened,
    close,
    open,
    handleCreate,
    handleUpdate,
  };
};

export default useWorkers;
