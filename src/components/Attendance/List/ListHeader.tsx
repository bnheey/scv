import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import moment from "moment";
import { AttendanceList } from "../../../types/Attendance";
import { formatDate } from "../../../utils/date";
import Text from "../../common/Text";

interface ListHeaderProps {
  attendanceList: AttendanceList;
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
}

const ListHeader = ({
  attendanceList,
  currentDate,
  setCurrentDate,
}: ListHeaderProps) => {
  // TODO: 면제권 복사 기능 이동 필요, attendanceList 제거 가능
  const handleOnPaste = (attendanceList?: AttendanceList) => {
    if (!attendanceList) return null;
    // 그룹화
    const groupedByCounts: Record<number, string[]> = {};

    attendanceList.forEach((member) => {
      const countGroup = Math.floor((member.totalAttendance ?? 0) / 7);
      if (!groupedByCounts[countGroup]) {
        groupedByCounts[countGroup] = [];
      }
      groupedByCounts[countGroup].push(member.name);
    });

    // 내림차순 정렬
    const sortedKeys = Object.keys(groupedByCounts)
      .map(Number)
      .sort((a, b) => b - a);

    const pasteText = `🌟${formatDate(
      currentDate,
      "yyyy년 MM월"
    )} 우수참석회원 면제권 지급🌟\n\n${sortedKeys
      .map((count) => {
        if (count <= 0) return;
        const names = groupedByCounts[count].sort().map((name) => name);
        return `${count}장(${count * 7}회 이상)\n${names.join(" ")}`;
      })
      .filter(Boolean)
      .join("\n\n")}`;

    navigator.clipboard.writeText(pasteText);
  };

  return (
    <div className="flex items-center justify-center pt-2">
      <button
        onClick={() => {
          setCurrentDate(moment(currentDate).add(-1, "month").toDate());
        }}
        className="py-0"
      >
        <CaretLeft />
      </button>
      <Text
        type="subTitleBlack"
        className="font-pretendard"
        onClick={() => handleOnPaste(attendanceList)}
      >
        {formatDate(currentDate, "yyyy년 MM월")}
      </Text>
      <button
        onClick={() => {
          const nextDate = moment(currentDate).add(1, "month").toDate();
          if (moment(nextDate).isAfter(new Date())) return;
          setCurrentDate(nextDate);
        }}
        className="py-0"
      >
        <CaretRight />
      </button>
    </div>
  );
};

export default ListHeader;
