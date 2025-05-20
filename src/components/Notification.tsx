// src/components/Notification.tsx
import type { Notification } from "../types";

interface NotificationProps {
  notification: Notification;
  onDismiss: () => void;
}

const NotificationComponent: React.FC<NotificationProps> = ({
  notification,
  onDismiss,
}) => {
  if (!notification) return null;

  return (
    <div
      className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-md shadow-md transition-opacity duration-300 flex items-center ${
        notification.type === "success"
          ? "bg-green-500 text-white"
          : "bg-red-500 text-white"
      }`}
    >
      <span className="mr-2">
        {notification.type === "success" ? "✓" : "✗"}
      </span>
      <span>{notification.message}</span>
      <button
        onClick={onDismiss}
        className="ml-4 text-white hover:text-gray-200"
        aria-label="Close notification"
      >
        ✕
      </button>
    </div>
  );
};

export default NotificationComponent;
