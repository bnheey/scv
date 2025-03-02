import { BrowserRouter as Router } from "react-router-dom";
import "./App.css";
import AppRouter from "./components/AppRouter";
import Modal from "./components/common/Modal";
import { useModal } from "./middleware/stores/modal";

const App = () => {
  const { isOpen } = useModal();

  return (
    <div className="flex items-center justify-center app">
      <Router>
        <div className="w-[500px] h-screen bg-white flex flex-col gap-4 pt-6 px-4 overflow-hidden relative">
          <AppRouter />
        </div>
      </Router>
      {isOpen ? <Modal /> : null}
    </div>
  );
};

export default App;
