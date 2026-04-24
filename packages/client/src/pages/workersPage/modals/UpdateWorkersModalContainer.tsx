import { useModalStore } from "src/stores/workerModalStore";
import UpdateWorkersModal from "./UpdateWorkersModal";

export function UpdateWorkersModalContainer() {
  const { isEditWorkerOpened, editingWorker, closeEditWorkerModal } =
    useModalStore();

  if (!isEditWorkerOpened) return null;

  return (
    <UpdateWorkersModal
      opened={isEditWorkerOpened}
      onClose={closeEditWorkerModal}
      editingWorker={editingWorker}
    />
  );
}
