// src/components/EditServiceModal/EditServiceModalContainer.tsx
import { useModalStore } from "src/stores/workerModalStore";
import { EditServiceModal } from "./EditServiceModal";

export function EditServiceModalContainer() {
  const { isEditServiceOpened, editingService, closeEditServiceModal } = useModalStore();

  if (!isEditServiceOpened || !editingService) return null;

  return (
    <EditServiceModal
      key={editingService.id}
      opened={isEditServiceOpened}
      onClose={closeEditServiceModal}
      service={editingService}
    />
  );
}