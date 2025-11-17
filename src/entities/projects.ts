import type { MediaDTO, MediaEntity } from "./media"
export interface ProjectEntity {
  id: number
  name: string
  description: string
  fullName: string
  slug: string
  location: string
  totalArea: number
  constructionRate: number
  floorHeightMin: number
  floorHeightMax: number
  type: string
  numberOfUnits: number
  investor: string
  thumbnailId: number
  thumbnail: MediaEntity                    // Populated relation
  backgroundOverviewId: number | null
  backgroundOverview: MediaEntity | null    // Populated relation
  authorId: number
  author: {
    id: number
    fullName: string
    email: string
  }
  createdAt: Date
  updatedAt: Date
  sections: ProjectSectionEntity[]          // Populated relation
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

export type SECTION_TYPE = "TIEN_ICH" | "THU_VIEN_HINH_ANH" | "NORMAL"

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

export interface ProjectSectionImageDTO {
  id?: number
  imageId: number
  url?: string
  orderIndex?: number
  alt?: string
}

export interface ProjectSectionImageEntity {
  sectionId: number
  imageId: number
  orderIndex: number
  image: MediaDTO   // Populated relation
}

export interface ProjectSectionDTO {
  id?: number                          // Có = update, không có = create new
  type: SECTION_TYPE                   // REQUIRED
  title?: string | null                // Optional
  description?: string | null          // Optional
  content: string              // Optional
  caption?: string
  orderIndex: number                  // Optional - backend tự assign
  section_images: ProjectSectionImageEntity[]    // Optional - nested images
}

// Dùng khi NHẬN VỀ (Response)
export interface ProjectSectionEntity {
  id: number
  projectId: number
  type: SECTION_TYPE
  title: string | null
  description: string | null
  content: string | null
  orderIndex: number
  createdAt: Date
  updatedAt: Date
  section_images: ProjectSectionImageEntity[]  // Populated relation
}

export interface CreateProjectDTO {
  name: string                          // REQUIRED
  fullName: string                      // REQUIRED
  location: string                      // REQUIRED
  totalArea: number                     // REQUIRED
  constructionRate: number              // REQUIRED
  floorHeightMin: number                // REQUIRED
  floorHeightMax: number                // REQUIRED
  type: string                          // REQUIRED
  numberOfUnits: number                 // REQUIRED
  investor: string                      // REQUIRED
  thumbnailId: number                   // REQUIRED
  thumbnail: MediaDTO | null
  backgroundOverviewId?: number | null  // Optional
  backgroundOverview?: MediaDTO | null
  sections: ProjectSectionDTO[]        // Optional
}