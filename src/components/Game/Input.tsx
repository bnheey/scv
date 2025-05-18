import { TierOptions } from "@/constants/Member";
import { getMembers } from "@/middleware/endpoints/members";
import { useMembers } from "@/middleware/stores/members";
import { useModal } from "@/middleware/stores/modal";
import type { Member } from "@/types/Members";
import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import Button from "../common/Button";
import Select from "../common/Select";
import Text from "../common/Text";

const Input = ({
  setMembersInfo,
}: {
  setMembersInfo: Dispatch<SetStateAction<Member[]>>;
}) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { members, setMembers } = useMembers();
  const { openModal } = useModal();
  const navigate = useNavigate();

  useEffect(() => {
    if (members.length > 0) return;
    getMembers().then((members) => {
      setMembers(members);
    });
  }, []);

  const handleSortNames = (inputText: string) => {
    const namePattern = /\d+\.\s*([가-힣]+(?:\(게\))?.*?)(?=\n|$)/g;
    const names = [];
    let match;
    while ((match = namePattern.exec(inputText)) !== null) {
      const name = match[1].trim();
      names.push(name);
    }
    return names;
  };

  const handleOnClick = (inputText: string) => {
    const names = handleSortNames(inputText);
    const guests = [] as Member[];
    let count = 0;
    let isDuplicateName = "";

    const selectMembers = names.reduce((acc, name) => {
      const member = members.find(
        (member) => name.split("(")[0] === member.name
      );
      if (member && name.includes("게")) {
        isDuplicateName = name;
        return [];
      }

      if (member && member.tier) {
        acc.push(member);
        acc.push(member);
        if (names.length % 2 === 1 && count < 2) {
          acc.push(member);
          count++;
        }
      } else if (member && member.createdTimestamp) {
        guests.push({
          name,
          tier: 1,
          memberId: member.memberId,
          createdTimestamp: member.createdTimestamp,
        });
      } else {
        guests.push({
          name,
          tier: 1,
          memberId: Math.random(),
        });
      }
      return acc;
    }, [] as typeof members);

    if (isDuplicateName) {
      return openModal({
        title: "경고",
        message: `${isDuplicateName}은(는) 이미 회원 명단에 존재합니다.`,
      });
    }
    if (names.length < 4) {
      return openModal({
        title: "경고",
        message: "4명 이상의 참가자를 입력해주세요.",
      });
    } else if (guests.length > 0) {
      // 게스트 티어 선택
      openModal({
        title: "게스트 등록",
        message: "게스트의 티어를 선택해주세요.",
        confirmText: "저장",
        children: (
          <div className="flex flex-col gap-3 px-2 mt-4">
            {guests.map((guest, index) => {
              return (
                <div className="flex items-center gap-3" key={index}>
                  <Text type="normalMediumBlack" className="w-[80px] text-left">
                    {guest.name}:{" "}
                  </Text>
                  <Select
                    options={TierOptions}
                    defaultValue={guests?.[index]?.tier}
                    onChange={(e) => {
                      guests[index].tier = Number(e.target.value);
                      guests[index].name = guest.name;
                    }}
                  />
                </div>
              );
            })}
          </div>
        ),
        onConfirm: () => {
          const guestPlayers = [...guests, ...guests];
          const players = [...selectMembers, ...guestPlayers];
          setMembersInfo([...players]);
          navigate("/game/output");
        },
      });
    } else if (selectMembers.length < 1) {
      return openModal({
        title: "경고",
        message: "입력된 이름이 없거나 잘못된 이름입니다.",
      });
    } else {
      setMembersInfo(selectMembers);
      navigate("/game/output");
    }
  };

  // 테스트용 코드 (5번 클릭 시 테스트용 데이터 입력)
  const [clickCount, setClickCount] = useState(0);
  const [clickTimer, setClickTimer] = useState<NodeJS.Timeout | null>(null);
  const handleTestClick = () => {
    setClickCount((prevCount) => prevCount + 1);

    if (clickTimer) {
      clearTimeout(clickTimer);
    }
    const timer = setTimeout(() => {
      setClickCount(0);
    }, 2000);

    setClickTimer(timer);

    if (clickCount + 1 === 5) {
      if (inputRef.current) {
        inputRef.current.value =
          "1. 방희연\n2. 전성혁\n3. 이정석\n4. 문교원\n5. 함려나\n6. 신재성";
      }
      setClickCount(0);
      clearTimeout(timer);
    }
  };

  return (
    <>
      <Text type="subTitleBlack" className="pl-1 mr-auto">
        출석표(입력)
      </Text>
      <textarea
        ref={inputRef}
        className="px-3 py-2 h-[55%] text-sm bg-white border focus:outline-none focus:border-gray-500 rounded"
        placeholder={`(예시)\n1. 조석준\n2. 전성혁\n3. 방희연 \n4. 서현주(게스트)\n5. 이현석\n6. 이현재\n7. 허찬웅\n8. 김진호`}
        onPaste={() => {
          setTimeout(() => {
            inputRef.current?.blur();
          }, 0);
        }}
      />
      <Button
        className="ml-auto"
        onClick={() => {
          handleOnClick(inputRef.current?.value || "");
        }}
        onMouseDown={handleTestClick}
        onTouchStart={handleTestClick}
        size="lg"
      >
        경기 배치
      </Button>
    </>
  );
};

export default Input;
