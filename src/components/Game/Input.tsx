import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { TierOptions } from "../../constants/Member";
import { getMembers } from "../../middleware/endpoints/members";
import { useMembers } from "../../middleware/stores/members";
import { useModal } from "../../middleware/stores/modal";
import Select from "../common/Select";
import Text from "../common/Text";

const Input = ({
  setMembersInfo,
}: {
  setMembersInfo: Dispatch<
    SetStateAction<
      {
        name: string;
        tier: number;
      }[]
    >
  >;
}) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { members, setMembers } = useMembers();
  const { openModal } = useModal();
  const location = useLocation();

  useEffect(() => {
    if (members.length > 0) return;
    getMembers().then((members) => {
      setMembers(members);
    });
  }, []);

  const handleSortNames = (inputText: string) => {
    const namePattern = /\d+\.\s([가-힣]+(?:\(게\))?|게스트\d{0,2})/g;
    const names = [];
    let match;
    while ((match = namePattern.exec(inputText)) !== null) {
      names.push(match[1]);
    }
    if (names.length % 2 !== 0) {
      for (let i = 0; i < names.length; i++) {
        if (!names[i].includes("게스트") && !names[i].includes("(게)")) {
          names.push(names[i]);
          break;
        }
      }
    }
    return names;
  };

  const handleOnClick = (inputText: string) => {
    const names = handleSortNames(inputText);
    const selectMembers = names.reduce((acc, name) => {
      const member = members.find((member) => member.name === name);
      if (member) {
        acc.push(member);
      }
      return acc;
    }, [] as typeof members);

    const guestNames = names.filter(
      (name) => !selectMembers.map((member) => member.name).includes(name)
    );
    if (guestNames.length > 0) {
      let guests = [] as { name: string; tier: number }[];
      openModal({
        title: "게스트 등록",
        message: "게스트의 티어를 선택해주세요.",
        confirmText: "저장",
        children: (
          <div className="flex flex-col gap-3 px-2 mt-4">
            {guestNames.map((guest, index) => {
              const newGuests = [...guests];
              newGuests[index] = newGuests[index]
                ? newGuests[index]
                : { name: guest, tier: 1 };
              guests = newGuests;
              return (
                <div className="flex items-center gap-3" key={index}>
                  <Text type="normalMediumBlack" className="w-[80px] text-left">
                    {guest}:{" "}
                  </Text>
                  <Select
                    options={TierOptions}
                    defaultValue={guests?.[index]?.tier}
                    onChange={(e) => {
                      const newGuests = [...guests];
                      if (!newGuests[index]) {
                        newGuests[index] = {
                          name: guest,
                          tier: Number(e.target.value),
                        };
                      } else {
                        newGuests[index].tier = Number(e.target.value);
                        newGuests[index].name = guest;
                      }
                      guests = newGuests;
                    }}
                  />
                </div>
              );
            })}
          </div>
        ),
        onConfirm: () => {
          setMembersInfo([...selectMembers, ...guests]);
          location.search = "?type=output";
        },
      });
    } else if (selectMembers.length < 1) {
      openModal({
        title: "경고",
        message: "입력된 이름이 없거나 잘못된 이름입니다.",
      });
    } else {
      setMembersInfo([...selectMembers]);
      location.search = "?type=output";
    }
  };

  return (
    <>
      <Text type="subTitleBlack" className="pl-1 mr-auto">
        출석표(입력)
      </Text>
      <textarea
        ref={inputRef}
        className="px-3 py-2 h-[55%] text-sm bg-white border"
      />
      <button
        className="px-6 ml-auto bg-scv-pink w-fit"
        onClick={() => {
          handleOnClick(inputRef.current?.value || "");
        }}
      >
        <Text type="normalMediumWhite">경기 배치</Text>
      </button>
    </>
  );
};

export default Input;
