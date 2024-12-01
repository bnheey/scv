import { BrowserRouter as Router } from "react-router-dom";
import "./App.css";
import AppRouter from "./components/AppRouter";

const App = () => {
  return (
    <div className="flex items-center justify-center">
      <Router>
        <div className="w-[500px] h-screen bg-white flex flex-col gap-4 pt-6 px-4 overflow-hidden relative">
          <AppRouter />
        </div>
      </Router>
    </div>
  );
};

export default App;
