// 投稿ステータスに応じて色を変える関数
export function statusColor(status) {
  switch (status) {
    case "募集中": return "bg-green-50 text-green-700 ring-green-200";
    case "承認待ち": return "bg-amber-50 text-amber-700 ring-amber-200";
    case "貸出中": return "bg-indigo-50 text-indigo-700 ring-indigo-200";
    case "返却待ち": return "bg-blue-50 text-blue-700 ring-blue-200";
    case "返却済": return "bg-gray-50 text-gray-700 ring-gray-200";
    default: return "bg-gray-50 text-gray-700 ring-gray-200";
  }
}
