import { create } from "zustand";

interface ModalState {
  isOpen?: boolean;
  title?: string;
  message: string;
  width?: string;
  height?: string;
  children?: React.ReactNode;
  confirmText?: string;
  onConfirm?: () => void;
}

interface ModalActions {
  openModal: (params: ModalState) => void;
  closeModal: () => void;
}

const initialState: ModalState = {
  isOpen: false,
  title: "",
  message: "",
  width: "",
  height: "",
  children: null,
  confirmText: "",
  onConfirm: () => {},
};
export const useModal = create<ModalState & ModalActions>((set) => ({
  ...initialState,
  openModal: (params) => set(() => ({ ...params, isOpen: true })),
  closeModal: () =>
    set(() => ({
      ...initialState,
      isOpen: false,
    })),
}));
