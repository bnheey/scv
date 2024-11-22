import { BrowserRouter as Router } from "react-router-dom";
import "./App.css";
import AppRouter from "./components/AppRouter";
import Navigation from "./components/Navigation";

const App = () => {
  return (
    <div className="flex items-center justify-center">
      <Router>
        <div className="w-[500px] h-screen bg-white flex flex-col justify-between pt-[30px] overflow-hidden">
          <AppRouter />
          <Navigation />
        </div>
      </Router>
    </div>
  );
};

export default App;
