export type SimpleMember = {
  memberId: number;
  name: string;
  totalAttendance?: number;
  tier: number;
};

export interface ScheduleInfo {
  scheduleId: number;
  scheduleTime: string;
  vipTime: number;
  memberList: { memberId: number; name: string }[];
}

export type ScheduleInfoList = ScheduleInfo[];
export type AttendanceList = SimpleMember[];
