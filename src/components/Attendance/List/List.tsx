import LoadingBadminton from "@/components/common/LoadingBadminton";
import Table from "@/components/common/Table";
import Text from "@/components/common/Text";
import { getAttendance } from "@/middleware/endpoints/attendance";
import type { AttendanceList } from "@/types/Attendance";
import { isFreshMember } from "@/utils/shared";
import { Smiley } from "@phosphor-icons/react";
import Cookies from "js-cookie";
import moment from "moment";
import { useEffect, useState } from "react";
import CopyButton from "./CopyButton";
import Favorite from "./Favorite";
import ListHeader from "./ListHeader";
import TierImage from "./TierImage";

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
    { key: "total", label: "출석수", sort: true },
  ];

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
          <div className="flex items-center">
            <Text>{member.name}</Text>
            <TierImage tier={member.tier} />
            {member.createdTimestamp &&
              isFreshMember(
                member.createdTimestamp,
                1,
                currentDate.toISOString()
              ) && <Smiley size={16} className="ml-0.5" color="#ffd500" />}
          </div>
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
