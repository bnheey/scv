import { useState } from "react";
import LoadingDot from "../components/common/LoadingDot";

const useLoading = () => {
  const [isLoading, setIsLoading] = useState(false);
  const Loading = () =>
    isLoading ? (
      <div className="flex items-center justify-center w-full min-h-20">
        <LoadingDot containerClassName="h-full" />
      </div>
    ) : null;

  return { isLoading, setIsLoading, Loading };
};

export default useLoading;
