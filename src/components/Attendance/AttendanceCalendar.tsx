import moment from "moment";
import { useState } from "react";
import Calendar from "react-calendar";
import { Value } from "react-calendar/src/shared/types.js";
import "../../assets/css/calendar.css";
import Text from "../common/Text";

const AttendanceCalendar = () => {
  const [date, setDate] = useState(new Date());
  const [activeStartDate, setActiveStartDate] = useState<Date | null>(
    new Date()
  );

  const onChange = (newDate: Value, e) => {
    console.log(newDate);

    if (newDate instanceof Date) {
      setDate(newDate);
    }
  };

  const handleTodayClick = () => {
    const today = new Date();
    setActiveStartDate(today);
    setDate(today);
  };

  return (
    <div className="relative flex flex-col gap-3">
      <Calendar
        view="month"
        minDetail="month"
        calendarType="gregory"
        value={date}
        activeStartDate={activeStartDate === null ? undefined : activeStartDate}
        onChange={onChange}
        onClickDay={() => {
          console.log("click");
        }}
        onActiveStartDateChange={({ activeStartDate }) =>
          setActiveStartDate(activeStartDate)
        }
        defaultActiveStartDate={date}
        prev2Label={null}
        next2Label={null}
        formatDay={(locale, date) => String(date.getDate())}
        tileClassName="aspect-square rounded-full flex items-center justify-center"
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
          {moment(date).format("YYYY년 MM월 DD일 hh:mm A")}
        </Text>
      </div>
    </div>
  );
};

export default AttendanceCalendar;
