import { Button, Image, Modal } from "antd"
import { useEffect, useState, useCallback, useMemo } from "react"
import { DeleteOutlined, EyeOutlined, CheckOutlined } from '@ant-design/icons'
import UploadImages from "./uploadImages"
import { deleteImage, getImages } from "../../services/media"
import { useNotification } from "../../hooks/useNotification"
// import type { MediaEntity } from "../../entities/media"

// Types
export interface ImageItem {
  id: number
  url: string
  alt: string
  mimeType: string
}

export interface ImageItemDTO {
  url: string
  alt: string
  mimeType: string
}

interface ImagesManagementProps {
  open: boolean
  onClose: () => void
  onUploadSuccess?: (images: ImageItem | ImageItem[]) => void
  multiple?: boolean
  // defaultSelected: MediaEntity | null | undefined
}

// Sub-components
const ImageCard = ({
  image,
  isSelected,
  isShowActions,
  onSelect,
  onMouseOver,
  onPreview,
  onDelete
}: {
  image: ImageItem
  index: number
  isSelected: boolean
  isShowActions: boolean
  onSelect: () => void
  onMouseOver: () => void
  onPreview: () => void
  onDelete: () => void
}) => (
  <div
    className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200 ${isSelected
        ? 'border-blue-500 shadow-lg'
        : 'border-transparent hover:border-gray-300'
      }`}
    onMouseOver={onMouseOver}
    onClick={onSelect}
  >
    <div className="p-2">
      <Image
        src={`${import.meta.env.VITE_API_URL}${image.url}`}
        alt={image.alt}
        preview={false}
        className="w-full h-full object-cover"
      />
    </div>

    {isSelected && (
      <div className="absolute top-2 left-2 w-6 h-6 bg-blue-500 rounded-full flex justify-center items-center z-10">
        <CheckOutlined className="text-white text-xs" />
      </div>
    )}

    {isShowActions && (
      <div className="absolute right-3 top-3 flex gap-2 z-10">
        <button
          className="w-8 h-8 bg-white/90 hover:bg-white rounded-full flex justify-center items-center shadow-md transition-all cursor-pointer"
          onClick={(e) => {
            e.stopPropagation()
            onPreview()
          }}
        >
          <EyeOutlined className="text-blue-500" />
        </button>
        <button
          className="w-8 h-8 bg-white/90 hover:bg-white rounded-full flex justify-center items-center shadow-md transition-all cursor-pointer"
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
        >
          <DeleteOutlined className="text-red-500" />
        </button>
      </div>
    )}

    {isSelected && (
      <div className="absolute inset-0 bg-blue-500/10 pointer-events-none" />
    )}
  </div>
)

const EmptyState = () => (
  <div className="text-center py-8 text-gray-400">
    <p>Không có hình ảnh nào</p>
  </div>
)

const DeleteConfirmModal = ({
  open,
  loading,
  onCancel,
  onConfirm
}: {
  open: boolean
  loading: boolean
  onCancel: () => void
  onConfirm: () => void
}) => (
  <Modal
    open={open}
    onCancel={onCancel}
    footer={null}
    width={400}
  >
    <div className="py-4">
      <h2 className="text-xl text-center font-semibold mb-6">
        Bạn có muốn xóa ảnh này không?
      </h2>
      <div className="flex gap-4 justify-center">
        <Button
          onClick={onCancel}
          disabled={loading}
        >
          Hủy
        </Button>
        <Button
          loading={loading}
          onClick={onConfirm}
          type="primary"
          danger
        >
          Xóa
        </Button>
      </div>
    </div>
  </Modal>
)

const PreviewModal = ({
  open,
  image,
  onClose
}: {
  open: boolean
  image: ImageItem | null
  onClose: () => void
}) => (
  <Modal
    open={open}
    onCancel={onClose}
    title="Xem trước"
    footer={null}
    width="50%"
  >
    {image ? (
      <Image
        alt="preview"
        style={{ width: '100%' }}
        src={`${import.meta.env.VITE_API_URL}${image.url}`}
        preview={false}
      />
    ) : (
      <p className="text-center text-gray-400">
        Không có hình ảnh nào được chọn
      </p>
    )}
  </Modal>
)

// Main Component
function ImagesManagement(props: ImagesManagementProps) {
  const { open, onClose, onUploadSuccess, multiple = false } = props

  // UI States
  const [isOpenUploadImages, setIsOpenUploadImages] = useState(false)
  const [isShowActionsIndex, setIsShowActionsIndex] = useState(-1)
  const [isOpenPreview, setIsOpenPreview] = useState(false)
  const [isOpenDeleteImage, setIsOpenDeleteImage] = useState(false)

  // Data States
  const [listImage, setListImage] = useState<ImageItem[]>([])
  const [previewImage, setPreviewImage] = useState<ImageItem | null>(null)
  const [selectedImageDelete, setSelectedImageDelete] = useState<ImageItem | null>(null)
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null)
  const [selectedImages, setSelectedImages] = useState<ImageItem[]>([])

  // Loading States
  const [isLoadingDelete, setIsLoadingDelete] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const notification = useNotification()
  
  // Fetch images
  const fetchImages = useCallback(async () => {
    try {
      const res = await getImages()
      setListImage(res.data.listImages)
    } catch (error) {
      console.error('Error fetching images:', error)
      notification.error('Không thể tải danh sách hình ảnh')
    }
  }, [notification])

  useEffect(() => {
    if (open) {
      fetchImages()
    }
  }, [open, refreshTrigger, fetchImages])

  // Selection logic
  const handleImageClick = useCallback((image: ImageItem) => {
    if (multiple) {
      setSelectedImages(prev => {
        const isSelected = prev.some(img => img.id === image.id)
        return isSelected
          ? prev.filter(img => img.id !== image.id)
          : [...prev, image]
      })
    } else {
      setSelectedImage(prev => prev?.id === image.id ? null : image)
    }
  }, [multiple])

  const isImageSelected = useCallback((image: ImageItem) => {
    if (multiple) {
      return selectedImages.some(img => img.id === image.id)
    }
    return selectedImage?.id === image.id
  }, [multiple, selectedImages, selectedImage])

  // Actions

  const handleClose = useCallback(() => {
    setSelectedImage(null)
    setSelectedImages([])
    onClose()
  }, [onClose])

  const handleSubmit = useCallback(() => {
    if (multiple) {
      if (selectedImages.length === 0) {
        notification.warning('Vui lòng chọn ít nhất một hình ảnh')
        return
      }
      onUploadSuccess?.(selectedImages)
    } else {
      if (!selectedImage) {
        notification.warning('Vui lòng chọn một hình ảnh')
        return
      }
      onUploadSuccess?.(selectedImage)
    }
    handleClose()
  }, [multiple, handleClose, selectedImages, onUploadSuccess, notification, selectedImage])



  const handleDelete = useCallback(async () => {
    if (!selectedImageDelete) {
      notification.error('Không tìm thấy hình ảnh')
      return
    }

    try {
      setIsLoadingDelete(true)
      await deleteImage(selectedImageDelete.id)
      notification.success('Xóa hình ảnh thành công')
      setIsOpenDeleteImage(false)
      setSelectedImageDelete(null)
      setRefreshTrigger(prev => prev + 1)

      // Remove from selection if deleted
      if (multiple) {
        setSelectedImages(prev => prev.filter(img => img.id !== selectedImageDelete.id))
      } else if (selectedImage?.id === selectedImageDelete.id) {
        setSelectedImage(null)
      }
    } catch (error) {
      console.error('Error deleting image:', error)
      notification.error((error as { response: { data: { message: string }}}).response.data.message)
    } finally {
      setIsLoadingDelete(false)
    }
  }, [selectedImageDelete, notification, multiple, selectedImage?.id])

  const handleUploadSuccess = useCallback(() => {
    setRefreshTrigger(prev => prev + 1)
  }, [])

  // Computed values
  const selectedCount = useMemo(() => {
    return multiple ? selectedImages.length : (selectedImage ? 1 : 0)
  }, [multiple, selectedImages.length, selectedImage])

  const selectionText = useMemo(() => {
    if (multiple) {
      return selectedImages.length > 0
        ? `Đã chọn ${selectedImages.length} hình ảnh`
        : ''
    }
    return selectedImage ? 'Đã chọn 1 hình ảnh' : ''
  }, [multiple, selectedImages.length, selectedImage])

  return (
    <>
      <Modal
        title={`Quản lý hình ảnh ${multiple ? '(Chọn nhiều)' : '(Chọn một)'}`}
        open={open}
        onCancel={handleClose}
        width="70%"
        footer={[
          <Button key="cancel" onClick={handleClose}>
            Hủy
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleSubmit}
            disabled={selectedCount === 0}
          >
            Chọn hình ảnh {selectedCount > 0 && `(${selectedCount})`}
          </Button>
        ]}
      >
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              {selectionText}
            </div>
            <Button
              type="primary"
              onClick={() => setIsOpenUploadImages(true)}
            >
              Tải hình ảnh lên
            </Button>
          </div>

          {listImage.length === 0 ? (
            <EmptyState />
          ) : (
            <div
              className="grid grid-cols-4 gap-4"
              onMouseLeave={() => setIsShowActionsIndex(-1)}
            >
              {listImage.map((image, index) => (
                <ImageCard
                  key={image.id}
                  image={image}
                  index={index}
                  isSelected={isImageSelected(image)}
                  isShowActions={isShowActionsIndex === index}
                  onSelect={() => handleImageClick(image)}
                  onMouseOver={() => setIsShowActionsIndex(index)}
                  onPreview={() => {
                    setPreviewImage(image)
                    setIsOpenPreview(true)
                  }}
                  onDelete={() => {
                    setSelectedImageDelete(image)
                    setIsOpenDeleteImage(true)
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </Modal>

      <UploadImages
        open={isOpenUploadImages}
        onClose={() => setIsOpenUploadImages(false)}
        onUploadSuccess={handleUploadSuccess}
      />

      <PreviewModal
        open={isOpenPreview}
        image={previewImage}
        onClose={() => {
          setIsOpenPreview(false)
          setPreviewImage(null)
        }}
      />

      <DeleteConfirmModal
        open={isOpenDeleteImage}
        loading={isLoadingDelete}
        onCancel={() => {
          setIsOpenDeleteImage(false)
          setSelectedImageDelete(null)
        }}
        onConfirm={handleDelete}
      />
    </>
  )
}

export default ImagesManagement