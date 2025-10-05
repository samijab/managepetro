import { useState } from "react";
import Header from "./components/Header";
import RouteForm from "./components/RouteForm";
import ActionButtons from "./components/ActionButtons";
import ETADisplay from "./components/ETADisplay";
import InstructionsList from "./components/InstructionsList";

function App() {
  const [selectedLLM, setSelectedLLM] = useState("gpt-4");
  const [routeData, setRouteData] = useState({
    from: "",
    to: "",
    eta: null,
    instructions: [],
  });

  const handleRouteSubmit = (from, to) => {
    // Simulate route calculation
    setRouteData({
      from,
      to,
      eta: {
        arrival: "2:45 PM",
        duration: "1h 23m",
        distance: "67.2 km",
      },
      instructions: [
        {
          id: 1,
          text: "Head north on Main Street toward Highway 1",
          distance: "0.5 km",
        },
        { id: 2, text: "Turn right onto Highway 1 East", distance: "15.2 km" },
        {
          id: 3,
          text: "Take exit 42 for Industrial Boulevard",
          distance: "0.8 km",
        },
        {
          id: 4,
          text: "Turn left onto Industrial Boulevard",
          distance: "2.1 km",
        },
        {
          id: 5,
          text: "Destination will be on your right",
          distance: "0.3 km",
        },
      ],
    });
  };

  const handleEditParameters = () => {
    console.log("Edit parameters clicked");
  };

  const handleViewReferences = () => {
    console.log("View references clicked");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header selectedLLM={selectedLLM} onLLMChange={setSelectedLLM} />

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="space-y-8">
          <RouteForm onSubmit={handleRouteSubmit} />

          <ActionButtons
            onEditParameters={handleEditParameters}
            onViewReferences={handleViewReferences}
          />

          {routeData.eta && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <ETADisplay eta={routeData.eta} />
              </div>

              <div className="lg:col-span-2">
                <InstructionsList instructions={routeData.instructions} />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
