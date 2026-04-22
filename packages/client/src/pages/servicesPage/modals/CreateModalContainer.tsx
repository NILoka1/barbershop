import { useModalStore } from "src/stores/workerModalStore";
import { CreateServiceModal } from "./CreateServiceModal";

export function CreateServiceModalContainer() {
  const { isCreateServiceOpened, closeCreateServiceModal } = useModalStore();

  if (!isCreateServiceOpened ) return null;

  return (
    <CreateServiceModal
      opened={isCreateServiceOpened}
      onClose={closeCreateServiceModal}
    />
  );
}