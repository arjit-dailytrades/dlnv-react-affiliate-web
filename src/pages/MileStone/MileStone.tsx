import React, { useEffect } from "react";
import { apiClient } from "../../api/apiClient";
import { showError } from "../../components/common/ToastService";
import MilestoneJourney from "../../components/MileStone/MileStoneJourney";
import Loader from "../../components/common/Loader";

const Milestones = () => {
  const [milestones, setMilestones] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const fetchMilestones = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient({
        method: "get",
        url: "/affiliate/milestone",
      });
      console.log(response,"========response");
      
      setMilestones(response);

      setIsLoading(false);
    } catch (error: any) {
      showError(error.response?.data?.message || "Failed to fetch milestones");
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchMilestones();
  }, []);

  console.log("milestones:", milestones);

  return (
    <div className="text-white">
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader size="md" />
        </div>
      ) : (
        <MilestoneJourney data={milestones} />
      )}
      {/* <MileStone /> */}
    </div>
  );
};

export default Milestones;
