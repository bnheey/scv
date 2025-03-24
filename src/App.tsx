import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "./App.css";
import AppRouter from "./components/AppRouter";
import Modal from "./components/common/Modal";
import { useModal } from "./middleware/stores/modal";
import Text from "./components/common/Text";

const App = () => {
  const { isOpen } = useModal();

  return (
    <>
      <div className="h-5 w-full max-w-[500px] overflow-hidden bg-red-600 mx-auto">
        <Text className="animate-marquee text-nowrap !text-white">
          책 없는 방은 마음 없는 육체와 같다. (기케로전)&nbsp;&nbsp;&nbsp;&nbsp;
          단 한 권의 책 밖에 읽은 적이 없는 인간을 경계하라.
          (디즈레일리)&nbsp;&nbsp;&nbsp;&nbsp; 모름지기 남자는 다섯 수레의 책을
          읽어야 한다. (두보)&nbsp;&nbsp;&nbsp;&nbsp; 좋은 책을 읽는다는 것은
          과거의 가장 훌륭한 사람들과 대화하는 것이다.
          (데카르트)&nbsp;&nbsp;&nbsp;&nbsp;
        </Text>
      </div>
      <div className="flex items-center justify-center app">
        <Router>
          <div className="w-[500px] h-screen bg-white flex flex-col gap-4 pt-6 px-4 overflow-hidden relative">
            <AppRouter />
          </div>
        </Router>
        <ToastContainer />
        {isOpen ? <Modal /> : null}
      </div>
    </>
  );
};

export default App;
