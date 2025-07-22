import TierImage from "@/components/Attendance/List/TierImage";
import Button from "@/components/common/Button";
import Text from "@/components/common/Text";
import type { Game } from "@/types/Games";
import type { Member } from "@/types/Members";
import { formatDate, getGameTime } from "@/utils/date";
import {
  createGames,
  getTierText,
  sortedTiersDesc,
  uniqueMembers,
} from "@/utils/games";
import { closeKakaoBrowser, getToast } from "@/utils/shared";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DragAndDropWrapper from "./DragAndDrop/DragAndDropWrapper";
import InfoTooltip from "./InfoTooltip";

const Output = ({
  parseInput,
  type,
}: {
  parseInput: Member[] | Game[];
  type: string;
}) => {
  const [games, setGames] = useState(
    type === "game" ? (parseInput as Game[]) : createGames(parseInput)
  );
  const [pinnedGames, setPinnedGames] = useState<boolean[]>(
    Array(games.length).fill(false)
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (parseInput.length === 0) {
      navigate("/game");
    }
  }, [parseInput, navigate]);

  // TODO: getGamesToMember 함수와 비교해서 추후 제거
  const getAllMembersFromGames = () => {
    const allMembers: Member[] = [];
    games.forEach((game) => {
      game.members.forEach((member) => {
        // 중복 제거를 위해 memberId로 확인
        const existingMember = allMembers.find(
          (m) => m.memberId === member.memberId
        );
        if (!existingMember) {
          allMembers.push({
            memberId: member.memberId,
            name: member.name,
            tier: member.tier,
            createdTimestamp: member.createdTimestamp,
          });
        }
      });
    });
    return allMembers.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
  };

  const handleOnPaste = () => {
    const gamesText = games
      .map(
        (game, gameIdx) =>
          `${gameIdx + 1}경기 ${game.members
            .map(
              (member, memberIdx) =>
                member.name.replace(/\s+/g, "").replace(/\(.*?\)/g, "") +
                (memberIdx === 1 ? " vs" : "")
            )
            .join(" ")}`
      )
      .join("\n");

    const pasteText = `SCV경기표🏸\n(${formatDate(
      new Date(),
      "M월 D일"
    )} ${getGameTime()})\n${sortedTiersDesc(getAllMembersFromGames())
      .map((tier) => getTierText(getAllMembersFromGames(), tier))
      .join("\n")}\n\n총원 (${
      uniqueMembers(getAllMembersFromGames()).length
    })\n\n${gamesText}`;

    navigator.clipboard.writeText(pasteText);
  };

  const getGameText = () => {
    handleOnPaste();
    getToast("경기표가 복사되었습니다.");
  };

  return (
    <div className="h-full">
      <div className="relative">
        {sortedTiersDesc(getAllMembersFromGames()).map((tier) => (
          <div key={tier} className="flex items-start">
            <TierImage tier={tier} />
            <Text
              type="smallMediumWhite"
              className="px-2 !text-black text-left my-auto"
            >
              {getTierText(getAllMembersFromGames(), tier)}
            </Text>
          </div>
        ))}
        <div className="absolute top-0 right-0 z-30">
          <InfoTooltip />
        </div>
      </div>
      <div className="w-full max-h-[70%] py-2 border-y border-y-gray-300 overflow-y-scroll mt-4">
        <DragAndDropWrapper
          games={games}
          setGames={setGames}
          pinnedGames={pinnedGames}
          setPinnedGames={setPinnedGames}
        />
      </div>
      <div className="flex items-center justify-end gap-1 mt-3">
        <Button
          color="text"
          onClick={() =>
            setGames([
              ...createGames(
                games,
                "game",
                pinnedGames
                  .map((pinned, idx) => (pinned ? idx : -1))
                  .filter((idx) => idx !== -1)
              ),
            ])
          }
        >
          랜덤 재배치
        </Button>
        <Button
          onClick={() => {
            getGameText();
            setTimeout(() => {
              closeKakaoBrowser();
            }, 400);
          }}
        >
          경기표 생성
        </Button>
      </div>
    </div>
  );
};

export default Output;
