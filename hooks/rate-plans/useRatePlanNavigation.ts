import { useState } from "react";
import { toast } from "sonner";

export const useRatePlanNavigation = (
  validateTab: (tab: string) => boolean
) => {
  const [activeTab, setActiveTab] = useState("general");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nextTab = () => {
    if (!validateTab(activeTab)) {
      toast.warning("Please fill in all required fields before proceeding.");
      return;
    }

    switch (activeTab) {
      case "general":
        setActiveTab("duration");
        break;
      case "duration":
        setActiveTab("meals");
        break;
      case "meals":
        setActiveTab("policies");
        break;
      case "policies":
        setActiveTab("review");
        break;
    }
  };

  const prevTab = () => {
    switch (activeTab) {
      case "duration":
        setActiveTab("general");
        break;
      case "meals":
        setActiveTab("duration");
        break;
      case "policies":
        setActiveTab("meals");
        break;
      case "review":
        setActiveTab("policies");
        break;
    }
  };

  const getProgress = (): number => {
    const totalTabs = 5;
    const currentTabIndex =
      ["general", "duration", "meals", "policies", "review"].indexOf(
        activeTab
      ) + 1;
    return (currentTabIndex / totalTabs) * 100;
  };

  return {
    activeTab,
    setActiveTab,
    isSubmitting,
    setIsSubmitting,
    nextTab,
    prevTab,
    getProgress,
  };
};
