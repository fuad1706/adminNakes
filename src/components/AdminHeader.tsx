import React, { useState, useCallback } from "react";

// Update the ActiveTab type to include your tabs
export type ActiveTab = "hero" | "photography" | "icre8" | "motion" | "news";

interface AdminHeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onLogout: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({
  activeTab,
  setActiveTab,
  onLogout,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const tabs: ActiveTab[] = ["hero", "photography", "icre8", "motion", "news"];

  // Use useCallback to prevent unnecessary re-renders
  const handleTabChange = useCallback(
    (tab: ActiveTab) => {
      console.log(`Switching to tab: ${tab}`);
      setActiveTab(tab);
      setIsMenuOpen(false);
    },
    [setActiveTab]
  );

  return (
    <header className="shadow-md">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <img
              src="/images/logo.png"
              alt="Nakestudios Logo"
              className="h-8 w-auto"
            />
          </div>
          <div className="flex items-center space-x-4">
            <nav
              className={`${
                isMenuOpen ? "block" : "hidden"
              } sm:flex flex-col sm:flex-row sm:items-center sm:justify-center sm:flex-1`}
            >
              <div className="flex flex-col sm:flex-row sm:space-x-2">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    className={`px-3 py-2 my-1 sm:my-0 font-bold text-lg cursor-pointer rounded-md transition-colors ${
                      activeTab === tab
                        ? "bg-yellow-100 text-gray-900"
                        : "text-gray-900 hover:text-yellow-500"
                    }`}
                    onClick={() => handleTabChange(tab)}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </nav>
            <button
              onClick={onLogout}
              className="hidden sm:block px-3 py-2 text-sm font-medium rounded bg-amber-400 text-gray-900 hover:text-white cursor-pointer transition-colors"
            >
              Logout
            </button>
            <button
              className="sm:hidden text-gray-900 focus:outline-none"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={
                    isMenuOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>
        </div>
        <div
          className={`${
            isMenuOpen ? "block" : "hidden"
          } sm:hidden flex justify-center w-full mt-4`}
        >
          <button
            onClick={onLogout}
            className="px-4 py-2 text-sm font-medium text-gray-900 hover:text-white transition-colors border border-gray-900 rounded-md"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
