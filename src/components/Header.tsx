import { List, Racquet } from "@phosphor-icons/react";
import Text from "./common/Text";

import { useLocation } from "react-router-dom";
import { useState } from "react";
import Lnb from "./Lnb";

const Header = () => {
  const location = useLocation();
  const [isLnbOpen, setIsLnbOpen] = useState(false);

  const handleListClick = () => {
    setIsLnbOpen(!isLnbOpen);
  };
  const getTitle = () => {
    const path = location.pathname.split("/")[1];

    switch (path) {
      case "attendance":
        return "출석 확인";
      case "game":
        return "경기표 생성";
      case "admin":
        return "관리자";
      default:
        return "출석 확인";
    }
  };

  return (
    <div className="flex items-center justify-between px-1">
      <div className="flex items-center gap-1">
        <Text type="titleBlack" className="text-left">
          {getTitle()}
        </Text>
        <Racquet size={20} weight="fill" />
      </div>
      <List size={20} onClick={handleListClick} className="cursor-pointer" />
      {isLnbOpen && (
        <Lnb
          onClose={() => {
            setIsLnbOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default Header;
