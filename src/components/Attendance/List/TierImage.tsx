import tier1Image from "@/assets/image/1.png";
import tier2Image from "@/assets/image/2.png";
import tier3Image from "@/assets/image/3.png";
import tier4Image from "@/assets/image/4.png";
import tier5Image from "@/assets/image/5.png";
import tier6Image from "@/assets/image/6.png";

const TierImage = ({ tier }: { tier: number }) => {
  const tierImage: Record<number, string> = {
    1: tier1Image,
    2: tier2Image,
    3: tier3Image,
    4: tier4Image,
    5: tier5Image,
    6: tier6Image,
  };

  return <img src={tierImage[tier] ?? tierImage[1]} className="w-5 mt-0.5" />;
};

export default TierImage;
