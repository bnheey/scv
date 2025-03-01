import { useState } from "react";
import { TierOptions } from "../../../constants/Member";
import Button from "../../common/Button";
import Text from "../../common/Text";
import DragAndDropGrid from "./DragAndDropGrid";
import { createGames } from "../../../utils/games";
import { formatDate } from "../../../utils/date";

const Output = ({
  membersInfo,
}: {
  membersInfo: { name: string; tier: number; member_id: number }[];
}) => {
  const [games, setGames] = useState(createGames(membersInfo));

  const groupedByTier = membersInfo.reduce((acc, member) => {
    if (!acc[member.tier]) {
      acc[member.tier] = [];
    }
    acc[member.tier].push(member.name);
    return acc;
  }, {} as { [key: number]: string[] });

  const sortedTiersDesc = Object.keys(groupedByTier)
    .map(Number)
    .sort((a, b) => b - a);

  const getTierText = (tier: number) =>
    `${TierOptions[tier - 1]?.label[0]}: ${[
      ...new Set(groupedByTier[tier]),
    ].join(", ")}`;

  const handleOnPaste = () => {
    const gamesText = games
      .map(
        (game, gameIdx) =>
          `${gameIdx + 1}경기: ${game.members
            .map(
              (member, memberIdx) =>
                member.name + (memberIdx === 1 ? " vs" : "")
            )
            .join(" ")}`
      )
      .join("\n");

    const uniqueMembersInfo = membersInfo.filter(
      (member, index, self) =>
        index === self.findIndex((m) => m.member_id === member.member_id)
    );

    const pasteText = `SCV경기표🏸\n(${formatDate(new Date(), "M월 D일")} ${
      formatDate(new Date(), "a") == "오전" ? "오전 9시" : "오후 7시 30분"
    })\n${sortedTiersDesc
      .map((tier) => getTierText(tier))
      .join("\n")}\n\n총원 : ${uniqueMembersInfo.length}명\n\n${gamesText}`;

    navigator.clipboard.writeText(pasteText);
  };

  return (
    <div className="h-full">
      {sortedTiersDesc.map((tier) => (
        <div key={tier}>
          <Text
            type="smallMediumWhite"
            className="px-2 !text-black !leading-[17px] text-left "
          >
            {getTierText(tier)}
          </Text>
        </div>
      ))}
      <div className="w-full h-[75%] overflow-y-scroll rounded-md mt-4">
        <DragAndDropGrid games={games} setGames={setGames} />
      </div>
      <div className="flex items-center justify-end gap-1 mt-3">
        {/* <Button color="text">랜덤 재배치</Button> */}
        <Button
          onClick={() => {
            handleOnPaste();
          }}
        >
          경기표 생성
        </Button>
      </div>
    </div>
  );
};

export default Output;
