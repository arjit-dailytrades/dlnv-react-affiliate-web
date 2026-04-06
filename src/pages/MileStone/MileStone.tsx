import React from "react";
import GoalCard from "../../components/MileStone/GoalCard";

const Milestones = () => {
  const weeklyGoals = [
    { label: "Equity", completed: 2, total: 5 },
    { label: "Option", completed: 1, total: 4 },
    { label: "Future", completed: 0, total: 3 },
  ];

  const monthlyGoals = [
    { label: "Equity", completed: 10, total: 20 },
    { label: "Option", completed: 6, total: 15 },
    { label: "Future", completed: 3, total: 10 },
  ];

  return (
    <div className="text-white">
      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GoalCard title="Weekly Goal" goals={weeklyGoals} />
        <GoalCard title="Monthly Goal" goals={monthlyGoals} />
      </div>
    </div>
  );
};

export default Milestones;
