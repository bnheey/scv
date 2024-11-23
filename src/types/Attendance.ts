export type SimpleMember = {
  memberId: number;
  name: string;
  totalAttendance?: number;
};

export interface ScheduleInfo {
  scheduleId: number;
  scheduleTime: string;
  vipTime: number;
  memberList: SimpleMember[];
}

export type ScheduleInfoList = ScheduleInfo[];
export type TotalAttendanceList = SimpleMember[];
