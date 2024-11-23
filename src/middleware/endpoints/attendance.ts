import axios from "axios";
import { ScheduleInfoList, TotalAttendanceList } from "../../types/Attendance";

export const getAttendance = async ({
  startDateTime,
  endDateTime,
}: {
  startDateTime: string;
  endDateTime: string;
}) => {
  const { data } = await axios.get<{
    scheduleInfoList: ScheduleInfoList;
    totalAttendanceList: TotalAttendanceList;
  }>(
    `http://35.227.188.57:8080/api/attendance?startDateTime=${startDateTime}&endDateTime=${endDateTime}`
  );
  return data;
};
