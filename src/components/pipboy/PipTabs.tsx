"use client";

import { useMemo, useState } from "react";
import { StatPanel } from "./panels/StatPanel";
import { InvPanel } from "./panels/InvPanel";
import { DataPanel } from "./panels/DataPanel";
import { MapPanel } from "./panels/MapPanel";
import { RadioPanel } from "./panels/RadioPanel";

type TabId = "STAT" | "INV" | "DATA" | "MAP" | "RADIO";

const tabs: TabId[] = ["STAT", "INV", "DATA", "MAP", "RADIO"];

export function PipTabs() {
  const [activeTab, setActiveTab] = useState<TabId>("STAT");

  const panel = useMemo(() => {
    switch (activeTab) {
      case "STAT":
        return <StatPanel />;
      case "INV":
        return <InvPanel />;
      case "DATA":
        return <DataPanel />;
      case "MAP":
        return <MapPanel />;
      case "RADIO":
        return <RadioPanel />;
      default:
        return null;
    }
  }, [activeTab]);

  return (
    <div className="pipScreen crtOverlay">
      <nav className="tabBar" aria-label="Pip-Boy sections">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`tabBtn ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </nav>
      <div className="panelWrap">{panel}</div>
    </div>
  );
}
