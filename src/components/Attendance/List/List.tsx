import { CaretLeft, CaretRight, ClipboardText } from "@phosphor-icons/react";
import moment from "moment";
import { useEffect, useState } from "react";
import { getAttendance } from "../../../middleware/endpoints/attendance";
import { TotalAttendanceList } from "../../../types/Attendance";
import { formatDate } from "../../../utils/date";
import Table from "../../common/Table";
import Text from "../../common/Text";

const List = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [totalAttendanceList, setTotalAttendanceList] =
    useState<TotalAttendanceList>();

  useEffect(() => {
    getAttendance({
      startDateTime: moment(currentDate)
        .startOf("month")
        .format("yyyy-MM-DDTHH:mm:ss"),
      endDateTime: moment(currentDate)
        .endOf("month")
        .format("yyyy-MM-DDTHH:mm:ss"),
    }).then((attendance) => {
      setTotalAttendanceList(attendance.totalAttendanceList);
    });
  }, [currentDate]);

  const columns = [
    { key: "name", label: "이름" },
    { key: "total", label: "출석수" },
  ];

  const handleOnPaste = (totalAttendance?: TotalAttendanceList) => {
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
    <div className="relative flex flex-col items-center justify-center gap-5">
      <div className="flex items-center justify-center pt-2">
        <button
          onClick={() => {
            setCurrentDate(moment(currentDate).add(-1, "month").toDate());
          }}
          className="py-0"
        >
          <CaretLeft />
        </button>
        <Text type="subTitleBlack" className="font-pretendard">
          {formatDate(currentDate, "yyyy년 MM월")}
        </Text>
        <button
          onClick={() => {
            setCurrentDate(moment(currentDate).add(1, "month").toDate());
          }}
          className="py-0"
        >
          <CaretRight />
        </button>
      </div>
      <button
        className="flex absolute top-[6px] right-1 items-center justify-center px-[6px] py-[3px] gap-[2px] rounded-md bg-white border border-scv-pink"
        onClick={() => {
          handleOnPaste(totalAttendanceList);
        }}
      >
        <ClipboardText size={18} weight="fill" color="#dd9595" />
        <Text type="normalMediumWhite" className="!text-scv-pink">
          복사
        </Text>
      </button>
      <Table
        data={
          totalAttendanceList?.map((member) => ({
            name: member.name,
            total: member.totalAttendance,
          })) ?? []
        }
        height="calc(100vh - 210px)"
        columns={columns}
      />
    </div>
  );
};

export default List;
