import moment from "moment";

export const formatDate = (date: string | Date, format?: string) => {
  if (!format) return moment(date).format("YYYY-MM-DD");
  switch (format) {
    case "a":
      return moment(date).format("a") === "am" ? "오전" : "오후";
    default:
      return moment(date).format(format);
  }
};

/**
 * 현재 시간과 요일을 기준으로 게임 시간을 반환하는 함수
 * @returns 게임 시간 문자열
 */
export const getGameTime = () => {
  const currentHour = new Date().getHours();
  const isWeekend = [0, 6].includes(new Date().getDay());
  if (isWeekend) {
    return currentHour < 12 ? "오전 09시 00분" : "오후 01시 00분";
  }
  return currentHour < 12 ? "오전 10시 00분" : "오후 07시 30분";
};

/**
 * 한국어 요일 반환하는 함수
 * @param date - 날짜 객체 또는 문자열
 * @param type - "short" 또는 "long" 형식 지정 (기본값: short)
 * @returns 요일 문자열
 */
export const getDayName = (
  date: Date | string,
  type: "short" | "long" = "short"
) => {
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  const longDays = [
    "일요일",
    "월요일",
    "화요일",
    "수요일",
    "목요일",
    "금요일",
    "토요일",
  ];
  if (type === "long") {
    return longDays[new Date(date).getDay()];
  }
  return days[new Date(date).getDay()];
};
