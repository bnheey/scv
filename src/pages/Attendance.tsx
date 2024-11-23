import { useLocation } from "react-router-dom";
import Tabs from "../components/common/Tabs";
import Title from "../components/common/Title";
import Calendar from "../components/Attendance/Details/Calendar";

const Attendance = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const view = searchParams.get("view") || "list";

  const tabs = [
    { to: "/attendance?view=list", title: "목록", active: view === "list" },
    {
      to: "/attendance?view=details",
      title: "상세",
      active: view === "details",
    },
  ];
  return (
    <div className="flex flex-col gap-3">
      <Title className="text-left">출석 확인</Title>
      <Tabs tabs={tabs} />
      {view === "details" && <Calendar />}
    </div>
  );
};

export default Attendance;
