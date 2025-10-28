export type ItemStatus = "募集中" | "承認待ち" | "貸出中" | "返却待ち" | "返却済";
export type Item = {
  id: string;
  title: string;
  course: string;
  category: string;
  status: ItemStatus;
  owner: string;
  image: string;
};
export type Reward = { id: string; name: string; cost: number };

export const seedItems: Item[] = [
  {
    id: "i1",
    title: "線形代数入門（第3版）",
    course: "工学部 1年",
    category: "教科書",
    status: "募集中",
    owner: "先輩A",
    image:
      "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "i2",
    title: "新・経済学の基礎",
    course: "経済学部 2年",
    category: "参考書",
    status: "募集中",
    owner: "先輩B",
    image:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=800&auto=format&fit=crop",
  },
];

export const seedRewards: Reward[] = [
  { id: "r1", name: "学食券 300円", cost: 15 },
  { id: "r2", name: "文具券 500円", cost: 25 },
];
