import { useLocation } from "react-router-dom";
import Calendar from "../components/Attendance/Details/Calendar";
import List from "../components/Attendance/List/List";
import Tabs from "../components/common/Tabs";

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
      <Tabs tabs={tabs} />
      {view === "list" && <List />}
      {view === "details" && <Calendar />}
    </div>
  );
};

export default Attendance;
