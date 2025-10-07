export interface NewsEntity {
  id: number;
  title: string;
  content: string;
  thumbnail: string;
  authorId: number;
  createdAt: Date;
}

export interface NewsSectionEntity {
  orderIndex: number;
  caption?: string;
  image?: File;
  content?: string;
}