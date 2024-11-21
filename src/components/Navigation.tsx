import { CalendarCheck, Network, UserGear } from "@phosphor-icons/react";
import clsx from "clsx";
import { Link, useLocation } from "react-router-dom";
import Text from "./common/Text";

const Navigation = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <nav className="pt-2.5 border-t-[0.5px] h-20">
      <ul className="flex items-center justify-around h-[50px]">
        {[
          {
            to: "/attendance",
            icon: CalendarCheck,
            label: "출석",
            paths: ["/attendance", "/"],
          },
          { to: "/game", icon: Network, label: "경기표", paths: ["/game"] },
          { to: "/admin", icon: UserGear, label: "관리자", paths: ["/admin"] },
        ].map(({ to, icon: Icon, label, paths }) => (
          <li
            key={to}
            className={clsx(
              "w-16 h-16 p-2 rounded-full",
              paths.includes(currentPath) ? "bg-gray-100 shadow-md" : "bg-white"
            )}
          >
            <Link
              to={to}
              className="flex flex-col items-center gap-1 text-black hover:text-black"
            >
              <Icon
                size={24}
                weight={paths.includes(currentPath) ? "fill" : "light"}
              />
              <Text type="normalBlack">{label}</Text>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;
