/**
 * Reusable stat card component for displaying statistics
 * @param {Object} props
 * @param {string} props.icon - Icon to display (emoji or text)
 * @param {string} props.iconBgColor - Background color class for icon (e.g., 'bg-blue-100')
 * @param {string} props.iconTextColor - Text color class for icon (e.g., 'text-blue-600')
 * @param {string} props.label - Label text for the stat
 * @param {string|number} props.value - The stat value to display
 */
function StatCard({ icon, iconBgColor, iconTextColor, label, value }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 ${iconBgColor} rounded-lg flex items-center justify-center`}>
            <span className={`${iconTextColor} font-bold text-lg`}>{icon}</span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">{label}</p>
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatCard;
