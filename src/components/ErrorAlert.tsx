// src/components/ErrorAlert.tsx
import React from "react";

interface ErrorAlertProps {
  error: string | null;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ error }) => {
  if (!error) return null;

  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
      <span>{error}</span>
    </div>
  );
};

export default ErrorAlert;
