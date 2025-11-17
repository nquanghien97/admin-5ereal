import { Button, Image, Input, Switch } from "antd"
import { useEffect, useState } from "react";
import ClockIcon from "../../../assets/icons/ClockIcon";
import NewsSection from "../news-section";
import PlusIcon from "../../../assets/icons/PlusIcon";
import type { CreateNewsDTO } from "../../../entities/news";
import { Editor } from "@tinymce/tinymce-react";
import { getNews, updateNews } from "../../../services/news";
import { useNavigate, useParams } from "react-router-dom";
import { useNotification } from "../../../hooks/useNotification";
import ImagesManagement, { type ImageItem } from "../../../components/imagesManagement";

const initValues = {
  title: "",
  slug: "",
  summary: "",
  thumbnailId: -1,
  isHotNews: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  authorId: -1,
  thumbnail: {
    id: -1,
    url: "",
    alt: "",
    mimeType: "",
    createdAt: new Date(),
  },
  author: {
    id: -1,
    fullName: "",
  },
  sections: []
}

type ImageFieldType =
  | 'thumbnail'
  | { type: 'sectionImage', sectionIndex: number }

function UpdateNews() {

  const { id } = useParams()
  const notification = useNotification();
  const navigate = useNavigate()

  const [currentNews, setCurrentNews] = useState<CreateNewsDTO>(initValues)
  const [openImagesManagement, setOpenImagesManagement] = useState(false)
  const [currentImageField, setCurrentImageField] = useState<ImageFieldType | null>(null)
  const [loading, setLoading] = useState(false)

  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const openImageManager = (field: ImageFieldType) => {
    setCurrentImageField(field)
    setOpenImagesManagement(true)
  }

  const handleSelectImage = (image: ImageItem | ImageItem[]) => {
    if (!currentImageField) return

    const selectedImage = image as ImageItem // Single mode

    if (currentImageField === 'thumbnail') {
      setCurrentNews(prev => ({ ...prev, thumbnail: selectedImage }))
    }
    else if (typeof currentImageField === 'object' && currentImageField.type === 'sectionImage') {
      setCurrentNews(prev => ({
        ...prev,
        sections: prev.sections.map((section, idx) =>
          idx === currentImageField.sectionIndex
            ? { ...section, image: selectedImage }
            : section
        )
      }))
    }
  }

  useEffect(() => {
    (async () => {
      const res = await getNews(Number(id))
      const currentNews = res.data.news as CreateNewsDTO
      setCurrentNews(currentNews)
    })()
  }, [id])

  const onSubmit = async () => {
    setLoading(true)
    try {
      if (!currentNews.title.trim()) {
        notification.warning('Vui lòng nhập tiêu đề')
        return
      }
      if (!currentNews.summary.trim()) {
        notification.warning('Vui lòng nhập tổng quan')
        return
      }
      if (!currentNews.thumbnail) {
        notification.warning('Vui lòng chọn ảnh thumbnail')
        return
      }
      await updateNews(Number(id), {
        ...currentNews,
        thumbnailId: currentNews.thumbnail.id,
        sections: currentNews.sections.map(section => ({
          ...section,
          imageId: section.image?.id
        }))
      })
      notification.success('Cập nhật bản tin thành công')
      navigate('/tin-tuc')
    } catch (err) {
      console.log(err)
      notification.error('Cập nhật bản tin thất bại')
    } finally {
      setLoading(false)
    }
  }

  const addSection = () => {
    setCurrentNews(prev => ({
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
    setCurrentNews(prev => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index)
    }))
  }

  if (!currentNews) return (
    <p>Không tìm thấy bản tin</p>
  )

  return (
    <>
      <div className="max-w-7xl m-auto py-8">
        <h1 className="text-center mb-4 text-4xl font-semibold">Cập nhật bản tin</h1>
        <div className="fixed top-24 right-2 z-[100]">
          <Button loading={loading} type="primary" onClick={onSubmit}>Lưu bản tin</Button>
        </div>
        <div className="px-4">
          <div className="flex gap-4 mb-8">
            {/* Left Column - Content */}
            <div className="flex-1 flex flex-col">
              {/* Hot News Toggle */}
              <div className={`flex ${currentNews.isHotNews ? 'justify-between' : 'justify-end'} items-center mb-2`}>
                {currentNews.isHotNews && (
                  <p className="px-2 py-0.5 bg-amber-500 text-white rounded-xl text-sm">
                    Tin nóng
                  </p>
                )}
                <div className="flex items-center gap-2 py-0.5">
                  <p>Tin nóng:</p>
                  <Switch
                    checked={currentNews.isHotNews}
                    onChange={checked => setCurrentNews(pre => ({ ...pre, isHotNews: checked }))}
                  />
                </div>
              </div>

              {/* Title Input */}
              <Input
                placeholder="Tiêu đề"
                name="title"
                value={currentNews.title}
                onChange={(e) => setCurrentNews(pre => ({ ...pre, title: e.target.value }))}
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
                  value={currentNews.summary}
                  onEditorChange={(newContent) => setCurrentNews(pre => ({ ...pre, summary: newContent }))}
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
                {currentNews.thumbnail ? (
                  <div className="relative border rounded-md overflow-hidden h-full group">
                    <Image
                      src={`${import.meta.env.VITE_API_URL}${currentNews.thumbnail.url}`}
                      alt={currentNews.thumbnail.alt || 'thumbnail'}
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
                        onClick={() => setCurrentNews(prev => ({ ...prev, thumbnail: null }))}
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

          {currentNews.sections.map((section, index) => (
            <NewsSection
              key={index}
              orderIndex={index + 1}
              onRemoveSection={() => removeSection(index)}
              dataSections={section}
              setData={setCurrentNews}
              onSelectImage={() => openImageManager({
                type: 'sectionImage',
                sectionIndex: index
              })}
            />
          ))}

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
        //     ? currentNews.thumbnail
        //     : currentImageField && typeof currentImageField === 'object'
        //       ? currentNews.sections[currentImageField.sectionIndex]?.image
        //       : undefined
        // }
      />
    </>
  )
}

export default UpdateNews