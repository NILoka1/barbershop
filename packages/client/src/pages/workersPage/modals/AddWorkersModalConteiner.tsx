import { useModalStore } from "src/stores/workerModalStore";
import AddWorkersModal from "./AddWorkersModal";

export function CreateServiceModalContainer() {
  const { isCreateWorkerOpened, closeCreateWorkerModal } = useModalStore();

  if (!isCreateWorkerOpened ) return null;

  return (
    <AddWorkersModal
      opened={isCreateWorkerOpened}
      onClose={closeCreateWorkerModal}
    />
  );
}