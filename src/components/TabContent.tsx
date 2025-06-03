// src/components/TabContent.tsx
import React from "react";
import type { ActiveTab } from "../types";
import HeroTab from "./hero/HeroTab";
import Icre8Tab from "./icre8/Icre8Tab";
import NewsTab from "./news/NewsTab";
import MotionTab from "./motion/MotionTab";
import PhotographyTab from "./photography/PhotographyTab";

interface TabContentProps {
  activeTab: ActiveTab;
  showNotification: (type: "success" | "error" | null, message: string) => void;
}

const TabContent: React.FC<TabContentProps> = ({
  activeTab,
  showNotification,
}) => {
  switch (activeTab) {
    case "hero":
      return <HeroTab showNotification={showNotification} />;
    case "photography":
      return <PhotographyTab showNotification={showNotification} />;
    case "icre8":
      return <Icre8Tab showNotification={showNotification} />;
    case "motion":
      return <MotionTab showNotification={showNotification} />;
    case "news":
      return <NewsTab showNotification={showNotification} />;
    default:
      return null;
  }
};

export default TabContent;
