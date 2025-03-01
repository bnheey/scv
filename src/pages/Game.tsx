import { useState } from "react";
import Input from "../components/Game/Input";
import { useLocation } from "react-router-dom";
import Output from "../components/Game/Output/Output";

const Game = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const type = query.get("type");
  const [membersInfo, setMembersInfo] = useState<
    { name: string; tier: number; member_id: number }[]
  >([]);

  return (
    <div className="flex flex-col h-full gap-3 mt-2">
      {type === "output" ? (
        <Output membersInfo={membersInfo} />
      ) : (
        <Input setMembersInfo={setMembersInfo} />
      )}
    </div>
  );
};

export default Game;
