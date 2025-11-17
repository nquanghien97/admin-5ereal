import type { CreateProjectDTO, ProjectSectionDTO, ProjectSectionImageEntity, SECTION_TYPE } from "../../../entities/projects"
import { Button, Image } from 'antd'

interface GallerySectionProps {
  dataSections: ProjectSectionDTO
  setData: React.Dispatch<React.SetStateAction<CreateProjectDTO>>
  type: SECTION_TYPE
}


function GallerySection(props: GallerySectionProps) {
  const { dataSections, setData, type } = props

  const handleRemoveImage = (image: ProjectSectionImageEntity) => {
    setData((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        section.type === type
          ? { ...section, section_images: section.section_images.filter(i => i.image.alt !== image.image.alt) }
          : section
      )
    }))
  }

  return (
    dataSections.section_images.length !== 0 ? (
      <div className="grid grid-cols-3 gap-2">
        {dataSections.section_images.map((image, index) => (
          <div className="relative inline-block group mb-2" key={index}>
            <Image
              src={`${import.meta.env.VITE_API_URL}${image.image.url}`}
              alt={image.image.alt}
              preview={true}
              className="rounded-lg"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
              {/* <Button
                    type="primary"
                    onClick={onSelectImage}
                  >
                    Thay đổi
                  </Button> */}
              <Button
                danger
                onClick={() => handleRemoveImage(image)}
              >
                Xóa
              </Button>
            </div>
          </div>
        ))}
      </div>
    ) : null
  )
}

export default GallerySection