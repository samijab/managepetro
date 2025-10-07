import {
  ArrowUpIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";

/**
 * Dynamic direction icon component that shows appropriate arrow based on direction type
 * @param {Object} props
 * @param {string} props.directionType - Type of direction (turn_left, turn_right, straight, etc.)
 * @param {string} props.className - Additional CSS classes
 */
function DirectionIcon({ directionType, className = "w-5 h-5 text-gray-400" }) {
  const getDirectionIcon = () => {
    switch (directionType?.toLowerCase()) {
      case "straight":
      case "continue":
      case "head":
      case "north":
      case "forward":
        return <ArrowUpIcon className={className} />;

      case "turn_left":
      case "left":
      case "sharp_left":
      case "uturn_left":
      case "exit_left":
      case "merge_left":
      case "west":
      case "northwest":
      case "southwest":
        return <ArrowLeftIcon className={className} />;

      case "turn_right":
      case "right":
      case "sharp_right":
      case "uturn_right":
      case "exit_right":
      case "merge_right":
      case "merge":
      case "roundabout":
      case "east":
      case "northeast":
      case "southeast":
        return <ArrowRightIcon className={className} />;

      case "destination":
      case "arrive":
        return (
          <MapPinIcon
            className={`${className.replace(
              "text-gray-400",
              "text-green-600"
            )}`}
          />
        );

      default:
        return <ArrowUpIcon className={className} />;
    }
  };

  return <div className="flex-shrink-0 mt-1">{getDirectionIcon()}</div>;
}

export default DirectionIcon;
