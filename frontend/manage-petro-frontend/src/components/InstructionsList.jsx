import DirectionIcon from "./DirectionIcon";

function InstructionsList({ instructions }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Step-by-Step Directions
      </h3>

      <div className="space-y-3">
        {instructions.map((instruction, index) => (
          <div
            key={instruction.id}
            className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {/* Step Number */}
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                {index + 1}
              </div>
            </div>

            {/* Dynamic Direction Icon */}
            <DirectionIcon
              directionType={instruction.direction_type}
              className="w-5 h-5 text-blue-500"
            />

            {/* Instruction Content */}
            <div className="flex-1 min-w-0">
              <p className="text-gray-900 font-medium">{instruction.text}</p>
              <div className="flex items-center justify-between mt-1">
                <p className="text-sm text-gray-500">{instruction.distance}</p>
                {instruction.compass_direction && (
                  <span className="text-xs text-gray-400 uppercase tracking-wide">
                    {instruction.compass_direction}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {instructions.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No route instructions available</p>
          <p className="text-sm text-gray-400 mt-1">
            Enter a route to see step-by-step directions
          </p>
        </div>
      )}
    </div>
  );
}

export default InstructionsList;
