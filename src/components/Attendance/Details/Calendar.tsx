import clsx from "clsx";
import moment from "moment";
import { useEffect, useState } from "react";
import ReactCalendar from "react-calendar";
import { Value } from "react-calendar/src/shared/types.js";
import "../../../assets/css/Calendar.css";
import useLoading from "../../../hooks/useLoading";
import { getAttendance } from "../../../middleware/endpoints/attendance";
import { ScheduleInfoList } from "../../../types/Attendance";
import { formatDate } from "../../../utils/date";
import Text from "../../common/Text";
import ScheduleInfo from "../Details/ScheduleInfo";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeStartDate, setActiveStartDate] = useState<Date | null>(
    new Date(moment(currentDate).startOf("month").format("yyyy-MM-DDTHH:mm:ss"))
  );
  const [scheduleInfoList, setScheduleInfoList] = useState<ScheduleInfoList>();
  const [scheduleInfo, setScheduleInfo] = useState<ScheduleInfoList>([]);
  const { isLoading, setIsLoading, Loading } = useLoading();

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

    setIsLoading(true);
    getAttendance({
      startDateTime: moment(activeStartDate)
        .startOf("month")
        .format("yyyy-MM-DDTHH:mm:ss"),
      endDateTime: moment(activeStartDate)
        .endOf("month")
        .format("yyyy-MM-DDTHH:mm:ss"),
    }).then((attendance) => {
      setScheduleInfoList(attendance.scheduleInfoList);
      setIsLoading(false);
      setScheduleInfo([]);
      setScheduleInfo(
        () =>
          attendance.scheduleInfoList?.filter(
            (x) => formatDate(x.scheduleTime) === formatDate(currentDate)
          ) || []
      );
    });
  }, [activeStartDate]);

  // TODO 스크롤 위치 고민
  return (
    <div className="relative flex flex-col gap-3 max-h-[calc(100vh-130px)] overflow-y-auto">
      <ReactCalendar
        view="month"
        minDetail="month"
        calendarType="gregory"
        value={currentDate}
        activeStartDate={activeStartDate === null ? undefined : activeStartDate}
        onChange={onChange}
        onActiveStartDateChange={({ activeStartDate }) => {
          if (activeStartDate === null) return;
          setCurrentDate(activeStartDate);
          setActiveStartDate(activeStartDate);
        }}
        maxDate={new Date()}
        defaultActiveStartDate={currentDate}
        prev2Label={null}
        next2Label={null}
        formatDay={(_, date) => String(date.getDate())}
        tileClassName="aspect-square rounded-full flex items-center justify-center"
        tileContent={({ date }) => {
          const targetSchedule =
            scheduleInfoList?.filter(
              (x) => formatDate(x.scheduleTime) === formatDate(date)
            ) || [];
          if (targetSchedule?.length > 0) {
            return (
              <div className="flex gap-1">
                {targetSchedule.map((schedule) => (
                  <div
                    key={schedule.scheduleId}
                    className={clsx(
                      "w-1 h-1 mt-1 rounded-full",
                      formatDate(currentDate) === formatDate(date)
                        ? "bg-white"
                        : formatDate(schedule.scheduleTime, "A") == "AM"
                        ? "bg-scv-pink"
                        : "bg-scv-green"
                    )}
                  />
                ))}
              </div>
            );
          }
        }}
        navigationLabel={({ date }) => {
          return (
            <Text type="subTitleBlack" className="font-pretendard">
              {formatDate(date, "YYYY년 MM월")}
            </Text>
          );
        }}
      />
      <button
        onClick={handleTodayClick}
        className="absolute top-0 px-2 py-1 my-2 bg-gray-100 right-[21%]"
      >
        <Text type="smallBlack">오늘</Text>
      </button>
      <hr />
      {isLoading ? (
        <Loading />
      ) : (
        <ScheduleInfo
          date={formatDate(currentDate, "MM월 DD일")}
          scheduleInfoList={scheduleInfo}
        />
      )}
    </div>
  );
};

export default Calendar;
