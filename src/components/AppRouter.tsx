import { Route, Routes } from "react-router-dom";
import Admin from "../pages/Admin";
import Attendance from "../pages/Attendance";
import Game from "../pages/Game";
import Header from "./Header";

const AppRouter = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Attendance />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/game" element={<Game />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </>
  );
};

export default AppRouter;
