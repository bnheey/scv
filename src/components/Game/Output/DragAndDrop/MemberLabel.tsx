import type { GameMember } from "@/types/Games";
import { getMemberName } from "@/utils/games";
import { Draggable } from "@hello-pangea/dnd";
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
          "text-nowrap py-1.5 px-1 border border-gray-200 rounded bg-white",
          member.duplicate ? "!bg-red-600 border-none text-white" : "",
          member.tierGap === 1 ? "!border !border-orange-300" : "",
          member.tierGap >= 2 ? "!border !border-red-600" : "",
          !member.createdTimestamp ? "!text-gray-400" : ""
        )}
      >
        {getMemberName(member.name, member.createdTimestamp, -2)}
      </div>
    )}
  </Draggable>
);

export default MemberLabel;
