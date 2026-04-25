import { ArrowLeft, ArrowRight} from "lucide-react";
import React from "react";

type Props = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const Pagination: React.FC<Props> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const getPages = () => {
    const pages: (number | string)[] = [];
    const delta = 2;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "...") {
        pages.push("...");
      }
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-between text-gray-300 px-6 py-4 rounded-lg">
      {/* Previous */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-2 cursor-pointer disabled:opacity-40"
      >
        <ArrowLeft size={16} className="mt-[2px]"/> Previous
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-4">
        {getPages().map((page, index) =>
          page === "..." ? (
            <span key={index} className="text-gray-500">
              ...
            </span>
          ) : (
            <button
              key={index}
              onClick={() => onPageChange(Number(page))}
              className={`cursor-pointer ${
                currentPage === page
                  ? "text-white font-semibold bg-black px-3 py-1 rounded"
                  : "hover:text-white"
              }`}
            >
              {page}
            </button>
          ),
        )}
      </div>

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-2 cursor-pointer disabled:opacity-40"
      >
        Next <ArrowRight size={16} className="mt-[2px]"/>
      </button>
    </div>
  );
};

export default Pagination;
