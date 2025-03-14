import { useState } from "react";
import { useLocation } from "react-router-dom";
import Input from "@/components/Game/Input";
import type { Member } from "../types/Members";
import Output from "@/components/Game/Output/Output";

const Game = () => {
  const location = useLocation();
  const subPath = location.pathname.split("/")[2];

  const [membersInfo, setMembersInfo] = useState<Member[]>([]);

  return (
    <div className="flex flex-col h-full gap-3 mt-2 overflow-auto">
      {subPath === "output" ? (
        <Output membersInfo={membersInfo} />
      ) : (
        <Input setMembersInfo={setMembersInfo} />
      )}
    </div>
  );
};

export default Game;
