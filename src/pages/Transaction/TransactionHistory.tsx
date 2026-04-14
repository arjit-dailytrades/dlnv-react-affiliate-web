import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../app/store";
import { getTransactionHistory } from "../../features/transactionSlice";
import Loader from "../../components/common/Loader";
import Pagination from "../../components/common/Pagination";
import moment from "moment";
import { Search, X } from "lucide-react";
import NoData from "../../components/common/NoData";
import { getProfile } from "../../features/profileSlice";

type Payment = {
  id: string;
  paidAt: string;
  amount: number;
  status: "PAID" | "FAILED" | "PENDING";
  paymentMethod: string;
};

const TransactionHistory = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { transactionHistory, loading, totalItem, totalPages } = useSelector(
    (state: RootState) => state.transaction,
  );

  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    dispatch(getProfile());
  }, []);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchText);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchText]);

  useEffect(() => {
    dispatch(getTransactionHistory({ page, searchText: debouncedSearch }));
  }, [dispatch, page, debouncedSearch]);

  const getStatusStyle = (status: Payment["status"]) => {
    switch (status) {
      case "PAID":
        return "bg-green-500/10 text-green-400 border-green-500/20";
      case "PENDING":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      case "FAILED":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      default:
        return "";
    }
  };

  const methodMap: Record<string, string> = {
    CREDIT_CARD: "Credit Card",
    UPI: "UPI",
    BANK_TRANSFER: "Bank Transfer",
  };

  return (
    <div className="text-white">
      <div className=" backdrop-blur-xl shadow-2xl min-h-[500px]">
        {/* Search Bar */}
        {/* <div className="mb-6 flex justify-between items-center">
          <div className="relative w-full md:w-96 group">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-white transition"
            />

            <input
              type="text"
              placeholder="Search transactions..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full pl-11 pr-10 py-2.5 rounded-xl 
      bg-zinc-900/70 backdrop-blur-md 
      border border-zinc-700/50 
      text-sm text-white placeholder:text-zinc-500
      focus:outline-none focus:ring-2 focus:ring-white/10 
      focus:border-zinc-500 transition-all duration-200"
            />

            {searchText && (
              <button
                onClick={() => setSearchText("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div> */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-black/80 border-b border-zinc-800 text-zinc-400">
              <tr>
                <th className="text-left px-6 py-4">Method</th>
                <th className="text-left px-6 py-4">Date</th>
                <th className="text-left px-6 py-4">Amount</th>
                <th className="text-left px-6 py-4">Status</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4}>
                    <div className="min-h-[400px] flex items-center justify-center">
                      <Loader size="md" />
                    </div>
                  </td>
                </tr>
              ) : transactionHistory?.length === 0 ? (
                <tr>
                  <td colSpan={4}>
                    <div className="min-h-[400px] flex items-center justify-center">
                      <NoData title="No transaction found" />
                    </div>
                  </td>
                </tr>
              ) : (
                transactionHistory.map((payment: Payment) => (
                  <tr
                    key={payment.id}
                    className="border-b border-zinc-800 hover:bg-zinc-900/50 transition"
                  >
                    <td className="px-6 py-4 text-zinc-400">
                      {methodMap[payment.paymentMethod] ||
                        payment.paymentMethod}
                    </td>

                    <td className="px-6 py-4 text-zinc-400">
                      {moment(payment.paidAt).format("DD MMM YYYY, hh:mm A")}
                    </td>

                    <td className="px-6 py-4">₹{payment.amount}</td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs border ${getStatusStyle(
                          payment.status,
                        )}`}
                      >
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {!loading && totalItem > 10 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;
