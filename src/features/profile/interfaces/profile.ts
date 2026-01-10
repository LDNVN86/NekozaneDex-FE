export interface ProfileUser {
  name: string;
  email: string;
  avatar?: string;
  joinedAt: string;
}

export interface BookmarkItem {
  id: string;
  title: string;
  slug: string;
  author: string;
  coverUrl?: string;
  chapterCount: number;
  viewCount: number;
}

export interface HistoryItem {
  id: string;
  title: string;
  slug: string;
  coverUrl?: string;
  lastChapter: number;
  lastReadAt: string;
}
