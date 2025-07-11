import Badge from "@/components/common/Badge";
import Text from "@/components/common/Text";
import { AdminIds, DeveloperIds } from "@/constants/Member";
import type { SimpleMember } from "@/types/Attendance";
import { isFreshMember } from "@/utils/shared";
import { Code, Crown, ThumbsUp } from "@phosphor-icons/react";
import TierImage from "./TierImage";

const MemberName = ({
  member,
  currentDate,
  maxAttendance,
}: {
  member: SimpleMember;
  currentDate: Date;
  maxAttendance: number;
}) => {
  const isFresh =
    member.createdTimestamp &&
    isFreshMember(member.createdTimestamp, 1, currentDate.toISOString());
  const isDeveloper = DeveloperIds.includes(member.memberId);
  const isAdmin = AdminIds.includes(member.memberId);
  const isBest = maxAttendance > 0 && maxAttendance === member.totalAttendance;

  return (
    <div className="flex items-center gap-1">
      <Text className={isBest ? "shine-text animate-shine" : ""}>
        {member.name}
      </Text>
      <TierImage tier={member.tier} />
      {isFresh && <Badge className="!bg-yellow-400">New</Badge>}
      {isDeveloper && (
        <Badge className="!px-1.5 bg-scv-light-blue">
          <Code size={11} color="white" weight="bold" />
        </Badge>
      )}
      {isAdmin && (
        <Badge className="!px-1.5 !bg-scv-green">
          <Crown size={11} color="white" weight="fill" />
        </Badge>
      )}
      {isBest && (
        <Badge className="!bg-red-400">
          <ThumbsUp size={11} color="white" weight="fill" />
        </Badge>
      )}
    </div>
  );
};

export default MemberName;
