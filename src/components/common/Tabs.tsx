import React from "react";
import { Link } from "react-router-dom";
import clsx from "clsx";
import Text from "./Text";

interface Tab {
  to: string;
  title: string;
  active: boolean;
}

interface TabsProps {
  tabs: Tab[];
}

const Tabs: React.FC<TabsProps> = ({ tabs }) => {
  return (
    <div className="flex justify-around">
      {tabs.map((tab) => (
        <Link
          key={tab.to}
          to={tab.to}
          className={clsx(
            "border-b py-2 w-full",
            tab.active ? "border-b border-scv-pink" : ""
          )}
        >
          <Text
            type="subTitleBlack"
            className={tab.active ? "text-scv-pink font-pretendard-bold" : ""}
          >
            {tab.title}
          </Text>
        </Link>
      ))}
    </div>
  );
};

export default Tabs;
