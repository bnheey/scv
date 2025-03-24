import type { GameMember } from "@/types/Games";
import { getMemberName } from "@/utils/games";
import { Draggable } from "@hello-pangea/dnd";
import { BookOpen } from "@phosphor-icons/react";
import clsx from "clsx";

interface MemberLabelProps {
  gameIndex: number;
  member: GameMember;
  memberIndex: number;
}

const MemberLabel = ({ gameIndex, member, memberIndex }: MemberLabelProps) => (
  <Draggable
    key={`member-${member.member_id}-${gameIndex}-${memberIndex}`}
    draggableId={`member-${member.member_id}-${gameIndex}-${memberIndex}`}
    index={memberIndex}
  >
    {(provided) => (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        className={clsx(
          "relative text-nowrap py-1.5 px-1 rounded bg-transparent z-20",
          !member.createdTimestamp ? "!text-gray-400" : ""
        )}
      >
        <div className="absolute opacity-80 -z-10 -left-[5px] -top-[16px]">
          <BookOpen
            size={60}
            weight={member.tierGap >= 1 && !member.duplicate ? "thin" : "fill"}
            className={clsx(
              "text-gray-200",
              member.tierGap === 1 ? "!text-orange-300" : "",
              member.duplicate || member.tierGap >= 2 ? "!text-red-600" : ""
            )}
          />
        </div>
        <p className="z-20 text-[14px]">
          {getMemberName(member.name, member.createdTimestamp, -2)}
        </p>
      </div>
    )}
  </Draggable>
);

export default MemberLabel;
