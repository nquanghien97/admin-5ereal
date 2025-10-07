import React, { useState } from 'react'
import { Form, Input, Image, Modal, Button } from 'antd'
import PlusIcon from '../../../assets/icons/PlusIcon'
import MinusIcon from '../../../assets/icons/MinusIcon'

interface ThuVienHinhAnhProps {
  listImagesThuVienHinhAnh: File[]
  setListImagesThuVienHinhAnh: React.Dispatch<React.SetStateAction<File[]>>
}

function ThuVienHinhAnh(props: ThuVienHinhAnhProps) {
  const { listImagesThuVienHinhAnh, setListImagesThuVienHinhAnh } = props
  const [isOpenModalAddImages, setIsOpenModalAddImages] = useState(false)
  const [listImages, setListImages] = useState<File[] | null>(null)

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setListImages(Array.from(files)); // ✅ Convert FileList → Array<File>
    }
  };

  const handleRemoveImage = (index: number) => {
    setListImages((prev) => (prev ?? []).filter((_, i) => i !== index));
  };

  return (
    <>
      <div className="max-w-7xl p-4 m-auto border border-dashed">
        <div>
          <h2 className="text-3xl md:text-5xl font-[800] text-[#0F3E5A] text-center mb-4">THƯ VIỆN HÌNH ẢNH</h2>
          <Form.Item
            label="Mô tả"
            className="!px-4"
            name="description_thu_vien_hinh_anh"
            rules={[
              {
                required: true,
                message: "Trường này là bắt buộc"
              }
            ]}
          >
            <Input
              placeholder="Mô tả"
            />
          </Form.Item>
        </div>
        <div className="grid grid-cols-3">
          {listImagesThuVienHinhAnh.map((image, index) => (
            <div key={index} className="h-[280px] w-full">
              <Image src={URL.createObjectURL(image)} alt="image" className="border !h-full !w-full object-cover" />
            </div>
          ))}
        </div>
        <div className="flex justify-center">
          <div
            className="w-10 h-10 bg-blue-400 rounded-md cursor-pointer flex items-center justify-center hover:opacity-80 duration-300 text-white"
            onClick={() => setIsOpenModalAddImages(true)}
          >
            <PlusIcon title="Thêm hình ảnh tiện ích" />
          </div>
        </div>
      </div>
      <Modal
        title="Thêm hình ảnh"
        open={isOpenModalAddImages}
        onCancel={() => setIsOpenModalAddImages(false)}
        footer={null}
        className="!w-1/2"
      >
        <div>
          <div className="">
            <div>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFilesChange}
              />
            </div>
            <div className="flex flex-wrap">
              {listImages && (
                listImages.map((image, index) => (
                  <div className="relative w-1/2 p-4" key={index}>
                    <div className="flex absolute z-10 right-0">
                      <div
                        className="bg-red-500 p-1 rounded-full hover:bg-red-600 duration-300 cursor-pointer flex items-center justify-center"
                        onClick={() => handleRemoveImage(index)}
                      >
                        <MinusIcon title="Xóa hình ảnh" className="cursor-pointer" color='white' />
                      </div>
                    </div>
                    <Image src={URL.createObjectURL(image)} alt="uploaded" className="m-auto" />
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="flex justify-end mt-4 gap-4">
            <Button
              type="primary"
              danger
              onClick={() => {
                setIsOpenModalAddImages(false);
              }}
            >
              Hủy
            </Button>
            {listImages && (
              <Button
                type="primary"
                onClick={() => {
                  setListImagesThuVienHinhAnh(listImages)
                  setIsOpenModalAddImages(false)
                }}
              >
                Tải lên
              </Button>
            )}
          </div>
        </div>
      </Modal>
    </>
  )
}

export default ThuVienHinhAnh