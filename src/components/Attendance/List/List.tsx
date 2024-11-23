import { useEffect, useState } from "react";
import { TotalAttendanceList } from "../../../types/Attendance";
import Table from "../../common/Table";
import useLoading from "../../../hooks/useLoading";
import moment from "moment";
import { getAttendance } from "../../../middleware/endpoints/attendance";
import { formatDate } from "../../../utils/date";
import Text from "../../common/Text";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";

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
        </Text>{" "}
        <button
          onClick={() => {
            setCurrentDate(moment(currentDate).add(1, "month").toDate());
          }}
        >
          <CaretRight />
        </button>
      </div>
      <div className="w-full max-h-[calc(100vh-260px)] overflow-y-auto">
        <Table
          data={
            totalAttendanceList?.map((member) => ({
              name: member.name,
              total: member.totalAttendance,
            })) ?? []
          }
          columns={columns}
        />
      </div>
    </div>
  );
};

export default List;
