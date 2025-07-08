import LoadingBadminton from "@/components/common/LoadingBadminton";
import Table from "@/components/common/Table";
import { getAttendance } from "@/middleware/endpoints/attendance";
import type { AttendanceList } from "@/types/Attendance";
import Cookies from "js-cookie";
import moment from "moment";
import { useEffect, useState } from "react";
import CopyButton from "./CopyButton";
import Favorite from "./Favorite";
import ListHeader from "./ListHeader";
import MemberName from "./MemberName";
import { useNavigate } from "react-router-dom";

const List = () => {
  const navigate = useNavigate();
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
    })
      .then((attendance) => {
        const monthStart = moment(currentDate).startOf("month");
        const filteredAttendanceList = attendance.totalAttendanceList?.filter(
          (member) =>
            moment(member.createdTimestamp).isSameOrBefore(monthStart, "month")
        );
        setAttendanceList(filteredAttendanceList);
        setIsLoading(false);
      })
      .catch(() => {
        navigate("/500");
      });
  }, [currentDate]);

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

  const columns = [
    { key: "fix", label: "", width: 45 },
    { key: "name", label: "이름", sort: true },
    { key: "total", label: "출석수", sort: true, width: 100 },
  ];

  const maxAttendance =
    attendanceList.length > 0
      ? Math.max(...attendanceList.map((m) => m.totalAttendance))
      : 0;

  const data =
    attendanceList?.map((member) => ({
      isFixed: { data: fixedMembers.includes(member.memberId) },
      fix: {
        data: fixedMembers.includes(member.memberId),
        cell: (
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
      },
      name: {
        data: member.name,
        cell: (
          <MemberName
            member={member}
            currentDate={currentDate}
            maxAttendance={maxAttendance}
          />
        ),
      },
      total: { data: member.totalAttendance },
    })) ?? [];

  return (
    <div className="relative flex flex-col items-center justify-center gap-5">
      <ListHeader
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
        attendanceList={attendanceList}
      />
      <CopyButton currentDate={currentDate} attendanceList={attendanceList} />
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
