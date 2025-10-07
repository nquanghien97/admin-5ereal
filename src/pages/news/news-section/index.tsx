import { Button, Image, Input, Modal } from 'antd'
import MinusIcon from '../../../assets/icons/MinusIcon'
import type { NewsSectionEntity } from '../../../entities/news';
import { Editor } from '@tinymce/tinymce-react';
import PlusIcon from '../../../assets/icons/PlusIcon';
import { useState } from 'react';
import EditIcon from '../../../assets/icons/EditIcon';

interface NewsSectionProps {
  orderIndex: number;
  onRemoveSection?: () => void;
  dataSections?: NewsSectionEntity;
  setListSections: React.Dispatch<React.SetStateAction<NewsSectionEntity[]>>
}

function NewsSection({ orderIndex, onRemoveSection, dataSections, setListSections }: NewsSectionProps) {

  const [isOpenModalAddImage, setIsOpenModalAddImage] = useState(false);
  const [image, setImage] = useState<File | null>(null);

  return (
    <>
      <section className="max-w-4xl m-auto px-4 mb-8 relative">
        <div className="flex justify-center absolute -top-0 -right-10">
          <div
            className="w-10 h-10 bg-red-600 rounded-md cursor-pointer flex items-center justify-center hover:opacity-80 duration-300 text-white"
            onClick={onRemoveSection}
          >
            <MinusIcon title="Xóa section" />
          </div>
        </div>
        {image ? (
          <div className="relative">
            <img src={URL.createObjectURL(image)} alt="uploaded" className="m-auto" />
            <div
              className="absolute top-2 right-2 w-8 h-8 bg-black p-1 rounded-full hover:bg-[#464141] duration-300 cursor-pointer flex items-center justify-center"
              onClick={() => setIsOpenModalAddImage(true)}
            >
              <EditIcon color='white' />
            </div>
          </div>
        ) : (
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
        )
        }
        <figcaption className="text-sm text-gray-500 my-2 text-center">
          <p>{dataSections?.caption}</p>
        </figcaption>
        <div className="w-full">
          <p className="mb-2">Nội dung section</p>
          <Editor
            apiKey="hkoepxco9p2gme5kius6axtlk3n83yberu5a59m56l7dhgn3"
            value={dataSections?.content}
            onEditorChange={(newContent) => {
              setListSections(prev => {
                const newList = [...prev];
                newList[orderIndex - 1] = { ...newList[orderIndex - 1], content: newContent };
                return newList;
              });
            }}
            init={{
              height: 240,
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
      </section >
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
            />
            {image && (
              <div
                className="bg-red-500 p-1 rounded-full hover:bg-red-600 duration-300 cursor-pointer flex items-center justify-center"
                onClick={() => {
                  setImage(null);
                  setListSections(prev => {
                    const newList = [...prev];
                    newList[orderIndex - 1] = { ...newList[orderIndex - 1], image: undefined, caption: '' };
                    return newList;
                  });
                }}
              >
                <MinusIcon title="Xóa hình ảnh" className="cursor-pointer" color='white' />
              </div>
            )}
          </div>
          {image && <Image src={URL.createObjectURL(image)} alt="uploaded" className="m-auto py-4" />}
          {image && (
            <Input
              placeholder="Chú thích hình ảnh"
              value={dataSections?.caption}
              onChange={(e) => {
                setListSections(prev => {
                  const newList = [...prev];
                  newList[orderIndex - 1] = { ...newList[orderIndex - 1], caption: e.target.value };
                  return newList;
                });
              }}
            />
          )}
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
            {image && (
              <Button
                type="primary"
                onClick={() => {
                  if (image) {
                    setListSections(prev => {
                      const newList = [...prev];
                      newList[orderIndex - 1] = { ...newList[orderIndex - 1], image };
                      return newList;
                    });
                    setIsOpenModalAddImage(false);
                  }
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

export default NewsSection