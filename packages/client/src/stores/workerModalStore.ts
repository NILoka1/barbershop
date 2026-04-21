// src/stores/modalStore.ts
import { create } from "zustand";
import type { workersUpdateInput } from "shared";

interface ModalStore {
  editingWorker: workersUpdateInput | null;
  isEditWorkerOpened: boolean;
  openEditWorkerModal: (worker: workersUpdateInput) => void;
  closeEditWorkerModal: () => void;

  isCreateWorkerOpened: boolean;
  openCreateWorkerModal: () => void;
  closeCreateWorkerModal: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  editingWorker: null,
  isEditWorkerOpened: false,
  openEditWorkerModal: (worker) => set({ editingWorker: worker, isEditWorkerOpened: true }),
  closeEditWorkerModal: () => set({ editingWorker: null, isEditWorkerOpened: false }),

  isCreateWorkerOpened: false,
  openCreateWorkerModal: () => set({isCreateWorkerOpened: true}),
  closeCreateWorkerModal: () => set({isCreateWorkerOpened: false})
}));
