import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { useModal } from "../middleware/stores/modal";
import Admin from "../pages/Admin";
import Attendance from "../pages/Attendance";
import Game from "../pages/Game";
import Header from "./Header";
import Error from "@/pages/Error";

const AppRouter = () => {
  const location = useLocation();
  const { isOpen, closeModal } = useModal();

  useEffect(() => {
    if (isOpen) {
      closeModal();
    }
  }, [location.pathname]);

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Attendance />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/game/*" element={<Game />} />
        <Route path="/admin" element={<Admin />} />
        {/* 잘못된 경로에 대한 기본 페이지 */}
        <Route path="/500" element={<Error code={500} />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </>
  );
};

export default AppRouter;
