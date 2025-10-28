/**
 * Reusable PageLayout component for consistent page structure
 * Provides standard spacing, max-width, and responsive layout
 */

function PageLayout({ children, className = "", maxWidth = "7xl", ...props }) {
  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
    "5xl": "max-w-5xl",
    "6xl": "max-w-6xl",
    "7xl": "max-w-7xl",
    full: "max-w-full",
  };

  const baseClasses = "mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8";
  const widthClass = maxWidthClasses[maxWidth] || maxWidthClasses["7xl"];
  const classes = `${baseClasses} ${widthClass} ${className}`.trim();

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}

export default PageLayout;
