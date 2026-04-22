import {modals} from "@mantine/modals";

export const confirmModal = (title: string, onConfirm: () => void) => {
  return modals.openConfirmModal({
    title: title,
    labels: { confirm: "Да", cancel: "Нет" },
    onConfirm: () => onConfirm(),
  });
};
