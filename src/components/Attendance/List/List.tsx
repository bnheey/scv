import Cookies from "js-cookie";
import { CaretLeft, CaretRight, ClipboardText } from "@phosphor-icons/react";
import moment from "moment";
import { useEffect, useState } from "react";
import { getAttendance } from "../../../middleware/endpoints/attendance";
import { AttendanceList } from "../../../types/Attendance";
import { formatDate } from "../../../utils/date";
import Table from "../../common/Table";
import Text from "../../common/Text";
import Favorite from "./Star";
import LoadingBadminton from "../../common/LoadingBadminton";

const List = () => {
  const FIXED_MEMBERS = JSON.parse(Cookies.get("FIX_MEMBERS") || "[]");
  const [fixedMembers, setFixedMembers] = useState<number[]>(FIXED_MEMBERS);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [attendanceList, setAttendanceList] = useState<AttendanceList>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    getAttendance({
      startDateTime: moment(currentDate)
        .startOf("month")
        .format("yyyy-MM-DDTHH:mm:ss"),
      endDateTime: moment(currentDate)
        .endOf("month")
        .format("yyyy-MM-DDTHH:mm:ss"),
    }).then((attendance) => {
      setAttendanceList(attendance.totalAttendanceList);
      setIsLoading(false);
    });
  }, [currentDate]);

  const columns = [
    { key: "fix", label: "", width: 45 },
    { key: "name", label: "이름", sort: true },
    { key: "total", label: "출석수", sort: true },
  ];

  useEffect(() => {
    if (fixedMembers.length > 0) {
      // fixedMembers 에 호함된 멤버들을 상단으로 정렬
      const sortedData = attendanceList?.sort((a, b) => {
        if (
          fixedMembers.includes(a.memberId) &&
          fixedMembers.includes(b.memberId)
        )
          return 0;
        if (fixedMembers.includes(a.memberId)) return -1;
        if (fixedMembers.includes(b.memberId)) return 1;
        return 0;
      });
      setAttendanceList([...sortedData]);
      const tbodyElement = document.getElementsByTagName("tbody")[0];
      tbodyElement?.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [fixedMembers]);

  const data =
    attendanceList?.map((member) => ({
      isFixed: fixedMembers.includes(member.memberId),
      fix: (
        <Favorite
          isFixed={fixedMembers.includes(member.memberId)}
          onClick={() => {
            setFixedMembers((prev) => {
              const updatedFixMembers = prev.includes(member.memberId)
                ? prev.filter((id) => id !== member.memberId)
                : [...prev, member.memberId];
              Cookies.set("FIX_MEMBERS", JSON.stringify(updatedFixMembers), {
                expires: 365,
              });
              return updatedFixMembers;
            });
          }}
        />
      ),
      name: member.name,
      total: member.totalAttendance,
    })) ?? [];

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
          handleOnPaste(attendanceList);
        }}
      >
        <ClipboardText size={18} weight="fill" color="#dd9595" />
        <Text type="normalMediumWhite" className="!text-scv-pink">
          복사
        </Text>
      </button>
      {isLoading ? (
        <LoadingBadminton />
      ) : (
        <Table
          data={data}
          defaultSort="asc"
          defaultSortKey="name"
          height="calc(100vh - 210px)"
          columns={columns}
        />
      )}
    </div>
  );
};

export default List;
