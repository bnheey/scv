import {
  CalendarCheck,
  ClipboardText,
  Network,
  X,
} from "@phosphor-icons/react";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Text from "./common/Text";

interface LnbProps {
  onClose: () => void;
}

const Lnb = ({ onClose }: LnbProps) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [isClosing, setIsClosing] = useState(false);

  const navigationOptions = [
    {
      to: "/attendance",
      icon: CalendarCheck,
      label: "출석",
      paths: ["/attendance", "/"],
    },
    {
      to: "/game",
      icon: Network,
      label: "경기표",
      paths: ["/game"],
    },
    { to: "/form", icon: ClipboardText, label: "양식", paths: ["/form"] },
    // { to: "/admin", icon: UserGear, label: "관리자", paths: ["/admin"] },
  ];

  const handleClose = () => {
    setIsClosing(true);
  };

  useEffect(() => {
    if (isClosing) {
      const timer = setTimeout(() => {
        onClose();
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [isClosing, onClose]);

  return (
    <>
      <div
        className="absolute top-0 left-0 z-40 w-full h-full bg-black opacity-40"
        onClick={handleClose}
      />
      <nav
        className={`absolute right-0 z-50 h-screen top-0 bg-white w-[60%] ${
          isClosing ? "animate-slideOut" : "animate-slideIn"
        }`}
      >
        <div className="px-4 pt-6 pb-4">
          <X
            size={22}
            onClick={handleClose}
            className="ml-auto cursor-pointer"
          />
        </div>
        <ul className="mt-1">
          {navigationOptions.map(({ to, icon: Icon, label, paths }) => (
            <li
              className={clsx(
                "py-3 px-7 border-y border-y-gray-200 -my-[1px]",
                location.pathname === to ? "bg-gray-100" : "bg-white"
              )}
              key={label}
            >
              <Link
                to={to}
                className="flex gap-3 text-black hover:text-black"
                onClick={handleClose}
              >
                <Icon
                  size={20}
                  weight={paths.includes(currentPath) ? "fill" : "light"}
                />
                <Text type="subTitleBlack" className="text-left">
                  {label}
                </Text>
              </Link>
            </li>
          ))}
        </ul>
        {/* <div className="absolute bottom-3 right-4">
          <button className="flex gap-1 px-2 py-1 bg-gray-100 border border-gray-400 rounded-md">
            <Text type="normalBlack">관리자</Text>
            <SignIn size={22} weight="light" />
          </button>
        </div> */}
      </nav>
    </>
  );
};

export default Lnb;
