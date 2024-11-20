import { CalendarCheck, Network, UserGear } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import Text from "./common/Text";

const Navigation = () => {
  return (
    <nav className="pt-2.5 border-t-[0.5px]">
      <ul className="flex items-center justify-around h-[50px]">
        <li>
          <Link
            to="/attendance"
            className="text-black flex flex-col items-center gap-1"
          >
            <CalendarCheck size={24} />
            <Text type="normalBlack">출석</Text>
          </Link>
        </li>
        <li>
          <Link
            to="/game"
            className="text-black flex flex-col items-center gap-1"
          >
            <Network size={24} />
            <Text type="normalBlack">경기표</Text>
          </Link>
        </li>
        <li>
          <Link
            to="/admin"
            className="text-black flex flex-col items-center gap-1"
          >
            <UserGear size={24} />
            <Text type="normalBlack">관리자</Text>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
