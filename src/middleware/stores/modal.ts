import { create } from "zustand";

interface ModalState {
  isOpen: boolean;
  title?: string;
  message: string;
  width?: string;
  height?: string;
  children?: React.ReactNode;
  onClick?: () => void;
}

interface ModalActions {
  openModal: ({
    title,
    message,
    width,
    height,
    children,
    onClick,
  }: {
    title?: string;
    message?: string;
    width?: string;
    height?: string;
    children?: React.ReactNode;
    onClick?: () => void;
  }) => void;
  closeModal: () => void;
}

export const useModal = create<ModalState & ModalActions>((set) => ({
  isOpen: false,
  title: "",
  message: "",
  width: "",
  height: "",
  children: null,
  onClick: () => {},
  openModal: ({ title, message, children, width, height, onClick }) =>
    set(() => ({
      isOpen: true,
      title,
      message,
      width,
      height,
      children,
      onClick,
    })),
  closeModal: () =>
    set(() => ({
      isOpen: false,
      title: "",
      message: "",
      width: "",
      height: "",
      children: null,
      onClick: () => {},
    })),
}));
