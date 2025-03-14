import Text from "@/components/common/Text";
import type { ScheduleInfoList, SimpleMember } from "@/types/Attendance";
import { formatDate } from "@/utils/date";
import { getToast } from "@/utils/shared";
import { CalendarSlash, ClipboardText } from "@phosphor-icons/react";
import clsx from "clsx";

const ScheduleInfo = ({
  date,
  scheduleInfoList,
}: {
  date: string;
  scheduleInfoList: ScheduleInfoList;
}) => {
  const sortedScheduleInfoList = scheduleInfoList.sort((a, b) => {
    return (
      new Date(a.scheduleTime).getTime() - new Date(b.scheduleTime).getTime()
    );
  });

  const handleOnPaste = (memberList: SimpleMember[]) => {
    navigator.clipboard.writeText(
      `참석: ${memberList.length} \n(${memberList
        .map((x) => x.name)
        .join(", ")})`
    );
  };

  return (
    <div className="flex flex-col items-start mt-1">
      <Text type="subTitleBlack">{date}</Text>
      {sortedScheduleInfoList.length > 0 ? (
        <div className="flex flex-col w-full gap-2 mt-2">
          {sortedScheduleInfoList.map((schedule) => (
            <div
              key={schedule.scheduleId}
              className="flex flex-col items-start gap-1"
            >
              <div
                className={clsx(
                  "flex items-center justify-between w-full pl-2 pr-4 py-[1.5px] gap-2 rounded-sm ",
                  formatDate(schedule.scheduleTime, "A") === "AM"
                    ? "bg-scv-pink"
                    : "bg-scv-green"
                )}
              >
                <Text type="normalMediumWhite" className={clsx()}>
                  {formatDate(schedule.scheduleTime, "a")}{" "}
                  {formatDate(schedule.scheduleTime, "hh:mm")}
                  {` (총 ${schedule.memberList.length}명)`}
                </Text>
                <button
                  className="flex items-center justify-center p-0 bg-transparent"
                  onClick={() => {
                    handleOnPaste(schedule.memberList);
                    getToast("참석자 목록이 복사되었습니다.");
                  }}
                >
                  <ClipboardText size={16} weight="fill" color="white" />
                  <Text type="smallMediumWhite" className="ml-[2px]">
                    복사
                  </Text>
                </button>
              </div>
              <div className="flex flex-wrap pl-2">
                {schedule.memberList.map((item, index) => (
                  <div className="flex" key={index}>
                    <Text>{item.name}</Text>
                    <Text className="mr-1">
                      {schedule.memberList.length - 1 !== index ? ", " : ""}
                    </Text>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center w-full gap-1 mt-6">
          <CalendarSlash size={55} weight="thin" />
          <Text>등록된 일정이 없습니다.</Text>
        </div>
      )}
    </div>
  );
};

export default ScheduleInfo;
