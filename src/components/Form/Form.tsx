import { formPasteText } from "@/constants/Form";
import { formatDate, getDayName, getGameTime } from "@/utils/date";
import { closeKakaoBrowser, getToast } from "@/utils/shared";
import { useState } from "react";
import Button from "../common/Button";
import { SubTabs } from "../common/SubTabs";

const Form = () => {
  const [currentTab, setCurrentTab] = useState("출석");
  const [isShaking, setIsShaking] = useState(false);

  const playAnimation = () => {
    setIsShaking(false);
    setTimeout(() => {
      setIsShaking(true);
    }, 10);
  };

  return (
    <>
      <SubTabs
        tabs={["출석", "마감 대기", "셔틀콕 구매"]}
        selected={currentTab}
        onChange={(tab) => {
          setCurrentTab(tab);
          playAnimation();
        }}
      />
      <div className="relative p-4 text-sm text-left whitespace-pre-wrap bg-white border rounded-lg shadow-inner min-h-[55%] max-h-[55%] overflow-auto">
        {currentTab === "출석" && (
          <>
            <p>
              SCV🏸 ☆ ({getDayName(new Date())}) {getGameTime()}
            </p>
            <p>코트번호 : 1번</p>
            <p className="mt-2">콕 남 3개, 여 2개</p>
            <p className="mt-2">&lt;참석명단&gt;</p>
            {[...Array(16)].map((_, i) => (
              <p key={i}>{i + 1}. </p>
            ))}
          </>
        )}
        {currentTab === "마감 대기" && (
          <>
            <p>
              🏃‍♂참석 대기‼({formatDate(new Date(), "D일")}{" "}
              {getDayName(new Date(), "long")})
            </p>
            <p>모임시간 한시간 전 취소자 미발생시</p>
            <p>1. 면제권 사용</p>
            <p>2. 마감참석 벌금</p>
            <p>3. 불참</p>
            <p className="mb-4">(괄호안에 번호 기입)</p>
            {[...Array(3)].map((_, i) => (
              <p key={i}>{i + 1}. </p>
            ))}
          </>
        )}
        {currentTab === "셔틀콕 구매" && (
          <>
            <p>🏸셔틀콕</p>
            <p className="text-gray-400">
              ⓘ 회원분들의 편의를 위해 미리 구매 후 실비로 판매합니다.
            </p>
            <p>닉텐블랙(2.5) - 현장 구매(이현석)</p>
            <p className="mb-2">▶[3333-33-8272371 카카오뱅크]</p>
            <p className="mt-4">🏸거트</p>
            <p>미소스포츠(1.5) - 성영돈</p>
            <p>▶[sc제일 408-20-291454]</p>
          </>
        )}
      </div>
      <Button
        color="pink"
        size="lg"
        onClick={() => {
          const pasteKey =
            currentTab === "출석"
              ? "attendance"
              : currentTab === "마감 대기"
              ? "wait"
              : "purchase";

          navigator.clipboard.writeText(formPasteText[pasteKey]);
          getToast("양식이 복사되었습니다.");
          setTimeout(() => {
            closeKakaoBrowser();
          }, 400);
        }}
        className={isShaking ? "animate-shake" : ""}
      >
        복사하기
      </Button>
    </>
  );
};

export default Form;
