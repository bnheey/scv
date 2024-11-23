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
