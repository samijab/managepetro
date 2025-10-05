import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import RoutePage from "./pages/RoutePage";
import StationsPage from "./pages/StationsPage";

function App() {
  const [selectedLLM, setSelectedLLM] = useState("gpt-4");

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header selectedLLM={selectedLLM} onLLMChange={setSelectedLLM} />

        <Routes>
          <Route path="/" element={<RoutePage selectedLLM={selectedLLM} />} />
          <Route path="/stations" element={<StationsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
