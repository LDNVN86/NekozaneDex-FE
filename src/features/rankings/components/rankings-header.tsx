import { Trophy } from "lucide-react";

export function RankingsHeader() {
  return (
    <div className="flex items-center gap-3 mb-8">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
        <Trophy className="h-6 w-6 text-primary" />
      </div>
      <div>
        <h1 className="text-3xl font-bold">Bảng Xếp Hạng</h1>
        <p className="text-muted-foreground">Top truyện được yêu thích nhất</p>
      </div>
    </div>
  );
}
