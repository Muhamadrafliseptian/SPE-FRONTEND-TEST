import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import IndexOrder from "./pages/IndexOrder";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<IndexOrder />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
