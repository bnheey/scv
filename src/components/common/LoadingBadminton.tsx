import Lottie from "lottie-react";
import loadingBadminton from "../../assets/lottie/loading_badminton.json";

const LoadingBadminton = () => (
  <div className="w-full h-[60vh] flex items-center justify-center">
    <div className="max-w-[36%] max-h-[50%]">
      <Lottie animationData={loadingBadminton} size={30} />
    </div>
  </div>
);

export default LoadingBadminton;
