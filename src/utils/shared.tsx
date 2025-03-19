import { Info } from "@phosphor-icons/react";
import { toast } from "react-toastify";

/**
 * toast 메시지를 띄워주는 함수
 * @param message
 * @returns
 */
export const getToast = (message: string) =>
  toast(message, {
    type: "info",
    className: "w-2/3 top-[65px] font-gaegu text-[14px] text-black rounded-md",
    icon: (
      <Info size={14} color="#3b82f6" weight="fill" className="opacity-50" />
    ),
    theme: "light",
    draggable: true,
    autoClose: 2000,
  });
