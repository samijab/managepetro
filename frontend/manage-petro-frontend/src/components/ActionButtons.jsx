import { CogIcon, DocumentTextIcon } from "@heroicons/react/24/outline";

function ActionButtons({ onEditParameters, onViewReferences }) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <button
        onClick={onEditParameters}
        className="flex items-center justify-center space-x-2 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors"
      >
        <CogIcon className="w-5 h-5" />
        <span>Edit Parameters</span>
      </button>

      <button
        onClick={onViewReferences}
        className="flex items-center justify-center space-x-2 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors"
      >
        <DocumentTextIcon className="w-5 h-5" />
        <span>View References</span>
      </button>
    </div>
  );
}

export default ActionButtons;
