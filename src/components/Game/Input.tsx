import { TierOptions } from "@/constants/Member";
import { getMembers } from "@/middleware/endpoints/members";
import { useMembers } from "@/middleware/stores/members";
import { useModal } from "@/middleware/stores/modal";
import type { Game } from "@/types/Games";
import type { Member } from "@/types/Members";
import { getInputType, parseGameText, parseMemberText } from "@/utils/games";
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
import { CheckCircle } from "@phosphor-icons/react";
import clsx from "clsx";

const Input = ({
  setParseInput,
}: {
  setParseInput: Dispatch<SetStateAction<Member[] | Game[]>>;
}) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { members, setMembers } = useMembers();
  const { openModal } = useModal();
  const navigate = useNavigate();

  const [mode, setMode] = useState<"unknown" | "create" | "edit">("unknown");
  const buttonStyles = {
    unknown: "!bg-gray-300 !text-gray-600 cursor-not-allowed",
    create: "!bg-scv-pink !text-white",
    edit: "!bg-scv-ash-purple !text-white",
  };

  useEffect(() => {
    if (members.length > 0) return;
    getMembers()
      .then((members) => {
        setMembers(members);
      })
      .catch(() => {
        navigate("/500");
      });
  }, []);

  const handleOnMember = (inputText: string) => {
    const names = parseMemberText(inputText);
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
          setParseInput([...players]);
          navigate("/game/output");
        },
      });
    } else if (selectMembers.length < 1) {
      return openModal({
        title: "경고",
        message: "입력된 이름이 없거나 잘못된 이름입니다.",
      });
    } else {
      setParseInput(selectMembers);
      navigate("/game/output");
    }
  };

  const handleOnGame = (inputText: string) => {
    setParseInput(parseGameText(inputText));
    navigate("/game/output?type=game");
  };

  const handleOnClick = (inputText: string) => {
    const type = getInputType(inputText);
    if (type === "member") return handleOnMember(inputText);
    else if (type === "game") return handleOnGame(inputText);
    else {
      return openModal({
        title: "경고",
        message: "입력 형식이 잘못되었습니다. 올바른 형식으로 입력해주세요.",
      });
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
        onChange={(e) => {
          const type = getInputType(e.target.value);
          if (type === "member") return setMode("create");
          else if (type === "game") return setMode("edit");
        }}
      />
      <div className="flex items-end justify-end gap-2 mt-1">
        <div
          className={clsx(
            "flex items-center gap-1 text-sm transition-all duration-300 ease-out",
            mode === "unknown"
              ? "opacity-0 -translate-y-2 pointer-events-none"
              : "opacity-100 translate-y-0"
          )}
        >
          <CheckCircle className="text-[#04906F]" size={16} />
          <Text type="normalGray" className="!py-2.5">
            {mode === "create"
              ? "출석표가 입력되었습니다."
              : "경기표가 입력되었습니다."}
          </Text>
        </div>
        <Button
          onClick={() => {
            handleOnClick(inputRef.current?.value || "");
          }}
          className={`${buttonStyles[mode]} mt-[10px] transition-all duration-300`}
          size="lg"
          disabled={mode === "unknown"}
        >
          {mode === "edit" ? "경기 수정" : "경기 생성"}
        </Button>
      </div>
    </>
  );
};

export default Input;
