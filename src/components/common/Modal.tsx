import { X } from "@phosphor-icons/react";
import Text from "./Text";
import { useModal } from "@/middleware/stores/modal";

const Modal = () => {
  const {
    closeModal,
    onConfirm,
    title,
    message,
    width,
    height,
    children,
    confirmText,
  } = useModal();
  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center`}>
      {/* 딤드 */}
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={closeModal}
      />
      {/* 모달 */}
      <div
        className="relative px-4 py-5 bg-white rounded-lg shadow-lg max-w-[400px] w-[80%] min-w-[70%]"
        style={{ width, height }}
      >
        <div className="flex items-center justify-center">
          <Text type="subTitleBlack">{title}</Text>
          <X className="ml-auto" size={20} onClick={closeModal} />
        </div>
        <div className="mt-4">
          <Text type="normalBlack" className="px-1 text-left">
            {message}
          </Text>
          {children}
        </div>
        <div className="flex justify-end mt-4">
          <button
            className="py-2 rounded-md w-fit bg-scv-pink"
            onClick={() => {
              if (onConfirm) onConfirm();
              closeModal();
            }}
          >
            <Text type="normalMediumWhite">{confirmText || "닫기"}</Text>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
