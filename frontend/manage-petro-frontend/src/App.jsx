import { useState } from "react";
import Header from "./components/Header";
import RouteForm from "./components/RouteForm";
import ActionButtons from "./components/ActionButtons";
import ETADisplay from "./components/ETADisplay";
import InstructionsList from "./components/InstructionsList";
import LoadingSpinner from "./components/LoadingSpinner";
import ErrorMessage from "./components/ErrorMessage";
import { useRouteData } from "./hooks/useRouteData";

function App() {
  const [selectedLLM, setSelectedLLM] = useState("gpt-4");
  const { routeData, calculateRoute, clearRoute, isLoading, error } =
    useRouteData();

  const handleRouteSubmit = async (from, to) => {
    await calculateRoute(from, to, selectedLLM);
  };

  const handleEditParameters = () => {
    console.log("Edit parameters clicked");
    // TODO: Open parameters modal
  };

  const handleViewReferences = () => {
    console.log("View references clicked");
    // TODO: Open references modal
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header selectedLLM={selectedLLM} onLLMChange={setSelectedLLM} />

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="space-y-8">
          <RouteForm onSubmit={handleRouteSubmit} isLoading={isLoading} />

          <ActionButtons
            onEditParameters={handleEditParameters}
            onViewReferences={handleViewReferences}
          />

          {error && <ErrorMessage message={error} onDismiss={clearRoute} />}

          {isLoading && <LoadingSpinner />}

          {routeData.eta && !isLoading && (
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
