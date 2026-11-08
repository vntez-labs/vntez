"use client";

import React, { useState } from "react";
import { useAppWorkspaceStore } from "../../app-workspace-store";
import { AppInfoAccordion } from "./overview/app-info-accordion";
import { AppOAuthAccordion } from "./overview/app-oauth-accordion";
import { AppEndpointsAccordion } from "./overview/app-endpoints-accordion";

export function OverviewOAuthTab() {
  const {
    app,
    updateApp,
    copiedField,
    copyToClipboard,
    rotateSecret,
    isRotatingSecret,
  } = useAppWorkspaceStore();

  const [isEndpointsOpen, setIsEndpointsOpen] = useState(false);

  if (!app) return null;

  return (
    <div className="space-y-6 min-w-0">
      {/* 2-Column Equal Height Container with dividing border */}
      <div className="rounded-2xl bg-card border border-border shadow-xs overflow-visible">
        <div className="grid grid-cols-1 xl:grid-cols-2 divide-y xl:divide-y-0 xl:divide-x divide-border items-stretch">
          <AppInfoAccordion
            app={app}
            onUpdate={updateApp}
          />

          <AppOAuthAccordion
            app={app}
            onUpdate={updateApp}
            onRotateSecret={rotateSecret}
            isRotatingSecret={isRotatingSecret}
            copiedField={copiedField}
            onCopy={copyToClipboard}
          />
        </div>
      </div>

      <AppEndpointsAccordion
        app={app}
        isOpen={isEndpointsOpen}
        onToggle={() => setIsEndpointsOpen((prev) => !prev)}
        onUpdate={updateApp}
      />
    </div>
  );
}
