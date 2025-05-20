// src/pages/AdminDashboard.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminHeader from "../components/AdminHeader";
import NotificationComponent from "../components/Notification";
import DebugPanel from "../components/DebugPanel";
import TabContent from "../components/TabContent";
import type { ActiveTab, Notification } from "../types";
import { handleLogout } from "../utils/auth";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ActiveTab>("hero");
  const [notification, setNotification] = useState<Notification | null>(null);

  // Auto-dismiss notifications after 3 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const showNotification = (
    type: "success" | "error" | null,
    message: string
  ) => {
    setNotification({ type, message });
  };

  const handleTabChange = (tab: ActiveTab) => {
    console.log(`Manually setting tab to: ${tab}`);
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={() => handleLogout(navigate)}
      />

      {notification && (
        <NotificationComponent
          notification={notification}
          onDismiss={() => setNotification(null)}
        />
      )}

      <DebugPanel activeTab={activeTab} handleTabChange={handleTabChange} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <TabContent activeTab={activeTab} showNotification={showNotification} />
      </div>
    </div>
  );
};

export default AdminDashboard;
