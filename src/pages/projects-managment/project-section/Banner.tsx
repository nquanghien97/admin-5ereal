import { Button, Image, Input, Modal } from 'antd'
import PlusIcon from '../../../assets/icons/PlusIcon'
import { useState } from 'react';
import MinusIcon from '../../../assets/icons/MinusIcon';

interface BannerProps {
  name?: string
  thumbnail: File | null
  setThumnail: React.Dispatch<React.SetStateAction<File | null>>
  description: string
  setDescription: React.Dispatch<React.SetStateAction<string>>
}

function Banner(props: BannerProps) {
  const { description, name, setThumnail, thumbnail, setDescription } = props

  const [isOpenModalAddImage, setIsOpenModalAddImage] = useState(false);
  const [image, setImage] = useState<File | null>(null)
  return (
    <>

      <section className="mb-8 z-0 relative">
        {thumbnail &&
          (
            <section className="relative">
              <div className="absolute top-2 right-2 z-[10]">
                {thumbnail && (
                  <div
                    className="bg-red-500 p-1 rounded-full hover:bg-red-600 duration-300 cursor-pointer flex items-center justify-center"
                    onClick={() => {
                      setThumnail(null);
                      setImage(null)
                      setDescription('')
                    }}
                  >
                    <MinusIcon title="Xóa hình ảnh" className="cursor-pointer" color='white' />
                  </div>
                )}
              </div>
              <div className="relative">
                <img src={URL.createObjectURL(thumbnail)} alt="uploaded" className="m-auto max-h-[600px] w-full" />
                <div className="absolute inset-0 lg:top-1/2 background-linear-blue" />
                <div className={`absolute lg:left-[10%] bottom-[10%] text-white w-1/4`}>
                  <div>
                    {name && <h2 className="text-2xl lg:text-4xl font-bold pb-2">{name}</h2>}
                  </div>
                  {description && (
                    <div className="flex items-center gap-2">
                      <div className="max-lg:hidden w-1/4 h-[4px] bg-white" />
                      <p className="text-sm lg:text-xl max-w-lg max-lg:text-center px-2">{description}</p>
                    </div>
                  )}
                </div>
              </div>
            </section>
          )
        }
        {!thumbnail && (
          <div className="relative border border-dashed rounded-md mb-4 cursor-pointer hover:opacity-80 duration-300 overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-1/2 flex flex-col">
              <span>Thêm hình ảnh</span>
              <div className="flex justify-center">
                <div
                  className="bg-black p-2 rounded-full hover:bg-[#464141] duration-300 cursor-pointer"
                  onClick={() => setIsOpenModalAddImage(true)}
                >
                  <PlusIcon color='white' />
                </div>
              </div>
            </div >
            <img src="/default.jpg" alt="default" className="m-auto" />
          </div >
        )}
      </section>
      <Modal
        title="Thêm hình ảnh"
        open={isOpenModalAddImage}
        onCancel={() => setIsOpenModalAddImage(false)}
        footer={null}
      >
        <div>
          <div className="flex justify-between">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                setImage(file);
              }}
              className="mb-2"
            />
            {image && (
              <div
                className="bg-red-500 p-1 rounded-full hover:bg-red-600 duration-300 cursor-pointer flex items-center justify-center"
                onClick={() => {
                  setImage(null);
                }}
              >
                <MinusIcon title="Xóa hình ảnh" className="cursor-pointer" color='white' />
              </div>
            )}
          </div>
          {image && <Image src={URL.createObjectURL(image)} alt="uploaded" className="m-auto py-4 mb-4" />}
          <Input placeholder='Thêm mô tả' value={description} onChange={(e) => setDescription(e.target.value)} />
          <div className="flex justify-end mt-4 gap-4">
            <Button
              type="primary"
              danger
              onClick={() => {
                setIsOpenModalAddImage(false);
              }}
            >
              Hủy
            </Button>
            <Button
              type="primary"
              onClick={() => {
                setIsOpenModalAddImage(false);
                setThumnail(image)
              }}
            >
              Tải lên
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default Banner