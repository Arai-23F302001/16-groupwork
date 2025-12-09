import React from "react";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function NotificationPage({ notifications = [] }) {
  const navigate = useNavigate();

  return (
    <div className="max-w-lg mx-auto">
      {/* --- 通知タブ（上部固定風） --- */}
      <div className="bg-white shadow p-4 sticky top-0 z-10 flex items-center gap-2 border-b">
        <Bell className="text-indigo-600" />
        <h1 className="text-xl font-bold">通知</h1>
      </div>

      {/* --- 通知がない場合 --- */}
      {notifications.length === 0 && (
        <p className="text-gray-500 text-center mt-10">通知はありません</p>
      )}

      {/* --- 通知一覧 --- */}
      <div className="p-4 space-y-4">
        {notifications.map((item) => (
          <div
            key={item.id}
            className="p-4 bg-white shadow rounded-xl border hover:bg-gray-50 transition cursor-pointer"
            onClick={() => navigate(item.link)}
          >
            <p className="font-semibold text-lg">{item.productName}</p>
            <p className="text-indigo-600 mt-1">▶ {item.reaction}</p>
            <p className="text-gray-600 mt-1 text-sm">{item.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
