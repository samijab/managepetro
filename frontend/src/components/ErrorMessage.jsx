import { XMarkIcon } from "@heroicons/react/24/outline";

function ErrorMessage({ message, onDismiss }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-3 sm:p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-red-600 font-bold text-xs sm:text-sm">!</span>
          </div>
          <div className="min-w-0">
            <h3 className="text-xs sm:text-sm font-medium text-red-800">
              Route Calculation Failed
            </h3>
            <p className="text-xs sm:text-sm text-red-700 mt-1">{message}</p>
          </div>
        </div>

        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-red-400 hover:text-red-600 transition-colors flex-shrink-0"
          >
            <XMarkIcon className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        )}
      </div>
    </div>
  );
}

export default ErrorMessage;
