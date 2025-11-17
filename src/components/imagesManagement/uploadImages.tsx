import { Button, Modal, Upload, Image } from 'antd'
import { useState } from 'react'
import { UploadOutlined } from '@ant-design/icons'
import type { UploadFile } from 'antd/es/upload/interface'
import { useNotification } from '../../hooks/useNotification'
import { uploadImages } from '../../services/media'

interface UploadImagesProps {
  open: boolean
  onClose: () => void
  onUploadSuccess: (({ url, filename, mimiType }: { url: string, filename: string, mimiType: string }) => void) | undefined
}

function UploadImages(props: UploadImagesProps) {
  const { open, onClose, onUploadSuccess } = props

  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [loading, setLoading] = useState(false)
  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewImage, setPreviewImage] = useState('')

  const notification = useNotification()

  const onSubmit = async () => {
    if (fileList.length === 0) {
      notification.warning('Vui lòng chọn ít nhất một hình ảnh')
      return
    }

    try {
      setLoading(true)
      const formData = new FormData()

      fileList.forEach(file => {
        if (file.originFileObj) {
          formData.append('files', file.originFileObj)
        }
      })

      const response = await uploadImages(formData)
      notification.success(`Tải lên thành công ${fileList.length} hình ảnh`)

      if (onUploadSuccess) {
        onUploadSuccess(response.data.uploaded.url)
      }
      setFileList([])
      onClose()
    } catch (err) {
      console.error(err)
      notification.error('Có lỗi xảy ra khi tải hình ảnh')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = ({ fileList: newFileList }: { fileList: UploadFile[] }) => {
    setFileList(newFileList)
  }

  const handleRemove = (file: UploadFile) => {
    const newFileList = fileList.filter(item => item.uid !== file.uid)
    setFileList(newFileList)
  }

  const getBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = error => reject(error)
    })
  }

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as File)
    }
    setPreviewImage(file.url || (file.preview as string))
    setPreviewVisible(true)
  }


  return (
    <>
      <Modal
        title="Tải lên hình ảnh"
        open={open}
        onCancel={onClose}
        width="70%"
        footer={[
          <Button key="cancel" onClick={onClose}>
            Hủy
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={onSubmit}
            disabled={fileList.length === 0}
          >
            Tải lên ({fileList.length})
          </Button>
        ]}
      >
        <div className="space-y-4">
          <Upload
            listType="picture-card"
            fileList={fileList}
            onChange={handleChange}
            onPreview={handlePreview}
            onRemove={handleRemove}
            beforeUpload={() => false}
            multiple
            accept="image/*"
          >
            {fileList.length >= 20 ? null : (
              <div>
                <UploadOutlined />
                <div style={{ marginTop: 8 }}>Chọn ảnh</div>
              </div>
            )}
          </Upload>

          {fileList.length > 0 && (
            <div className="text-gray-500 text-sm">
              Đã chọn {fileList.length} hình ảnh
            </div>
          )}
        </div>
      </Modal>
      <Modal
        open={previewVisible}
        title="Xem trước"
        footer={null}
        width="50%"
        onCancel={() => setPreviewVisible(false)}
      >
        <Image
          alt="preview"
          style={{ width: '100%' }}
          src={previewImage}
          preview={false}
        />
      </Modal>
    </>
  )
}

export default UploadImages