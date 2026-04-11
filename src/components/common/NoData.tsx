import { SearchX } from "lucide-react";

type EmptyStateProps = {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
};

const NoData = ({
  title = "No Data Found",
  description = "We couldn't find anything matching your search.",
  actionText,
  onAction,
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4">
      
      {/* Icon */}
      <div className="w-16 h-16 flex items-center justify-center rounded-2xl 
      bg-zinc-800/60 border border-zinc-700/50 backdrop-blur-md mb-4">
        <SearchX className="text-zinc-400" size={28} />
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-white mb-1">
        {title}
      </h3>

      {/* Description */}
      <p className="text-sm text-zinc-500 max-w-sm mb-4">
        {description}
      </p>

      {/* Optional Action */}
      {actionText && (
        <button
          onClick={onAction}
          className="px-4 py-2 rounded-lg text-sm 
          bg-white/10 hover:bg-white/20 
          border border-white/10 transition"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default NoData;