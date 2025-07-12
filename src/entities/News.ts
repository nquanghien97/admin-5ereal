export interface NewsEntity {
  id: number;
  title: string;
  content: string;
  thumbnailUrl: string;
  authorId: number;
  createdAt: Date;
}