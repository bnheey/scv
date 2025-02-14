import Lottie from "lottie-react";
import noData from "../assets/lottie/no_data.json";

const Game = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="max-w-[70%]">
        <Lottie animationData={noData} />
      </div>
    </div>
  );
};

export default Game;
