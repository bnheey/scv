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
    `https://scvclub.ddns.net/api/attendance?startDateTime=${startDateTime}&endDateTime=${endDateTime}`
  );
  return data;
};
