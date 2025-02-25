import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import Text from "../../common/Text";
import { formatDate } from "../../../utils/date";
import moment from "moment";

interface ListHeaderProps {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
}

const ListHeader = ({ currentDate, setCurrentDate }: ListHeaderProps) => {
  return (
    <div className="flex items-center justify-center pt-2">
      <button
        onClick={() => {
          setCurrentDate(moment(currentDate).add(-1, "month").toDate());
        }}
        className="py-0"
      >
        <CaretLeft />
      </button>
      <Text type="subTitleBlack" className="font-pretendard">
        {formatDate(currentDate, "yyyy년 MM월")}
      </Text>
      <button
        onClick={() => {
          const nextDate = moment(currentDate).add(1, "month").toDate();
          if (moment(nextDate).isAfter(new Date())) return;
          setCurrentDate(nextDate);
        }}
        className="py-0"
      >
        <CaretRight />
      </button>
    </div>
  );
};

export default ListHeader;
