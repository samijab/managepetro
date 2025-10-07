import { XMarkIcon } from "@heroicons/react/24/outline";

function ErrorMessage({ message, onDismiss }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
            <span className="text-red-600 font-bold text-sm">!</span>
          </div>
          <div>
            <h3 className="text-sm font-medium text-red-800">
              Route Calculation Failed
            </h3>
            <p className="text-sm text-red-700 mt-1">{message}</p>
          </div>
        </div>

        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-red-400 hover:text-red-600 transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}

export default ErrorMessage;
