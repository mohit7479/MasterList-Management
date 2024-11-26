"use client";

import React from "react";

const Progress = ({ value, className = "" }) => {
  return (
    <div
      className={`relative h-2 w-full overflow-hidden rounded-full bg-gray-200 ${className}`}
    >
      <div
        className="h-full bg-blue-500 transition-all"
        style={{ width: `${value || 0}%` }}
      ></div>
    </div>
  );
};

export default Progress;
