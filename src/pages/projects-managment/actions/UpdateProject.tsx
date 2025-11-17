import { Button, Input, Form, Image } from 'antd';
import { useEffect, useState } from 'react';
import type { CreateProjectDTO, ProjectSectionImageEntity, SECTION_TYPE } from '../../../entities/projects';
import { useNotification } from '../../../hooks/useNotification';
import PlusIcon from '../../../assets/icons/PlusIcon';
import ImagesManagement from '../../../components/imagesManagement';
import NormalSection from '../project-section/NormalSection';
import GallerySection from '../project-section/GallerySection';
import { PictureOutlined } from '@ant-design/icons'
import type { MediaDTO } from '../../../entities/media';
import { getProjects, updateProjects } from '../../../services/projects';
import { useParams } from 'react-router-dom';

const initValues: CreateProjectDTO = {
  name: '',
  fullName: '',
  location: '',
  totalArea: 0,
  constructionRate: 0,
  floorHeightMin: 0,
  floorHeightMax: 0,
  type: '',
  numberOfUnits: 0,
  investor: '',
  thumbnail: null,
  thumbnailId: -1,
  backgroundOverviewId: null,
  sections: []
}

type ImageFieldType =
  | 'thumbnail'
  | 'backgroundOverview'
  | { type: 'NORMAL', sectionIndex: number }
  | { type: 'TIEN_ICH', sectionIndex: number }
  | { type: 'THU_VIEN_HINH_ANH', sectionIndex: number }


