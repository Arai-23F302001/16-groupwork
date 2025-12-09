import React from "react";
import { useNavigate } from "react-router-dom";

export default function Sidebar({ open, onClose, user }) {
  const navigate = useNavigate();

  const menus = [
    { label: "ホーム", path: "/" },
    {
      label: "投稿する",
      children: [
        { label: "借りる", path: "/post/borrow" },
        { label: "貸す", path: "/post/lend" },
      ],
    },
    {
      label: "マイページ",
      children: [{ label: "通知", path: "/mypage/notify" }],
    },
  ];

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />
      )}

      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50 transform 
        transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="p-4 border-b text-lg font-bold">Campus Share</div>

        <div className="p-4 text-sm space-y-4">
          {menus.map((m, i) => (
            <div key={i}>
              <div className="font-semibold text-gray-700 mb-1">{m.label}</div>

              {/* 子メニュー */}
              {m.children ? (
                <div className="ml-2 space-y-1">
                  {m.children.map((s) => (
                    <div
                      key={s.path}
                      className="cursor-pointer text-gray-600 hover:text-indigo-600"
                      onClick={() => {
                        navigate(s.path);
                        onClose();
                      }}
                    >
                      ・{s.label}
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  className="ml-2 cursor-pointer text-gray-600 hover:text-indigo-600"
                  onClick={() => {
                    navigate(m.path);
                    onClose();
                  }}
                >
                  ・開く
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
