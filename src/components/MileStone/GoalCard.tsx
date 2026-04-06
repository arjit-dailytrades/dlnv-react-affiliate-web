import GoalRow from "./GoalRow";

type Goal = {
  label: string;
  completed: number;
  total: number;
};
const GoalCard = ({ title, goals }: { title: string; goals: Goal[] }) => {
  const totalCompleted = goals.reduce((a, b) => a + b.completed, 0);
  const total = goals.reduce((a, b) => a + b.total, 0);

  return (
    <div className="border border-white/5 rounded-[2rem] p-3 md:p-6 backdrop-blur-xl shadow-2xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-white tracking-tight">
          {title}
        </h2>

        <span className="text-sm text-zinc-400">
          {totalCompleted} / {total} Completed
        </span>
      </div>

      {/* Goals */}
      <div className="space-y-5">
        {goals.map((goal) => (
          <GoalRow key={goal.label} {...goal} />
        ))}
      </div>
    </div>
  );
};
export default GoalCard;
