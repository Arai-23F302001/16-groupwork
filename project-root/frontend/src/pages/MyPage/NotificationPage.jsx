import React from "react";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function NotificationPage({ notifications }) {
  const navigate = useNavigate();

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Bell /> 通知
      </h1>

      {notifications.length === 0 && (
        <p className="text-gray-500 text-center mt-10">通知はありません</p>
      )}

      <div className="space-y-3">
        {notifications.map((item) => (
          <div
            key={item.id}
            className="p-4 bg-white shadow-sm rounded-xl border hover:bg-gray-50 transition cursor-pointer"
            onClick={() => navigate(item.link)}
          >
            <p className="font-semibold text-lg">{item.productName}</p>
            <p className="text-blue-600 mt-1">▶ {item.reaction}</p>
            <p className="text-gray-600 mt-1 text-sm">{item.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
