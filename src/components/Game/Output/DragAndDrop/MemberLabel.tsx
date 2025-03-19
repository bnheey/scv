import type { GameMember } from "@/types/Games";
import { getMemberName } from "@/utils/games";
import { Draggable } from "@hello-pangea/dnd";
import { Spinner } from "@phosphor-icons/react";
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
          "relative text-nowrap py-1.5 px-1 rounded bg-transparent",
          member.duplicate ? "!bg-red-600 border-none text-white" : "",
          !member.createdTimestamp ? "!text-gray-400" : ""
        )}
      >
        <div className="absolute -left-4 -top-6 opacity-90">
          <Spinner
            size={80}
            weight="thin"
            className={clsx(
              "text-gray-200",
              member.tierGap === 1 ? "!text-orange-300" : "",
              member.tierGap >= 2 ? "!text-red-600" : ""
            )}
          />
        </div>
        {getMemberName(member.name, member.createdTimestamp, -2)}
      </div>
    )}
  </Draggable>
);

export default MemberLabel;
