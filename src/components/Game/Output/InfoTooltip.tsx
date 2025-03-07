import { Info, X } from "@phosphor-icons/react";
import Cookies from "js-cookie";
import { useEffect, useRef, useState } from "react";
import Text from "../../common/Text";

const InfoTooltip = () => {
  const SHOW_TUTORIAL = JSON.parse(Cookies.get("SHOW_TUTORIAL") || "[]");
  const [isOpen, setIsOpen] = useState<boolean>(Boolean(SHOW_TUTORIAL) || true);

  const tooltipRef = useRef<HTMLDivElement>(null);

  const handleOnClose = () => {
    setIsOpen(false);
    if (!SHOW_TUTORIAL) {
      Cookies.set("SHOW_TUTORIAL", "false", {
        expires: 365,
      });
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(e.target as Node)
      ) {
        handleOnClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <button
        className="p-0"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        <Info />
      </button>
      {isOpen && (
        <div
          ref={tooltipRef}
          className="py-3 px-4 absolute right-0 w-[300px] bg-white border-[2px] rounded-md border-scv-pink"
        >
          <div className="flex items-center justify-between mb-3">
            <Text type="subTitleBlack">부가 설명</Text>
            <button className="p-0" onClick={handleOnClose}>
              <X />
            </button>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1">
              <div className="w-[60px] h-[30px] border border-red-600 rounded-md leading-[30px]">
                방희연
              </div>
              <Text>: 밸런스 붕괴 ⛔️</Text>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-[60px] h-[30px] border border-orange-300 rounded-md leading-[30px]">
                방희연
              </div>
              <Text>: 양 팀 티어가 약간 차이나요 ⚠️</Text>
            </div>
            <div className="flex items-center gap-1">
              <div className="text-white w-[60px] h-[30px] bg-red-600 rounded-md leading-[30px]">
                방희연
              </div>
              <Text>: 게임 내 중복 멤버가 있어요 ❌</Text>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InfoTooltip;
