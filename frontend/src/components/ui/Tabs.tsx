"use client";

import { ReactNode, useState } from "react";

interface Tab {
  id: string;
  label: string;
  content: ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  className?: string;
}

export default function Tabs({
  tabs,
  defaultTab,
  onChange,
  className = "",
}: TabsProps) {
  const firstAvailableTab =
    tabs.find((tab) => !tab.disabled)?.id ?? "";

  const [activeTab, setActiveTab] = useState(
    defaultTab ?? firstAvailableTab
  );

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  const activeContent = tabs.find(
    (tab) => tab.id === activeTab
  )?.content;

  return (
    <div className={`w-full ${className}`}>
      <div
        role="tablist"
        className="flex overflow-x-auto border-b border-slate-200"
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`tab-panel-${tab.id}`}
              disabled={tab.disabled}
              onClick={() => handleTabChange(tab.id)}
              className={`relative shrink-0 px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? "text-slate-900"
                  : "text-slate-500 hover:text-slate-800"
              } disabled:cursor-not-allowed disabled:opacity-50`}
            >
              {tab.label}

              {isActive && (
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-slate-900" />
              )}
            </button>
          );
        })}
      </div>

      <div
        id={`tab-panel-${activeTab}`}
        role="tabpanel"
        className="pt-6"
      >
        {activeContent}
      </div>
    </div>
  );
}

export type { Tab };
