import React from "react";

type LoaderProps = {
  size?: "sm" | "md" | "lg";
  fullScreen?: boolean;
};

const sizeMap = {
  sm: "h-5 w-5 border-2",
  md: "h-8 w-8 border-3",
  lg: "h-12 w-12 border-4",
};

const Loader: React.FC<LoaderProps> = ({
  size = "md",
  fullScreen = false,
}) => {
  const spinner = (
    <div
      className={`animate-spin rounded-full border-t-transparent border-white ${sizeMap[size]}`}
    />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        {spinner}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center">
      {spinner}
    </div>
  );
};

export default Loader;