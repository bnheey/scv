import { Info, X } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import Text from "../../common/Text";

const InfoTooltip = () => {
  const [isOpen, setIsOpen] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
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
          <div className="flex items-center justify-between mb-4">
            <Text type="subTitleBlack">부가 설명</Text>
            <button className="p-0" onClick={() => setIsOpen(false)}>
              <X />
            </button>
          </div>
          <div className="flex flex-col gap-2">
            <Text className="text-left mb-2" type="normalMediumBlack">
              Player 정보
            </Text>
            <div className="flex flex-col gap-1 ml-1">
              <div className="flex items-center gap-1">
                <div className="px-1 py-1 border border-gray-200 rounded-md">
                  희연🐣
                </div>
                <Text>: 신입</Text>
              </div>
              <div className="flex items-center gap-1">
                <div className="px-1 py-1 border border-gray-200 text-gray-400 rounded-md">
                  방희연
                </div>
                <Text>: 게스트</Text>
              </div>
            </div>
            {/* ---------------------------------------------------- */}
            <hr className=" text-gray-200 my-2 border-[-1px]" />
            <Text className="text-left mb-2" type="normalMediumBlack">
              Game 정보
            </Text>
            <div className="flex flex-col gap-1 ml-1">
              <div className="flex items-center gap-1">
                <div className="px-1 py-1 border border-red-600 rounded-md">
                  방희연
                </div>
                <Text>: 밸런스 붕괴 ⛔️</Text>
              </div>
              <div className="flex items-center gap-1">
                <div className="px-1 py-1 border border-orange-300 rounded-md">
                  방희연
                </div>
                <Text>: 양 팀 티어가 약간 차이나요 ⚠️</Text>
              </div>
              <div className="flex items-center gap-1">
                <div className="px-1 py-1 text-white bg-red-600 border border-red-600 rounded-md">
                  방희연
                </div>
                <Text>: 게임 내 중복 멤버가 있어요 ❌</Text>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InfoTooltip;
