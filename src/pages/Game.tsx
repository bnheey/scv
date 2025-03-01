import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Input from "../components/Game/Input";
import Output from "../components/Game/Output/Output";

const Game = () => {
  const location = useLocation();
  const subPath = location.pathname.split("/")[2];
  const navigate = useNavigate();

  const [membersInfo, setMembersInfo] = useState<
    { name: string; tier: number; member_id: number }[]
  >([]);

  useEffect(() => {
    if (subPath === "output") {
      if (membersInfo.length === 0) {
        navigate("/game");
      }
    }
  }, [subPath]);

  return (
    <div className="flex flex-col h-full gap-3 mt-2">
      {subPath === "output" ? (
        <Output membersInfo={membersInfo} />
      ) : (
        <Input setMembersInfo={setMembersInfo} />
      )}
    </div>
  );
};

export default Game;
