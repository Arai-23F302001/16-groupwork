import React from "react";

export function Badge({ className = "", children }) {
  return (
    <span className={`inline-flex items-center rounded-xl px-2 py-1 text-xs font-medium ring-1 ${className}`}>
      {children}
    </span>
  );
}

export function SectionCard({ title, action, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 p-5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">{title}</h2>
        {action}
      </div>
      <div>{children}</div>
    </div>
  );
}
