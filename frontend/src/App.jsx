import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import RoutePage from "./pages/RoutePage";
import StationsPage from "./pages/StationsPage";
import DemoRoutePage from "./pages/DemoRoutePage";
import DispatcherPage from "./pages/DispatcherPage";

function App() {
  const [selectedLLM, setSelectedLLM] = useState("gemini-2.5-flash");

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header selectedLLM={selectedLLM} onLLMChange={setSelectedLLM} />

        <Routes>
          <Route path="/" element={<RoutePage selectedLLM={selectedLLM} />} />
          <Route path="/stations" element={<StationsPage />} />
          <Route path="/dispatcher" element={<DispatcherPage />} />
          <Route path="/demo" element={<DemoRoutePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
