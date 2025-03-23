import tier1Image from "@/assets/image/1.png";
import tier2Image from "@/assets/image/2.png";
import tier3Image from "@/assets/image/3.png";
import tier4Image from "@/assets/image/4.png";
import tier5Image from "@/assets/image/5.png";
import tier6Image from "@/assets/image/6.png";
import clsx from "clsx";
import { useState } from "react";

const TierImage = ({ tier }: { tier: number }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const handleImageLoaded = () => {
    setIsLoaded(true);
  };

  const tierImage: Record<number, string> = {
    1: tier1Image,
    2: tier2Image,
    3: tier3Image,
    4: tier4Image,
    5: tier5Image,
    6: tier6Image,
  };

  return (
    <>
      {!isLoaded && (
        <div className="w-5 h-5 ml-0.5 bg-gray-200 rounded-md animate-pulse" />
      )}
      <img
        src={tierImage[tier]}
        className={clsx(
          "w-5 h-5 ml-0.5 rounded-md mt-0.5",
          !isLoaded ? "hidden" : ""
        )}
        onLoad={handleImageLoaded}
      />
    </>
  );
};

export default TierImage;
