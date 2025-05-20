// src/components/DebugPanel.tsx
import React from "react";
import type { ActiveTab } from "../types";

interface DebugPanelProps {
  activeTab: ActiveTab;
  handleTabChange: (tab: ActiveTab) => void;
}

const DebugPanel: React.FC<DebugPanelProps> = ({
  activeTab,
  handleTabChange,
}) => {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4">
      <div className="bg-white shadow-sm p-4 mb-4 rounded-md">
        <p className="font-medium">Debug Panel - Current Tab: {activeTab}</p>
        <div className="flex space-x-2 mt-2">
          {["hero", "photography", "icre8", "motion", "news"].map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab as ActiveTab)}
              className="px-2 py-1 text-xs bg-gray-200 rounded"
            >
              Set {tab}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DebugPanel;
