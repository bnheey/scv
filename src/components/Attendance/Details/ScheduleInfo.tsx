import { CalendarSlash } from "@phosphor-icons/react";
import Text from "../../common/Text";
import { formatDate } from "../../../utils/date";
import { ScheduleInfoList } from "../../../types/Attendance";
import clsx from "clsx";

const ScheduleInfo = ({
  date,
  scheduleInfoList,
}: {
  date: string;
  scheduleInfoList: ScheduleInfoList;
}) => {
  return (
    <div className="flex flex-col items-start mt-1">
      <Text type="subTitleBlack">{date}</Text>
      {scheduleInfoList.length > 0 ? (
        <div className="flex flex-col gap-2 mt-2">
          {scheduleInfoList.map((x) => (
            <div key={x.scheduleId} className="flex flex-col items-start gap-1">
              <Text
                type="normalMediumWhite"
                className={clsx(
                  "w-full pl-2 rounded-sm text-start",
                  formatDate(x.scheduleTime, "A") === "AM"
                    ? "bg-scv-pink"
                    : "bg-scv-green"
                )}
              >
                {formatDate(x.scheduleTime, "a")}{" "}
                {formatDate(x.scheduleTime, "hh:ss")}
              </Text>
              <div className="flex flex-wrap pl-2">
                {x.memberList.map((item, index) => (
                  <div className="flex" key={index}>
                    <Text>{item.name}</Text>
                    <Text className="mr-1">
                      {x.memberList.length - 1 !== index ? ", " : ""}
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
