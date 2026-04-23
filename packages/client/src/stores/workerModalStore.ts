// src/stores/modalStore.ts
import { create } from "zustand";
import type { UpdateServiceInput, workersUpdateInput } from "shared";

interface ModalStore {
  editingWorker: workersUpdateInput | null;
  isEditWorkerOpened: boolean;
  openEditWorkerModal: (worker: workersUpdateInput) => void;
  closeEditWorkerModal: () => void;

  isCreateWorkerOpened: boolean;
  openCreateWorkerModal: () => void;
  closeCreateWorkerModal: () => void;

  isCreateServiceOpened: boolean;
  openCreateServiceModal: () => void;
  closeCreateServiceModal: () => void;

  // Редактирование услуги
  editingService: UpdateServiceInput | null;
  isEditServiceOpened: boolean;
  openEditServiceModal: (service: UpdateServiceInput) => void;
  closeEditServiceModal: () => void;

  isCreateShiftOpened: boolean;
  openCreateShiftModal: () => void;
  closeCreateShiftModal: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  editingWorker: null,
  isEditWorkerOpened: false,
  openEditWorkerModal: (worker) =>
    set({ editingWorker: worker, isEditWorkerOpened: true }),
  closeEditWorkerModal: () =>
    set({ editingWorker: null, isEditWorkerOpened: false }),

  isCreateWorkerOpened: false,
  openCreateWorkerModal: () => set({ isCreateWorkerOpened: true }),
  closeCreateWorkerModal: () => set({ isCreateWorkerOpened: false }),

  isCreateServiceOpened: false,
  openCreateServiceModal: () => set({ isCreateServiceOpened: true }),
  closeCreateServiceModal: () => set({ isCreateServiceOpened: false }),

  editingService: null,
  isEditServiceOpened: false,
  openEditServiceModal: (service) =>
    set({ editingService: service, isEditServiceOpened: true }),
  closeEditServiceModal: () =>
    set({ editingService: null, isEditServiceOpened: false }),

  isCreateShiftOpened: false,
  openCreateShiftModal: () => set({ isCreateShiftOpened: true }),
  closeCreateShiftModal: () => set({ isCreateShiftOpened: false }),
}));
