import tier1Image from "@/assets/image/1.webp";
import tier2Image from "@/assets/image/2.webp";
import tier3Image from "@/assets/image/3.webp";
import tier4Image from "@/assets/image/4.webp";
import tier5Image from "@/assets/image/5.webp";
import tier6Image from "@/assets/image/6.webp";
import Badge from "@/components/common/Badge";
import clsx from "clsx";
import { useState } from "react";

const TierImage = ({ tier }: { tier: number }) => {
  const [isLoaded, setIsLoaded] = useState(tier === 0);
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
      {!isLoaded && tier !== 0 && (
        <div className="w-5 h-5 bg-gray-200 rounded-md animate-pulse" />
      )}
      {tier !== 0 && (
        <img
          src={tierImage[tier]}
          className={clsx("w-5 h-5 rounded-md mt-1", !isLoaded ? "hidden" : "")}
          onLoad={handleImageLoaded}
        />
      )}
      {tier === 0 && <Badge color="#d1d5db">미정</Badge>}
    </>
  );
};

export default TierImage;
