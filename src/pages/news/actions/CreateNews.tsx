import { Button, Input, Switch, Image } from "antd"
import { useState } from "react"
import ClockIcon from "../../../assets/icons/ClockIcon"
import NewsSection from "../news-section"
import PlusIcon from "../../../assets/icons/PlusIcon"
import type { CreateNewsDTO } from "../../../entities/news"
import { Editor } from "@tinymce/tinymce-react"
import { createNews } from "../../../services/news"
import ImagesManagement from "../../../components/imagesManagement"
import type { ImageItem } from "../../../components/imagesManagement"
import { useNotification } from "../../../hooks/useNotification"

const initValues: CreateNewsDTO = {
  title: '',
  summary: '',
  thumbnail: null,
  thumbnailId: -1,
  isHotNews: false,
  createdAt: new Date(),
  sections: []
}

// Type để track đang chọn ảnh cho field nào
type ImageFieldType = 
  | 'thumbnail' 
  | { type: 'sectionImage', sectionIndex: number }

function CreateNews() {
  const [data, setData] = useState<CreateNewsDTO>(initValues)
  const [openImagesManagement, setOpenImagesManagement] = useState(false)
  const [currentImageField, setCurrentImageField] = useState<ImageFieldType | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const notification = useNotification()

  const date = new Date()
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()

  // Mở image manager và track field đang chọn
  const openImageManager = (field: ImageFieldType) => {
    setCurrentImageField(field)
    setOpenImagesManagement(true)
  }

  // Xử lý khi chọn ảnh từ ImagesManagement
  const handleSelectImage = (image: ImageItem | ImageItem[]) => {
    if (!currentImageField) return

    const selectedImage = image as ImageItem // Single mode

    if (currentImageField === 'thumbnail') {
      setData(prev => ({ ...prev, thumbnail: selectedImage }))
    } 
    else if (typeof currentImageField === 'object' && currentImageField.type === 'sectionImage') {
      setData(prev => ({
        ...prev,
        sections: prev.sections.map((section, idx) => 
          idx === currentImageField.sectionIndex 
            ? { ...section, image: selectedImage }
            : section
        )
      }))
    }

    setOpenImagesManagement(false)
    setCurrentImageField(null)
  }

  const onSubmit = async () => {
    // Validation
    if (!data.title.trim()) {
      notification.warning('Vui lòng nhập tiêu đề')
      return
    }
    if (!data.summary.trim()) {
      notification.warning('Vui lòng nhập tổng quan')
      return
    }
    if (!data.thumbnail) {
      notification.warning('Vui lòng chọn ảnh thumbnail')
      return
    }

    try {
      setIsSubmitting(true)
      await createNews({
        ...data,
        thumbnailId: data.thumbnail.id,
        sections: data.sections.map(section => ({
          ...section,
          imageId: section.image?.id
        }))
      })
      notification.success('Tạo bản tin thành công')
      // Reset form hoặc redirect
      setData(initValues)
    } catch (err) {
      console.error(err)
      notification.error('Có lỗi xảy ra khi tạo bản tin')
    } finally {
      setIsSubmitting(false)
    }
  }

  const addSection = () => {
    setData(prev => ({
      ...prev,
      sections: [
        ...prev.sections,
        {
          orderIndex: prev.sections.length + 1,
          content: '',
          image: null
        }
      ]
    }))
  }

  const removeSection = (index: number) => {
    setData(prev => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index)
    }))
  }

  return (
    <>
      <div className="max-w-7xl m-auto py-8">
        <h1 className="text-center mb-4 text-4xl font-semibold">
          Tạo mới bản tin
        </h1>
        
        <div className="fixed top-16 right-4 z-10">
          <Button 
            type="primary" 
            onClick={onSubmit}
            loading={isSubmitting}
            size="large"
          >
            Lưu bản tin
          </Button>
        </div>

        <div className="px-4">
          <div className="flex gap-4 mb-8">
            {/* Left Column - Content */}
            <div className="flex-1 flex flex-col">
              {/* Hot News Toggle */}
              <div className={`flex ${data.isHotNews ? 'justify-between' : 'justify-end'} items-center mb-2`}>
                {data.isHotNews && (
                  <p className="px-2 py-0.5 bg-amber-500 text-white rounded-xl text-sm">
                    Tin nóng
                  </p>
                )}
                <div className="flex items-center gap-2 py-0.5">
                  <p>Tin nóng:</p>
                  <Switch 
                    checked={data.isHotNews} 
                    onChange={checked => setData(pre => ({ ...pre, isHotNews: checked }))} 
                  />
                </div>
              </div>

              {/* Title Input */}
              <Input
                placeholder="Tiêu đề"
                name="title"
                value={data.title}
                onChange={(e) => setData(pre => ({ ...pre, title: e.target.value }))}
                size="large"
              />

              {/* Date Display */}
              <div className="flex items-center gap-1 text-gray-500 my-2">
                <ClockIcon width={16} height={16} fill="currentColor" />
                <p className="text-sm">
                  {`${day < 10 ? `0${day}` : day}/${month < 10 ? `0${month}` : month}/${year}`}
                </p>
              </div>

              {/* Summary Editor */}
              <div className="w-full">
                <p className="mb-2 font-medium">Tổng quan</p>
                <Editor
                  apiKey="hkoepxco9p2gme5kius6axtlk3n83yberu5a59m56l7dhgn3"
                  value={data.summary}
                  onEditorChange={(newContent) => setData(pre => ({ ...pre, summary: newContent }))}
                  init={{
                    height: 290,
                    menubar: false,
                    extended_valid_elements: "iframe[src|frameborder|style|scrolling|class|width|height|name|align]",
                    valid_elements: '*[*]',
                    plugins: [
                      'advlist autolink lists link image charmap print preview anchor',
                      'searchreplace visualblocks code fullscreen',
                      'insertdatetime media paste code help wordcount textcolor',
                      'table media paste',
                    ],
                    toolbar:
                      'undo redo | formatselect | bold italic backcolor | ' +
                      'alignleft aligncenter alignright alignjustify | ' +
                      'bullist numlist outdent indent | table | forecolor | removeformat | ' +
                      'image media',
                  }}
                />
              </div>
            </div>

            {/* Right Column - Thumbnail */}
            <div className="flex-1">
              <p className="mb-2 font-medium">Ảnh thumbnail</p>
              <div className="h-[400px]">
                {data.thumbnail ? (
                  <div className="relative border rounded-md overflow-hidden h-full group">
                    <Image
                      src={`${import.meta.env.VITE_API_URL}${data.thumbnail.url}`}
                      alt={data.thumbnail.alt || 'thumbnail'}
                      preview={false}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button 
                        type="primary"
                        onClick={() => openImageManager('thumbnail')}
                      >
                        Thay đổi
                      </Button>
                      <Button 
                        danger
                        onClick={() => setData(prev => ({ ...prev, thumbnail: null }))}
                      >
                        Xóa
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div
                    className="relative border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-amber-500 hover:bg-gray-50 transition-all duration-300 h-full flex items-center justify-center"
                    onClick={() => openImageManager('thumbnail')}
                  >
                    <div className="text-center">
                      <div className="flex justify-center mb-2">
                        <div className="bg-amber-500 p-3 rounded-full hover:bg-amber-600 transition-colors">
                          <PlusIcon color='white' width={24} height={24} />
                        </div>
                      </div>
                      <p className="text-gray-500">Thêm ảnh thumbnail</p>
                      <p className="text-sm text-gray-400 mt-1">Click để chọn ảnh</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* News Sections */}
          {data.sections.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Các section nội dung</h2>
              {data.sections.map((section, index) => (
                <NewsSection
                  key={index}
                  orderIndex={index + 1}
                  onRemoveSection={() => removeSection(index)}
                  dataSections={section}
                  setData={setData}
                  onSelectImage={() => openImageManager({ 
                    type: 'sectionImage', 
                    sectionIndex: index 
                  })}
                />
              ))}
            </div>
          )}

          {/* Add Section Button */}
          <div className="flex justify-center mb-8">
            <button
              className="w-12 h-12 bg-amber-500 rounded-md cursor-pointer flex items-center justify-center hover:bg-amber-600 transition-colors duration-300 text-white shadow-md"
              onClick={addSection}
              title="Thêm section"
            >
              <PlusIcon width={24} height={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Single ImagesManagement Component */}
      <ImagesManagement
        open={openImagesManagement}
        onClose={() => {
          setOpenImagesManagement(false)
          setCurrentImageField(null)
        }}
        multiple={false}
        onUploadSuccess={handleSelectImage}
        // defaultSelected={
        //   currentImageField === 'thumbnail' 
        //     ? data.thumbnail 
        //     : currentImageField && typeof currentImageField === 'object' 
        //       ? data.sections[currentImageField.sectionIndex]?.image 
        //       : undefined
        // }
      />
    </>
  )
}

export default CreateNews