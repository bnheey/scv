import { AttendanceList } from "../../../types/Attendance";
import { ClipboardText } from "@phosphor-icons/react";
import Text from "../../common/Text";
import { formatDate } from "../../../utils/date";

type CopyButtonProps = {
  currentDate: Date;
  attendanceList: AttendanceList;
};

const CopyButton = ({ currentDate, attendanceList }: CopyButtonProps) => {
  const handleOnPaste = (totalAttendance?: AttendanceList) => {
    if (!totalAttendance) return null;

    const groupedAttendance: { [key: number]: string[] } = {};

    totalAttendance.forEach((item) => {
      const total = item.totalAttendance || 0;
      if (!groupedAttendance[total]) {
        groupedAttendance[total] = [];
      }
      groupedAttendance[total].push(item.name);
    });

    const sortedAttendance = Object.keys(groupedAttendance).sort((a, b) =>
      Number(a) < Number(b) ? 1 : -1
    );

    const pasteText = `[📅 ${formatDate(
      currentDate,
      "yyyy년 MM월"
    )} 출석 현황]\n\n${sortedAttendance
      .map((total) => {
        const names = groupedAttendance[Number(total)].map((name) =>
          Number(total) <= 1 ? `@${name}` : name
        );
        return `${total}회\n${names.join(", ")}\n`;
      })
      .join("\n")}`;

    navigator.clipboard.writeText(pasteText);
  };
  return (
    <button
      className="flex absolute top-[6px] right-1 items-center justify-center px-[6px] py-[3px] gap-[2px] rounded-md bg-white border border-scv-pink"
      onClick={() => {
        handleOnPaste(attendanceList);
      }}
    >
      <ClipboardText size={18} weight="fill" color="#dd9595" />
      <Text type="normalMediumWhite" className="!text-scv-pink">
        복사
      </Text>
    </button>
  );
};

export default CopyButton;
