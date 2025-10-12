import { Link, useLocation } from "react-router-dom";

/**
 * Reusable navigation link component with active state styling
 * @param {Object} props
 * @param {string} props.to - Route path
 * @param {string} props.children - Link text
 * @param {Function} props.onClick - Optional click handler
 * @param {boolean} props.mobile - Whether this is a mobile nav link
 */
function NavLink({ to, children, onClick, mobile = false }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  if (mobile) {
    return (
      <Link
        to={to}
        onClick={onClick}
        className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
          isActive
            ? "text-blue-600 bg-blue-50"
            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
        }`}
      >
        {children}
      </Link>
    );
  }

  return (
    <Link
      to={to}
      className={`text-lg font-medium transition-colors ${
        isActive ? "text-blue-600" : "text-gray-600 hover:text-gray-900"
      }`}
    >
      {children}
    </Link>
  );
}

export default NavLink;
