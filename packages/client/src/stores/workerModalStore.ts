// src/stores/modalStore.ts
import { create } from "zustand";
import type { UpdateServiceInput } from "shared";

interface ModalStore {
  isCreateServiceOpened: boolean;
  openCreateServiceModal: () => void;
  closeCreateServiceModal: () => void;

  // Редактирование услуги
  editingService: UpdateServiceInput | null;
  isEditServiceOpened: boolean;
  openEditServiceModal: (service: UpdateServiceInput) => void;
  closeEditServiceModal: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  isCreateServiceOpened: false,
  openCreateServiceModal: () => set({ isCreateServiceOpened: true }),
  closeCreateServiceModal: () => set({ isCreateServiceOpened: false }),

  editingService: null,
  isEditServiceOpened: false,
  openEditServiceModal: (service) =>
    set({ editingService: service, isEditServiceOpened: true }),
  closeEditServiceModal: () =>
    set({ editingService: null, isEditServiceOpened: false }),
}));
