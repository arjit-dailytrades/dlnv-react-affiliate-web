type Goal = {
  label: string;
  completed: number;
  total: number;
};
const GoalRow = ({ label, completed, total }: Goal) => {
  const percent = total === 0 ? 0 : (completed / total) * 100;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm text-zinc-400">
        <span>{label}</span>
        <span>
          {completed} / {total}
        </span>
      </div>

      <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
        <div
          style={{ width: `${percent}%` }}
          className="h-full bg-gradient-to-r from-white via-zinc-300 to-white rounded-full transition-all duration-700 shadow-[0_0_10px_rgba(255,255,255,0.3)]"
        />
      </div>
    </div>
  );
};

export default GoalRow;
