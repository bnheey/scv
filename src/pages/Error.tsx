import Lottie from "lottie-react";
import noData from "@/assets/lottie/no_data.json";
import Text from "@/components/common/Text";

type ErrorProps = {
  code?: number;
};

const Error = ({ code = 404 }: ErrorProps) => {
  return (
    <div className="flex items-center justify-center w-full h-4/5">
      <div className="max-w-[70%]">
        <Lottie animationData={noData} />
        <Text type="normalGray">
          {code === 404
            ? "페이지를 찾을 수 없습니다."
            : "서버 오류가 발생했습니다."}
        </Text>
      </div>
    </div>
  );
};

export default Error;
