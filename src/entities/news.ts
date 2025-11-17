import type { MediaEntity } from "./media";
import type { UserEntity } from "./user";

export interface NewsEntity {
  id: number;
  isHotNews: boolean;
  news_sections: NewsSectionEntity[];
  slug: string;
  summary: string;
  thumbnail?: MediaEntity | null;
  title: string;
  author: Pick<UserEntity, 'id' | 'fullName'>
  authorId: number;
  createdAt: Date;
}

export interface NewsSectionEntity {
  orderIndex: number;
  caption?: string;
  image?: MediaEntity | null;
  imageId?: number;
  content?: string;
}


export interface CreateNewsDTO {
  isHotNews: boolean;
  sections: NewsSectionEntity[];
  summary: string;
  thumbnail: MediaEntity | null;
  thumbnailId: number
  title: string;
  createdAt: Date;
}
