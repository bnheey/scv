import { Spinner } from "@phosphor-icons/react";
import { useState } from "react";

const useLoading = () => {
  const [isLoading, setIsLoading] = useState(false);
  const Loading = () =>
    isLoading ? (
      <div className="flex items-center justify-center w-full min-h-20">
        <Spinner size={24} />
      </div>
    ) : null;

  return { isLoading, setIsLoading, Loading };
};

export default useLoading;
