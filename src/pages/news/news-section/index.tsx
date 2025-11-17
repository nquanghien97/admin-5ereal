import { Button, Image, Input } from "antd"
import { Editor } from "@tinymce/tinymce-react"
import { DeleteOutlined, PictureOutlined } from '@ant-design/icons'
import type { CreateNewsDTO, NewsSectionEntity } from "../../../entities/news"
interface NewsSectionProps {
  orderIndex: number
  dataSections: NewsSectionEntity
  setData: React.Dispatch<React.SetStateAction<CreateNewsDTO>>
  onRemoveSection: () => void
  onSelectImage: () => void // Function để mở modal chọn ảnh
}

function NewsSection(props: NewsSectionProps) {
  const { orderIndex, dataSections, setData, onRemoveSection, onSelectImage } = props

  // Update content của section này
  const handleContentChange = (newContent: string) => {
    setData((prev) => ({
      ...prev,
      sections: prev.sections.map((section, idx: number) =>
        idx === orderIndex - 1
          ? { ...section, content: newContent }
          : section
      )
    }))
  }

  // Xóa ảnh của section này
  const handleRemoveImage = () => {
    setData((prev) => ({
      ...prev,
      sections: prev.sections.map((section, idx: number) =>
        idx === orderIndex - 1
          ? { ...section, image: null }
          : section
      )
    }))
  }

  return (
    <div className="border rounded-lg p-6 mb-6 bg-white shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-700">
          Section {orderIndex}
        </h3>
        <Button
          danger
          icon={<DeleteOutlined />}
          onClick={onRemoveSection}
        >
          Xóa section
        </Button>
      </div>

      {/* Content Editor */}
      <div className="mb-6">
        <label className="block font-medium mb-2">Nội dung</label>
        <Editor
          apiKey="hkoepxco9p2gme5kius6axtlk3n83yberu5a59m56l7dhgn3"
          value={dataSections.content}
          onEditorChange={handleContentChange}
          init={{
            height: 300,
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

      {/* Image Section */}
      <div>
        <label className="block font-medium mb-2">Hình ảnh</label>
        {dataSections.image ? (
          <div>
            <div className="relative inline-block group mb-2">
              <Image
                src={`${import.meta.env.VITE_API_URL}${dataSections.image.url}`}
                alt={dataSections.image.alt || `section-${orderIndex}`}
                preview={true}
                className="rounded-lg"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                <Button
                  type="primary"
                  onClick={onSelectImage}
                >
                  Thay đổi
                </Button>
                <Button
                  danger
                  onClick={handleRemoveImage}
                >
                  Xóa
                </Button>
              </div>
            </div>
            <div className="flex gap-1">
              <label htmlFor="">Caption:</label>
              <Input value={dataSections.caption} onChange={(e) => setData(pre => ({
                ...pre,
                sections: pre.sections.map((section, idx: number) =>
                  idx === orderIndex - 1
                    ? { ...section, caption: e.target.value }
                    : section
                )
              }))} />
            </div>
          </div>
        ) : (
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 inline-block"
            onClick={onSelectImage}
          >
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <div className="bg-blue-500 p-3 rounded-full">
                  <PictureOutlined className="text-white text-2xl" />
                </div>
              </div>
              <p className="text-gray-600 font-medium">Thêm hình ảnh</p>
              <p className="text-sm text-gray-400 mt-1">Click để chọn ảnh</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default NewsSection