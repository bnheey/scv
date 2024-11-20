import { Route, Routes } from "react-router-dom";
import Attendance from "../pages/Attendance";
import Game from "../pages/Game";
import Admin from "../pages/Admin";

const AppRouter = () => (
  <div className="px-6">
    <Routes>
      <Route path="/" element={<Attendance />} />
      <Route path="/attendance" element={<Attendance />} />
      <Route path="/game" element={<Game />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  </div>
);

export default AppRouter;
