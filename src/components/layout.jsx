import React from "react";
import { NavigationSidebar } from "./navigation-sidebar";
import { DataOnboarding } from "./data-onboarding";

export default function Layout() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <NavigationSidebar />
      <main className="flex-1">
        <DataOnboarding />
      </main>
      <div className="w-64 border-l bg-white p-6">
        <h2 className="font-semibold mb-4">Pending Setup</h2>
        <div className="space-y-4">
          <div className="rounded-lg border p-4">
            <h3 className="font-medium">Steel Pipe Grade A</h3>
            <p className="text-sm text-gray-500 mt-1">Missing data</p>
            <button className="mt-2 text-blue-500 hover:underline">
              Resolve Now →
            </button>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="font-medium">Assembly X23</h3>
            <p className="text-sm text-gray-500 mt-1">Required components</p>
            <button className="mt-2 text-blue-500 hover:underline">
              Resolve Now →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
