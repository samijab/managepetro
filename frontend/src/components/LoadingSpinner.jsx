function LoadingSpinner() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
      <div className="flex items-center justify-center space-x-3">
        <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-2 border-blue-600"></div>
        <span className="text-sm sm:text-base text-gray-600">Calculating optimal route...</span>
      </div>
    </div>
  );
}

export default LoadingSpinner;
