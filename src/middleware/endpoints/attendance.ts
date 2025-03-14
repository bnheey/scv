import type { AttendanceList, ScheduleInfoList } from "@/types/Attendance";
import axios from "axios";

export const getAttendance = async ({
  startDateTime,
  endDateTime,
}: {
  startDateTime: string;
  endDateTime: string;
}) => {
  const { data } = await axios.get<{
    scheduleInfoList: ScheduleInfoList;
    totalAttendanceList: AttendanceList;
  }>(
    `https://scvclub.ddns.net/api/attendance?startDateTime=${startDateTime}&endDateTime=${endDateTime}`
  );
  return data;
};
