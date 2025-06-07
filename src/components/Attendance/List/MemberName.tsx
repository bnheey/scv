import Badge from "@/components/common/Badge";
import Text from "@/components/common/Text";
import { DeveloperIds, LeaderIds } from "@/constants/Member";
import type { SimpleMember } from "@/types/Attendance";
import { isFreshMember } from "@/utils/shared";
import { Code, Crown } from "@phosphor-icons/react";
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
  const isLeader = LeaderIds.includes(member.memberId);

  return (
    <div className="flex items-center gap-1">
      <Text>{member.name}</Text>
      <TierImage tier={member.tier} />
      {isFresh && <Badge className="!bg-yellow-400">New</Badge>}
      {isDeveloper && (
        <Badge className="!px-1.5 bg-scv-light-blue">
          <Code size={11} color="white" weight="bold" />
        </Badge>
      )}
      {isLeader && (
        <Badge className="!px-1.5 !bg-scv-green">
          <Crown size={11} color="white" weight="fill" />
        </Badge>
      )}
      {maxAttendance > 0 && maxAttendance === member.totalAttendance && (
        <Badge className="!bg-orange-400">Best</Badge>
      )}
    </div>
  );
};

export default MemberName;
