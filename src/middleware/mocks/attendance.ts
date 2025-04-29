import type { AttendanceList, ScheduleInfoList } from "@/types/Attendance";
import { ATTENDANCE_DATA } from "./mockData";

export const getAttendance = async ({
  startDateTime,
  endDateTime,
}: {
  startDateTime: string;
  endDateTime: string;
}): Promise<{
  scheduleInfoList: ScheduleInfoList;
  totalAttendanceList: AttendanceList;
}> => {
  console.log(startDateTime, endDateTime);

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(ATTENDANCE_DATA);
    }, 1000);
  });
};
