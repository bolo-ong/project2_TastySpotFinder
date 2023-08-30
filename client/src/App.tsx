import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import "./index.css";
import Main from "./pages/Main";
import RecommendationBoard from "./pages/RecommendationBoard";

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/recommendationboard" element={<RecommendationBoard />} />
      <Route path="*" element={<div>404</div>} />
    </Routes>
  </Router>
);

export default App;