function UpdateProject() {
  const { id } = useParams()

  const [data, setData] = useState<CreateProjectDTO>(initValues);
  const [openImagesManagement, setOpenImagesManagement] = useState(false)
  const [currentImageField, setCurrentImageField] = useState<ImageFieldType | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isMultiple, setIsMultiple] = useState(false)

  const notification = useNotification();
  // const navigate = useNavigate();
  const [form] = Form.useForm<CreateProjectDTO>();

  useEffect(() => {
    (async () => {
      const res = await getProjects(Number(id))
      const project = res.data.project as CreateProjectDTO
      setData(project)
      form.setFieldsValue({
        name: project.name,
        fullName: project.fullName,
        location: project.location,
        totalArea: project.totalArea,
        floorHeightMax: project.floorHeightMax,
        floorHeightMin: project.floorHeightMin,
        type: project.type,
        constructionRate: project.constructionRate,
        numberOfUnits: project.numberOfUnits,
        investor: project.investor,
      })
    })()
  }, [form, id])

  const openImageManager = (field: ImageFieldType, isMultiple: boolean) => {
    setIsMultiple(isMultiple)
    setCurrentImageField(field)
    setOpenImagesManagement(true)
  }

  const handleSelectImage = (image: MediaDTO | MediaDTO[]) => {
    if (!currentImageField) return

    // Thumbnail - single image
    if (currentImageField === 'thumbnail') {
      const selectedImage = Array.isArray(image) ? image[0] : image
      setData(prev => ({ ...prev, thumbnail: selectedImage }))
    }
    // Section images - có thể single hoặc multiple
    else if (typeof currentImageField === 'object') {
      const { type, sectionIndex } = currentImageField

      setData(prev => ({
        ...prev,
        sections: prev.sections.map((section, idx) => {
          if (idx !== sectionIndex) return section

          // Convert image thành array
          const selectedImages = Array.isArray(image) ? image : [image]
          const images: ProjectSectionImageEntity[] = selectedImages.map(s => ({
            sectionId: section.orderIndex,
            imageId: s.id,
            orderIndex: section.orderIndex,
            image: s,
          }))

          // Xử lý theo type
          if (type === 'NORMAL') {
            // Replace image (single)
            return {
              ...section,
              section_images: [
                // ...section.section_images,
                ...images
              ]
            }
          }
          else if (type === 'TIEN_ICH') {
            // Append images (multiple)
            return {
              ...section,
              section_images: [
                ...section.section_images,
                ...images
              ]
            }
          }
          else if (type === 'THU_VIEN_HINH_ANH') {
            // Append images (multiple)
            return {
              ...section,
              section_images: [
                ...section.section_images,
                ...images
              ]
            }
          }
          return section
        })
      }))
    }

    setOpenImagesManagement(false)
    setCurrentImageField(null)
  }

  const addSection = (type: SECTION_TYPE) => {
    setData(prev => ({
      ...prev,
      sections: [
        ...prev.sections,
        {
          orderIndex: prev.sections.length + 1,
          content: '',
          caption: '',
          type,
          section_images: [],
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

  const onSubmit = async (dataForm: CreateProjectDTO) => {
    setIsSubmitting(true)
    try {
      if (!data.thumbnail) {
        notification.warning('Thumnail là bắt buộc!')
        return;
      }
      await updateProjects(Number(id), { ...data, ...dataForm, thumbnailId: data.thumbnail.id })
      notification.success('Cập nhật dự án thành công')
      // navigate('/quan-ly-du-an')
    } catch (err) {
      console.log(err)
      notification.error('có lỗi xảy ra')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <div className="py-4 bg-custom">
        <h1 className="text-center mb-4 text-4xl font-semibold">Cập nhật dự án</h1>
        <Form form={form} onFinish={onSubmit}>
          <div className="fixed top-16 right-4 z-[100]">
            <Button loading={isSubmitting} type="primary" htmlType='submit'>Lưu dự án</Button>
          </div>
          <Form.Item
            label="Tên dự án"
            name="name"
            className="!px-4"
            rules={[
              {
                required: true,
                message: "Trường này là bắt buộc"
              }
            ]}
          >
            <Input
              placeholder="Tên dự án"
            />
          </Form.Item>
          <div className="flex-1 mb-4 px-4">
            <p className="mb-2 font-medium">Ảnh thumbnail</p>
            <div className="h-[600px]">
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
                      onClick={() => openImageManager('thumbnail', false)}
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
                  onClick={() => openImageManager('thumbnail', false)}
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
          <div className="px-4 max-w-7xl mx-auto">
            <div className="p-4 border border-dashed mb-8">
              <h2 className="text-3xl md:text-5xl font-[800] text-[#0F3E5A] text-center mb-4">TỔNG QUAN DỰ ÁN</h2>
              <Form.Item
                label="Tên pháp lý"
                className="!px-4"
                name="fullName"
                rules={[
                  {
                    required: true,
                    message: "Trường này là bắt buộc"
                  }
                ]}
              >
                <Input
                  placeholder="Tên pháp lý"
                />
              </Form.Item>
              <ul className="text-[#003c7a] grid grid-cols-2">
                <li className="mb-4 lg:mb-2 max-lg:flex max-lg:items-center gap-2">
                  <Form.Item
                    label="Vị trí"
                    className="!px-4"
                    name="location"
                    rules={[
                      {
                        required: true,
                        message: "Trường này là bắt buộc"
                      }
                    ]}
                  >
                    <Input
                      placeholder="Vị trí"
                    />
                  </Form.Item>
                </li>
                <li className="mb-4 lg:mb-2 max-lg:flex max-lg:items-center gap-2">
                  <Form.Item
                    label="Tổng diện tích"
                    className="!px-4"
                    name="totalArea"
                    rules={[
                      {
                        required: true,
                        message: "Trường này là bắt buộc"
                      }
                    ]}
                  >
                    <Input
                      placeholder="Tổng diện tích"
                      type='number'
                    />
                  </Form.Item>
                </li>
                <li className="mb-4 lg:mb-2 max-lg:flex max-lg:items-center gap-2">
                  <Form.Item
                    label="Tầng cao nhất"
                    className="!px-4"
                    name="floorHeightMax"
                    rules={[
                      {
                        required: true,
                        message: "Trường này là bắt buộc"
                      }
                    ]}
                  >
                    <Input
                      placeholder="Tầng cao nhất"
                      type='number'
                    />
                  </Form.Item>
                </li>
                <li className="mb-4 lg:mb-2 max-lg:flex max-lg:items-center gap-2">
                  <Form.Item
                    label="Tầng thấp nhất"
                    className="!px-4"
                    name="floorHeightMin"
                    rules={[
                      {
                        required: true,
                        message: "Trường này là bắt buộc"
                      }
                    ]}
                  >
                    <Input
                      placeholder="Tầng thấp nhất"
                      type='number'
                    />
                  </Form.Item>
                </li>
                <li className="mb-4 lg:mb-2 max-lg:flex max-lg:items-center gap-2">
                  <Form.Item
                    label="Loại hình"
                    className="!px-4"
                    name="type"
                    rules={[
                      {
                        required: true,
                        message: "Trường này là bắt buộc"
                      }
                    ]}
                  >
                    <Input
                      placeholder="Loại hình"
                    />
                  </Form.Item>
                </li>
                <li className="mb-4 lg:mb-2 max-lg:flex max-lg:items-center gap-2">
                  <Form.Item
                    label="Mật độ xây dựng"
                    className="!px-4"
                    name="constructionRate"
                    rules={[
                      {
                        required: true,
                        message: "Trường này là bắt buộc"
                      }
                    ]}
                  >
                    <Input
                      placeholder="Mật độ xây dựng"
                      type='number'
                    />
                  </Form.Item>
                </li>
                <li className="mb-4 lg:mb-2 max-lg:flex max-lg:items-center gap-2">
                  <Form.Item
                    label="Tổng số căn"
                    className="!px-4"
                    name="numberOfUnits"
                    rules={[
                      {
                        required: true,
                        message: "Trường này là bắt buộc"
                      }
                    ]}
                  >
                    <Input
                      placeholder="Tổng số căn"
                      type='number'
                    />
                  </Form.Item>
                </li>
                <li className="mb-4 lg:mb-2 max-lg:flex max-lg:items-center gap-2">
                  <Form.Item
                    label="Chủ đầu tư"
                    className="!px-4"
                    name="investor"
                    rules={[
                      {
                        required: true,
                        message: "Trường này là bắt buộc"
                      }
                    ]}
                  >
                    <Input
                      placeholder="Chủ đầu tư"
                    />
                  </Form.Item>
                </li>
              </ul>
            </div>
            <ImagesManagement
              open={openImagesManagement}
              onClose={() => {
                setOpenImagesManagement(false)
                setCurrentImageField(null)
              }}
              multiple={isMultiple}
              onUploadSuccess={handleSelectImage}
            />
            <div className="px-8 border border-dashed mb-8">
              {(data.sections.filter(s => s.type === 'NORMAL').length > 0) && (
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4">Các section nội dung</h2>
                  {data.sections.filter(s => s.type === 'NORMAL').map((section, index) => {
                    const realIndex = data.sections.findIndex(s => s === section);
                    return (
                      <NormalSection
                        key={realIndex}
                        orderNormalSection={index}
                        orderIndex={realIndex + 1}
                        onRemoveSection={() => removeSection(index)}
                        dataSections={section}
                        setData={setData}
                        onSelectImage={() => openImageManager({
                          type: 'NORMAL',
                          sectionIndex: realIndex
                        }, false)}
                      />
                    )
                  })}
                </div>
              )}

              <div className="flex justify-center py-4">
                <div
                  className="w-12 h-12 bg-amber-500 rounded-md cursor-pointer flex items-center justify-center hover:bg-amber-600 transition-colors duration-300 text-white shadow-md"
                  onClick={() => addSection('NORMAL')}
                  title="Thêm section"
                >
                  <PlusIcon width={24} height={24} />
                </div>
              </div>
            </div>

            {/* section tiện ích */}
            <div className="p-8 border border-dashed mb-8">
              <h2 className="text-2xl font-semibold mb-4">Section Tiện ích</h2>
              <div
                className="mb-4 border-2 border-dashed border-gray-300 rounded-lg p-8 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 inline-block"
                onClick={() => {
                  // Kiểm tra xem đã có section TIEN_ICH chưa
                  const tienIchSectionIndex = data.sections.findIndex(s => s.type === 'TIEN_ICH');

                  if (tienIchSectionIndex === -1) {
                    // Nếu chưa có → thêm mới
                    addSection('TIEN_ICH');
                    // Sau khi thêm, mở image manager với index mới
                    setTimeout(() => {
                      openImageManager({
                        type: 'TIEN_ICH',
                        sectionIndex: data.sections.length // sẽ là index mới sau khi thêm
                      }, true);
                    }, 0);
                  } else {
                    // Nếu đã có → mở bình thường
                    openImageManager({
                      type: 'TIEN_ICH',
                      sectionIndex: tienIchSectionIndex
                    }, true);
                  }
                }}
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
              {(data.sections.length > 0) && (
                <div className="">
                  {data.sections.filter(s => s.type === 'TIEN_ICH').map((section, index) => (
                    <>
                      <div className="mb-2">
                        <Input
                          placeholder='Tiêu đề'
                          value={section.title || ''}
                          onChange={(e) => {
                            setData((prev) => ({
                              ...prev,
                              sections: prev.sections.map((section) =>
                                section.type === 'TIEN_ICH'
                                  ? { ...section, title: e.target.value }
                                  : section
                              )
                            }))
                          }}
                        />
                      </div>
                      <GallerySection
                        key={index}
                        dataSections={section}
                        setData={setData}
                        type='TIEN_ICH'
                      />
                    </>
                  ))}
                </div>
              )}
            </div>

            {/* section thư viện hình ảnh */}
            <div className="p-8 border border-dashed">
              <h2 className="text-2xl font-semibold mb-4">Section Thư viện hình ảnh</h2>
              <div
                className="mb-4 border-2 border-dashed border-gray-300 rounded-lg p-8 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 inline-block"
                onClick={() => {
                  // Kiểm tra xem đã có section THU_VIEN_HINH_ANH chưa
                  const tienIchSectionIndex = data.sections.findIndex(s => s.type === 'THU_VIEN_HINH_ANH');

                  if (tienIchSectionIndex === -1) {
                    // Nếu chưa có → thêm mới
                    addSection('THU_VIEN_HINH_ANH');
                    // Sau khi thêm, mở image manager với index mới
                    setTimeout(() => {
                      openImageManager({
                        type: 'THU_VIEN_HINH_ANH',
                        sectionIndex: data.sections.length // sẽ là index mới sau khi thêm
                      }, true);
                    }, 0);
                  } else {
                    // Nếu đã có → mở bình thường
                    openImageManager({
                      type: 'THU_VIEN_HINH_ANH',
                      sectionIndex: tienIchSectionIndex
                    }, true);
                  }
                }}
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
              {(data.sections.length > 0) && (
                <div className="">
                  {data.sections.filter(s => s.type === 'THU_VIEN_HINH_ANH').map((section, index) => (
                    <>
                      <div className="mb-2">
                        <Input
                          placeholder='Tiêu đề'
                          value={section.title || ''}
                          onChange={(e) => {
                            setData((prev) => ({
                              ...prev,
                              sections: prev.sections.map((section) =>
                                section.type === 'THU_VIEN_HINH_ANH'
                                  ? { ...section, title: e.target.value }
                                  : section
                              )
                            }))
                          }}
                        />
                      </div>
                      <GallerySection
                        key={index}
                        dataSections={section}
                        setData={setData}
                        type='THU_VIEN_HINH_ANH'
                      />
                    </>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Form>
      </div>

    </>
  )
}

export default UpdateProject