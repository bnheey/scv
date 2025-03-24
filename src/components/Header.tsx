import { BookOpenText, List } from "@phosphor-icons/react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import Text from "./common/Text";
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
        return "독서 현황";
      case "game":
        return "독서 토론 패널 생성";
      case "admin":
        return "관리자";
      default:
        return "독서 현황";
    }
  };

  return (
    <div className="flex items-center justify-between px-1">
      <div className="flex items-center gap-1">
        <Text type="titleBlack" className="text-left">
          {getTitle()}
        </Text>
        <BookOpenText size={20} weight="fill" />
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
