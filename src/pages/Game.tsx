import Input from "@/components/Game/Input";
import Output from "@/components/Game/Output/Output";
import type { Game as GameType } from "@/types/Games";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import type { Member } from "../types/Members";

const Game = () => {
  const location = useLocation();
  const subPath = location.pathname.split("/")[2];
  const searchParams = new URLSearchParams(location.search);
  const type = searchParams.get("type") || "member";

  const [parseInput, setParseInput] = useState<Member[] | GameType[]>([]);

  return (
    <div className="flex flex-col h-full gap-3 mt-2 overflow-auto">
      {subPath === "output" ? (
        <Output parseInput={parseInput} type={type} />
      ) : (
        <Input setParseInput={setParseInput} />
      )}
    </div>
  );
};

export default Game;
