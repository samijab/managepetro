import { AuthProvider } from "./contexts/AuthContext";
import AuthGuard from "./components/auth/AuthGuard";
// Import your existing components here
// import YourMainApp from './components/YourMainApp';

function App() {
  return (
    <AuthProvider>
      <AuthGuard>
        {/* Your existing app components go here */}
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Manage Petro Dashboard</h1>
          <p className="text-gray-600 mb-4">
            Welcome to the authenticated Manage Petro application!
          </p>

          {/* Example: Add your existing components here */}
          {/* <YourMainApp /> */}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <h2 className="text-lg font-semibold mb-2">
              🎉 Authentication Active!
            </h2>
            <p className="text-sm text-gray-700">
              The AI optimization features now require authentication. Replace
              this section with your existing app components.
            </p>
          </div>
        </div>
      </AuthGuard>
    </AuthProvider>
  );
}

export default App;
