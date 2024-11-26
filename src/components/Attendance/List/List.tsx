import { CaretLeft, CaretRight } from "@phosphor-icons/react";
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

  return (
    <div>
      <div className="flex items-center justify-center pb-2">
        <button
          onClick={() => {
            setCurrentDate(moment(currentDate).add(-1, "month").toDate());
          }}
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
        >
          <CaretRight />
        </button>
      </div>
      <Table
        data={
          totalAttendanceList?.map((member) => ({
            name: member.name,
            total: member.totalAttendance,
          })) ?? []
        }
        height="calc(100vh - 280px)"
        columns={columns}
      />
    </div>
  );
};

export default List;
