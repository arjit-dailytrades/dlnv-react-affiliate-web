import { useState } from "react";

type Payment = {
  id: string;
  date: string;
  amount: number;
  status: "success" | "pending" | "failed";
  method: string;
};

const TransactionHistory = () => {
  const [payments] = useState<Payment[]>([
    {
      id: "TXN12345",
      date: "2026-04-01",
      amount: 999,
      status: "success",
      method: "UPI",
    },
    {
      id: "TXN12346",
      date: "2026-03-28",
      amount: 499,
      status: "pending",
      method: "Card",
    },
    {
      id: "TXN12347",
      date: "2026-03-20",
      amount: 1999,
      status: "failed",
      method: "Net Banking",
    },
  ]);

  const getStatusStyle = (status: Payment["status"]) => {
    switch (status) {
      case "success":
        return "bg-green-500/10 text-green-400 border-green-500/20";
      case "pending":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      case "failed":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      default:
        return "";
    }
  };

  return (
    <div className="text-white">
      {/* Table Container */}
      <div className="border border-white/5 rounded-[2rem] p-3 md:p-6 backdrop-blur-xl shadow-2xl">
        
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            
            {/* Table Head */}
            <thead className="bg-black/80 border-b border-zinc-800 text-zinc-400">
              <tr>
                <th className="text-left px-6 py-4">Transaction ID</th>
                <th className="text-left px-6 py-4">Date</th>
                <th className="text-left px-6 py-4">Amount</th>
                <th className="text-left px-6 py-4">Method</th>
                <th className="text-left px-6 py-4">Status</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {payments.map((payment) => (
                <tr
                  key={payment.id}
                  className="border-b border-zinc-800 hover:bg-zinc-900/50 transition"
                >
                  <td className="px-6 py-4 font-medium">
                    {payment.id}
                  </td>

                  <td className="px-6 py-4 text-zinc-400">
                    {payment.date}
                  </td>

                  <td className="px-6 py-4">
                    ₹{payment.amount}
                  </td>

                  <td className="px-6 py-4 text-zinc-400">
                    {payment.method}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs border ${getStatusStyle(
                        payment.status
                      )}`}
                    >
                      {payment.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State (optional) */}
        {payments.length === 0 && (
          <div className="text-center py-10 text-zinc-500">
            No payment history found
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;