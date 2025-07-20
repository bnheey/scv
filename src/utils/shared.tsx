import { Info } from "@phosphor-icons/react";
import moment from "moment";
import { toast } from "react-toastify";

/**
 * toast 메시지를 띄워주는 함수
 * @param message
 * @returns
 */
export const getToast = (message: string) =>
  toast(message, {
    type: "info",
    className:
      "w-2/3 top-[65px] font-pretendard text-[14px] text-black rounded-md",
    icon: (
      <Info size={14} color="#3b82f6" weight="fill" className="opacity-50" />
    ),
    theme: "light",
    draggable: true,
    autoClose: 2000,
  });

/**
 * @param createdTimestamp: 가입일
 * @param option: 0: 가입일이 기준일 30일 이내, 1: 가입일이 기준일과 동일한 달
 * @param referenceDate: 기준일
 * @returns
 **/
export const isFreshMember = (
  createdTimestamp: string,
  option: number = 0,
  referenceDate?: string
) => {
  if (option === 0) {
    return moment().diff(moment(createdTimestamp), "days") < 30;
  }
  if (option === 1) {
    return (
      moment(referenceDate).isSame(moment(createdTimestamp), "year") &&
      moment(referenceDate).isSame(moment(createdTimestamp), "month")
    );
  }
  return false;
};

export const closeKakaoBrowser = () => {
  const ua = navigator.userAgent.toLowerCase();
  if (ua.indexOf("kakaotalk") > -1) {
    if (/iphone|ipad|ipod/.test(ua)) {
      window.location.href = "kakaoweb://closeBrowser";
    } else {
      window.location.href = "kakaotalk://inappbrowser/close";
    }
  } else {
    window.close();
  }
};
