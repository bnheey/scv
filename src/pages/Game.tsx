import { useState } from "react";
import Input from "../components/Game/Input";

const Game = () => {
  const [membersInfo, setMembersInfo] = useState<
    { name: string; tier: number }[]
  >([]);

  return (
    <div className="flex flex-col h-full gap-3 mt-3">
      <Input setMembersInfo={setMembersInfo} />
    </div>
  );
};

export default Game;
