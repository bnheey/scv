import Text from "@/components/common/Text";
import { Info, X } from "@phosphor-icons/react";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";

const InfoTooltip = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const handleOnClose = () => {
    setIsOpen(false);
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

  const infoList = {
    playerInfo: [
      {
        label: "희연🐣",
        discription: "신입",
        labelStyle: "px-1 py-1 border border-gray-200 rounded-md",
      },
      {
        label: "방희연",
        discription: "게스트",
        labelStyle: "px-1 py-1 border border-gray-200 text-gray-400 rounded-md",
      },
    ],
    gameInfo: [
      {
        label: "방희연",
        discription: "밸런스 붕괴 ⛔️",
        labelStyle: "px-1 py-1 border border-red-600 rounded-md",
      },
      {
        label: "방희연",
        discription: "양 팀 티어가 약간 차이나요 ⚠️",
        labelStyle: "px-1 py-1 border border-orange-300 rounded-md",
      },
      {
        label: "방희연",
        discription: "게임 내 중복 멤버가 있어요 ❌",
        labelStyle:
          "px-1 py-1 text-white bg-red-600 border border-red-600 rounded-md",
      },
    ],
  };

  const getLabelInfoComponent = (
    title: string,
    infoList: {
      label: string;
      discription: string;
      labelStyle: string;
    }[]
  ) => (
    <>
      <Text className="mb-2 text-left" type="normalMediumBlack">
        {title}
      </Text>
      <div className="flex flex-col gap-1 ml-1">
        {infoList.map((info) => (
          <div className="flex items-center gap-1">
            <div className={info.labelStyle}>{info.label}</div>
            <Text>{`: ${info.discription}`}</Text>
          </div>
        ))}
      </div>
    </>
  );

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
          className="animate-fadeIn py-3 px-4 absolute right-0 w-[300px] bg-white border-[2px] rounded-md border-scv-pink"
        >
          <div className="flex items-center justify-between mb-4">
            <Text type="subTitleBlack">부가 설명</Text>
            <button className="p-0" onClick={handleOnClose}>
              <X />
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {getLabelInfoComponent("Player 정보", infoList.playerInfo)}
            <hr className=" text-gray-200 my-2 border-[-1px]" />
            {getLabelInfoComponent("Game 정보", infoList.gameInfo)}
          </div>
          <div
            className={clsx(
              "absolute w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[8px] border-scv-pink",
              "bottom-full right-0.5"
            )}
          ></div>
        </div>
      )}
    </>
  );
};

export default InfoTooltip;
