import type { UserEntity } from "./user"

export interface ProjectsEntity {
  id: number
  name: string
  slug: string
  location: string
  totalArea: number //Diện tích (m2)
  constructionRate: number // Mật độ xây dựng (%)
  floorHeightMin: number // Số tầng thấp nhất
  floorHeightMax: number // Số tầng cao nhất
  type: number // Loại hình bất động sản
  numberOfUnits: number // Tổng số căn
  investor: number // Tên chủ đầu tư
  thumbnailUrl: string // URL ảnh đại diện
  content: string   // Nội dung mô tả chi tiết (HTML/Markdown)
  authorId: number
  author: UserEntity
  createdAt: Date
  updatedAt: Date
}