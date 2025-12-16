import React, { useState, useEffect } from "react";
import {
  Bell,
  Heart,
  MessageCircle,
  UserPlus,
  Award,
  Check,
  Trash2,
  Filter,
} from "lucide-react";

export default function NotificationPage({ user }) {
  // 通知データ（実際はAPIから取得）
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "like",
      read: false,
      userName: "田中太郎",
      userAvatar: "https://i.pravatar.cc/150?img=12",
      postTitle: "経済学の教科書譲ります",
      postImage:
        "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=100&h=100&fit=crop",
      message: "があなたの投稿にいいねしました",
      timestamp: "5分前",
      date: "2025-12-09 14:25",
    },
    {
      id: 2,
      type: "comment",
      read: false,
      userName: "佐藤花子",
      userAvatar: "https://i.pravatar.cc/150?img=45",
      postTitle: "プログラミング参考書",
      postImage:
        "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=100&h=100&fit=crop",
      message: "があなたの投稿にコメントしました",
      comment: "まだ在庫ありますか？購入したいです！",
      timestamp: "20分前",
      date: "2025-12-09 14:10",
    },
    {
      id: 3,
      type: "like",
      read: false,
      userName: "山田次郎",
      userAvatar: "https://i.pravatar.cc/150?img=33",
      postTitle: "英語の参考書",
      postImage:
        "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=100&h=100&fit=crop",
      message: "があなたの投稿にいいねしました",
      timestamp: "1時間前",
      date: "2025-12-09 13:30",
    },
    {
      id: 4,
      type: "comment",
      read: true,
      userName: "鈴木一郎",
      userAvatar: "https://i.pravatar.cc/150?img=8",
      postTitle: "数学の教科書",
      postImage:
        "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=100&h=100&fit=crop",
      message: "があなたの投稿にコメントしました",
      comment: "ありがとうございました！",
      timestamp: "3時間前",
      date: "2025-12-09 11:30",
    },
    {
      id: 5,
      type: "follow",
      read: true,
      userName: "高橋美咲",
      userAvatar: "https://i.pravatar.cc/150?img=20",
      message: "があなたをフォローしました",
      timestamp: "5時間前",
      date: "2025-12-09 09:30",
    },
    {
      id: 6,
      type: "like",
      read: true,
      userName: "伊藤健太",
      userAvatar: "https://i.pravatar.cc/150?img=15",
      postTitle: "物理学の参考書",
      postImage:
        "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=100&h=100&fit=crop",
      message: "があなたの投稿にいいねしました",
      timestamp: "昨日",
      date: "2025-12-08 18:20",
    },
    {
      id: 7,
      type: "award",
      read: true,
      message: "ポイント獲得！ミニゲームクリアで100ポイント獲得しました",
      timestamp: "昨日",
      date: "2025-12-08 16:45",
    },
    {
      id: 8,
      type: "comment",
      read: true,
      userName: "渡辺桜",
      userAvatar: "https://i.pravatar.cc/150?img=25",
      postTitle: "化学の教科書",
      postImage:
        "https://images.unsplash.com/photo-1532153975070-2e9ab71f1b14?w=100&h=100&fit=crop",
      message: "があなたの投稿にコメントしました",
      comment: "状態はどうですか？",
      timestamp: "2日前",
      date: "2025-12-07 14:15",
    },
  ]);

  const [filter, setFilter] = useState("all"); // all, unread, like, comment

  // フィルタリングされた通知
  const filteredNotifications = notifications.filter((notif) => {
    if (filter === "all") return true;
    if (filter === "unread") return !notif.read;
    return notif.type === filter;
  });

  // 未読通知の数
  const unreadCount = notifications.filter((n) => !n.read).length;

  // 通知アイコンを取得
  const getNotificationIcon = (type) => {
    switch (type) {
      case "like":
        return <Heart className="w-5 h-5 text-red-500 fill-red-500" />;
      case "comment":
        return <MessageCircle className="w-5 h-5 text-blue-500" />;
      case "follow":
        return <UserPlus className="w-5 h-5 text-green-500" />;
      case "award":
        return <Award className="w-5 h-5 text-yellow-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  // 既読にする
  const markAsRead = (id) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  // すべて既読にする
  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  // 通知を削除
  const deleteNotification = (id) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* ヘッダー */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-full p-3">
                <Bell className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">通知</h1>
                {unreadCount > 0 && (
                  <p className="text-sm text-gray-600">
                    {unreadCount}件の未読通知があります
                  </p>
                )}
              </div>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white shadow-md hover:shadow-lg transition-all text-sm font-medium text-gray-700 hover:text-blue-600"
              >
                <Check className="w-4 h-4" />
                すべて既読
              </button>
            )}
          </div>

          {/* フィルターボタン */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                filter === "all"
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                  : "bg-white text-gray-700 shadow-md hover:shadow-lg"
              }`}
            >
              すべて
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 ${
                filter === "unread"
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                  : "bg-white text-gray-700 shadow-md hover:shadow-lg"
              }`}
            >
              <Filter className="w-4 h-4" />
              未読 {unreadCount > 0 && `(${unreadCount})`}
            </button>
            <button
              onClick={() => setFilter("like")}
              className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 ${
                filter === "like"
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                  : "bg-white text-gray-700 shadow-md hover:shadow-lg"
              }`}
            >
              <Heart className="w-4 h-4" />
              いいね
            </button>
            <button
              onClick={() => setFilter("comment")}
              className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 ${
                filter === "comment"
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                  : "bg-white text-gray-700 shadow-md hover:shadow-lg"
              }`}
            >
              <MessageCircle className="w-4 h-4" />
              コメント
            </button>
          </div>
        </div>

        {/* 通知リスト */}
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <Bell className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-400 text-lg">通知がありません</p>
            </div>
          ) : (
            filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                className={`bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden ${
                  !notif.read ? "border-l-4 border-blue-500" : ""
                }`}
              >
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    {/* アバター or アイコン */}
                    <div className="flex-shrink-0">
                      {notif.userAvatar ? (
                        <div className="relative">
                          <img
                            src={notif.userAvatar}
                            alt={notif.userName}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-md">
                            {getNotificationIcon(notif.type)}
                          </div>
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                          {getNotificationIcon(notif.type)}
                        </div>
                      )}
                    </div>

                    {/* 通知内容 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <p className="text-gray-800">
                          {notif.userName && (
                            <span className="font-bold">{notif.userName}</span>
                          )}
                          <span className="text-gray-600">{notif.message}</span>
                        </p>
                        <span className="text-xs text-gray-400 whitespace-nowrap">
                          {notif.timestamp}
                        </span>
                      </div>

                      {/* 投稿情報 */}
                      {notif.postTitle && (
                        <div className="flex items-center gap-3 mt-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                          {notif.postImage && (
                            <img
                              src={notif.postImage}
                              alt={notif.postTitle}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          )}
                          <span className="text-sm font-medium text-gray-700">
                            {notif.postTitle}
                          </span>
                        </div>
                      )}

                      {/* コメント内容 */}
                      {notif.comment && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-xl border-l-2 border-blue-400">
                          <p className="text-sm text-gray-700">
                            "{notif.comment}"
                          </p>
                        </div>
                      )}

                      {/* アクションボタン */}
                      <div className="flex items-center gap-2 mt-3">
                        {!notif.read && (
                          <button
                            onClick={() => markAsRead(notif.id)}
                            className="text-xs px-3 py-1.5 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors font-medium"
                          >
                            既読にする
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notif.id)}
                          className="text-xs px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600 transition-colors font-medium flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          削除
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
