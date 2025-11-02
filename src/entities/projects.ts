import type { UserEntity } from "./user"

export interface ProjectsEntity {
  id: number
  name: string
  fullName: string
  slug: string
  location: string
  totalArea: number //Diện tích (m2)
  constructionRate: number // Mật độ xây dựng (%)
  floorHeightMin: number // Số tầng thấp nhất
  floorHeightMax: number // Số tầng cao nhất
  type: number // Loại hình bất động sản
  numberOfUnits: number // Tổng số căn
  investor: number // Tên chủ đầu tư
  thumbnailUrl?: string // URL ảnh đại diện
  content: string   // Nội dung mô tả chi tiết (HTML/Markdown)
  authorId: number
  author: UserEntity
  project_sections: ProjectsSectionsEntity[]
  project_images: ProjectsImagesEntity[]
  createdAt: Date
  updatedAt: Date
}

export interface ProjectsImagesEntity {
  id: number
  projectId: number
  type: SECTION_TYPE
  imageUrl: string
  caption?: string
  orderIndex: number
  createdAt: Date
  updatedAt: Date
}

type SECTION_TYPE = "TIEN_ICH" | "THU_VIEN_HINH_ANH" | "NORMAL"

export interface ProjectsSectionsEntity {
  projectId: number
  id: number
  type: SECTION_TYPE
  title: string | null
  description: string | null
  content?: string
  image?: File
  imageUrl?: string
  orderIndex: number
}