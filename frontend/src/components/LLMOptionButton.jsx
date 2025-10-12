/**
 * LLM option button component for desktop and mobile
 * @param {Object} props
 * @param {Object} props.option - LLM option object with value and label
 * @param {boolean} props.isSelected - Whether this option is currently selected
 * @param {Function} props.onClick - Click handler
 * @param {boolean} props.mobile - Whether this is for mobile view
 */
function LLMOptionButton({ option, isSelected, onClick, mobile = false }) {
  if (mobile) {
    return (
      <button
        onClick={onClick}
        className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
          isSelected
            ? "bg-blue-50 text-blue-600 font-medium"
            : "text-gray-700 hover:bg-gray-50"
        }`}
      >
        {option.label}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
        isSelected
          ? "bg-blue-50 text-blue-600 font-medium"
          : "text-gray-700"
      }`}
    >
      {option.label}
    </button>
  );
}

export default LLMOptionButton;
