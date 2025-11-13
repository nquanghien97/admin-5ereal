import type { UserEntity } from "./user";

export interface NewsEntity {
  id: number;
  isHotNews: boolean;
  news_sections: NewsSectionEntity[];
  slug: string;
  summary: string;
  thumbnail?: string;
  title: string;
  author: UserEntity
  authorId: number;
  createdAt: Date;
}

export interface NewsSectionEntity {
  orderIndex: number;
  caption?: string;
  image?: File;
  imageUrl?: string;
  content?: string;
}