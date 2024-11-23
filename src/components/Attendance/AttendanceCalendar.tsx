import { CalendarSlash } from "@phosphor-icons/react";
import clsx from "clsx";
import moment from "moment";
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import { Value } from "react-calendar/src/shared/types.js";
import "../../assets/css/calendar.css";
import { getAttendance } from "../../middleware/endpoints/attendance";
import { ScheduleInfoList } from "../../types/Attendance";
import { formatDate } from "../../utils/date";
import Text from "../common/Text";

const AttendanceCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeStartDate, setActiveStartDate] = useState<Date | null>(
    new Date()
  );
  const [scheduleInfoList, setScheduleInfoList] = useState<ScheduleInfoList>();
  const [scheduleInfo, setScheduleInfo] = useState<ScheduleInfoList>([]);

  const onChange = (newDate: Value) => {
    if (newDate instanceof Date) {
      setScheduleInfo([]);
      scheduleInfoList?.find((x) => {
        if (
          moment(x.scheduleTime).format("YYYY-MM-DD") ===
          moment(newDate).format("YYYY-MM-DD")
        ) {
          setScheduleInfo((prev) => [...prev, x]);
        }
      });
      setCurrentDate(newDate);
    }
  };

  const handleTodayClick = () => {
    const today = new Date();
    setActiveStartDate(today);
    setCurrentDate(today);
  };

  useEffect(() => {
    if (activeStartDate === null) return;

    getAttendance({
      startDateTime: moment(activeStartDate)
        .startOf("month")
        .format("yyyy-MM-DDTHH:mm:ss"),
      endDateTime: moment(activeStartDate)
        .endOf("month")
        .format("yyyy-MM-DDTHH:mm:ss"),
    }).then((attendance) => {
      setScheduleInfoList(attendance.scheduleInfoList);
      setScheduleInfo([]);
      // activeStartDate가 currentDate와 다른 달이면 currentDate를 activeStartDate로 변경
      if (
        moment(activeStartDate).format("MM") !==
        moment(currentDate).format("MM")
      ) {
        setCurrentDate(activeStartDate);
      }
      attendance.scheduleInfoList?.find((x) => {
        if (formatDate(x.scheduleTime) === formatDate(currentDate)) {
          setScheduleInfo((prev) => [...prev, x]);
        }
      });
    });
  }, [activeStartDate]);

  return (
    <div className="relative flex flex-col gap-3">
      <Calendar
        view="month"
        minDetail="month"
        calendarType="gregory"
        value={currentDate}
        activeStartDate={activeStartDate === null ? undefined : activeStartDate}
        onChange={onChange}
        onActiveStartDateChange={({ activeStartDate }) => {
          setActiveStartDate(activeStartDate);
        }}
        defaultActiveStartDate={currentDate}
        prev2Label={null}
        next2Label={null}
        formatDay={(locale, date) => String(date.getDate())}
        tileClassName="aspect-square rounded-full flex items-center justify-center"
        tileContent={({ date }) => {
          if (
            scheduleInfoList?.find(
              (x) => formatDate(x.scheduleTime) === formatDate(date)
            )
          ) {
            return (
              <div
                className={clsx(
                  "w-1 h-1 mt-1 rounded-full",
                  formatDate(currentDate) === formatDate(date)
                    ? "bg-white"
                    : "bg-scv-pink"
                )}
              />
            );
          }
        }}
      />
      <button
        onClick={handleTodayClick}
        className="absolute top-0 px-2 py-1 my-2 bg-gray-100 right-20"
      >
        <Text type="smallBlack">오늘</Text>
      </button>
      <hr />
      <div className="flex flex-col items-start mt-1">
        <Text type="subTitleBlack">
          {formatDate(currentDate, "YYYY년 MM월 DD일")}
        </Text>
        {scheduleInfo.length > 0 ? (
          <div className="flex flex-col gap-2 mt-2">
            {scheduleInfo.map((x) => (
              <div
                key={x.scheduleId}
                className="flex flex-col items-start gap-1"
              >
                <Text
                  type="normalMediumWhite"
                  className="w-full pl-2 rounded-sm› bg-scv-pink text-start"
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
            <Text className="">등록된 일정이 없습니다.</Text>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceCalendar;
