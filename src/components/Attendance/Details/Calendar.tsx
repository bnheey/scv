import clsx from "clsx";
import moment from "moment";
import { useEffect, useState } from "react";
import ReactCalendar from "react-calendar";
import Text from "@/components/common/Text";
import useLoading from "@/hooks/useLoading";
import { getAttendance } from "@/middleware/endpoints/attendance";
import type { ScheduleInfoList } from "@/types/Attendance";
import { formatDate } from "@/utils/date";
import type { Value } from "react-calendar/src/shared/types.js";
import "@/assets/css/Calendar.css";
import ScheduleInfo from "./ScheduleInfo";
import { Equals } from "@phosphor-icons/react";

const Calendar = () => {
  const { isLoading, setIsLoading, Loading } = useLoading();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeStartDate, setActiveStartDate] = useState<Date | null>(
    new Date(moment(currentDate).startOf("month").format("yyyy-MM-DDTHH:mm:ss"))
  );

  const [scheduleInfoList, setScheduleInfoList] = useState<ScheduleInfoList>();
  const [scheduleInfo, setScheduleInfo] = useState<ScheduleInfoList>([]);

  const [isOpenScheduleInfo, setIsOpenScheduleInfo] = useState<boolean>(true);
  const [touchStartY, setTouchStartY] = useState(0);
  const [touchEndY, setTouchEndY] = useState(0);

  const onChange = (newDate: Value) => {
    if (newDate instanceof Date) {
      setScheduleInfo([]);
      setIsOpenScheduleInfo(false);

      scheduleInfoList?.find((x) => {
        if (
          moment(x.scheduleTime).format("YYYY-MM-DD") ===
          moment(newDate).format("YYYY-MM-DD")
        ) {
          setScheduleInfo((prev) => [...prev, x]);
          setIsOpenScheduleInfo(true);
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

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndY(e.touches[0].clientY);
  };

  const handleTouchEnd = () => {
    const touchDifference = touchStartY - touchEndY;

    if (touchDifference > 50) {
      // 위로 슬라이드
      setIsOpenScheduleInfo(true);
    } else if (touchDifference < -50) {
      // 아래로 슬라이드
      setIsOpenScheduleInfo(false);
    }
  };

  // TODO 스크롤 위치 고민
  return (
    <div className="relative flex flex-col gap-3 max-h-[calc(100vh-130px)]">
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
        minDate={new Date("2024-11-01")}
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

      {/* 출석 상세 */}
      <div
        className={clsx(
          "absolute h-full min-h-[150%] w-[calc(100%+20px)] -left-2.5 px-3 bg-white border-t border rounded-md drop-shadow-2xl",
          isOpenScheduleInfo
            ? "top-[95%] animate-slideTop -bottom-64"
            : "animate-slideBottom top-[150%] -bottom-3"
        )}
        style={{
          boxShadow:
            "0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 -2px 4px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.02)",
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <button onClick={() => setIsOpenScheduleInfo(!isOpenScheduleInfo)}>
          <Equals size={20} className="mx-auto mt-0.5" />
        </button>
        {isLoading ? (
          <Loading />
        ) : (
          <ScheduleInfo
            date={formatDate(currentDate, "MM월 DD일")}
            scheduleInfoList={scheduleInfo}
          />
        )}
      </div>
    </div>
  );
};

export default Calendar;
