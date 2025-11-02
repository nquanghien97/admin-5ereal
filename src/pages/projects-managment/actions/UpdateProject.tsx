import { Button, Input, Form } from 'antd';
import PlusIcon from '../../../assets/icons/PlusIcon';
import Banner from '../project-section/Banner';
import { useEffect, useState } from 'react';
import type { ProjectsEntity, ProjectsSectionsEntity } from '../../../entities/projects';
import NormalSection from '../project-section/NormalSection';
import TienIch from '../project-section/TienIch';
import ThuVienHinhAnh from '../project-section/ThuVienHinhAnh';
import { useWatch } from 'antd/es/form/Form';
import { getProjects, updateProjects } from '../../../services/projects';
import { buildProjectFormData } from '../../../utils/buildProjectFormData';
import { useParams } from 'react-router-dom';

function UpdateProject() {

  const { id } = useParams()

  const [currentProject, setCurrentProject] = useState<ProjectsEntity>()
  const [thumbnail, setThumbnail] = useState<File | null>(null)
  const [descriptionBanner, setDescriptionBanner] = useState('')
  const [listSections, setListSections] = useState<ProjectsSectionsEntity[]>([]);
  const [listImagesTienIch, setListImagesTienIch] = useState<File[]>([])
  const [listImagesThuVienHinhAnh, setListImagesThuVienHinhAnh] = useState<File[]>([])


  const [form] = Form.useForm()

  useEffect(() => {
    (async () => {
      const res = await getProjects(Number(id))
      const currentProject = res.data.project as ProjectsEntity
      setCurrentProject(currentProject)
      form.setFieldValue('name', currentProject.name)
      form.setFieldValue('fullName', currentProject.fullName)
      form.setFieldValue('location', currentProject.location)
      form.setFieldValue('totalArea', currentProject.totalArea)
      form.setFieldValue('floorHeightMax', currentProject.floorHeightMax)
      form.setFieldValue('floorHeightMin', currentProject.floorHeightMin)
      form.setFieldValue('type', currentProject.type)
      form.setFieldValue('constructionRate', currentProject.constructionRate)
      form.setFieldValue('numberOfUnits', currentProject.numberOfUnits)
      form.setFieldValue('investor', currentProject.investor)

      setListImagesTienIch(currentProject.project_images.filter(img => img.type === 'TIEN_ICH').map(img => {
        return new File([], import.meta.env.VITE_API_URL + img.imageUrl)
      }))
      form.setFieldValue('description_tien_ich', currentProject.project_sections.find(img => img.type === 'TIEN_ICH')?.description || '')
      
      setListImagesThuVienHinhAnh(currentProject.project_images.filter(img => img.type === 'THU_VIEN_HINH_ANH').map(img => {
        return new File([], import.meta.env.VITE_API_URL + img.imageUrl)
      }))
      form.setFieldValue('description_thu_vien_hinh_anh', currentProject.project_sections.find(img => img.type === 'THU_VIEN_HINH_ANH')?.description || '')
      setListSections(currentProject.project_sections)
      setCurrentProject(res.data.project)
    })()
  }, [form, id])

  const dataTienIch = listImagesTienIch.map((data, index) => (
    {
      image: data,
      type: 'TIEN_ICH',
      description: form.getFieldValue('description_tien_ich'),
      orderIndex: index + 1,
      imageKey: `tienIchImage_${index}`
    }
  ))

  const dataThuVienHinhAnh = listImagesThuVienHinhAnh.map((data, index) => (
    {
      image: data,
      type: 'THU_VIEN_HINH_ANH',
      description: form.getFieldValue('description_thu_vien_hinh_anh'),
      orderIndex: index + 1,
      imageKey: `thuVienImage_${index}`
    }
  ))

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (data: any) => {
    try {
      const submitData = {
        ...data,
        descriptionBanner,
        thumbnail,
        listSections: listSections.map((s, index) => ({
          ...s,
          imageKey: `sectionImage_${index}`
        })),
        dataTienIch,
        dataThuVienHinhAnh
      }
      const formData = buildProjectFormData(submitData)
      await updateProjects(Number(id), formData)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="py-4">
      <h1 className="text-center mb-4 text-4xl font-semibold">Cập nhật dự án</h1>
      <Form form={form} onFinish={onSubmit}>
        <div className="fixed top-2 right-2 z-[100]">
          <Button type="primary" htmlType='submit'>Lưu dự án</Button>
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
        <div>
          <Banner
            name={useWatch('name', form)}
            setThumnail={setThumbnail}
            thumbnail={thumbnail}
            setDescription={setDescriptionBanner}
            description={descriptionBanner}
            currentProject={currentProject}
            setCurrentProject={setCurrentProject}
          />
          <div className="max-w-7xl mx-auto p-4 border border-dashed mb-8">
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
          <div className="mb-8">
            {listSections.filter(section => section.type === 'NORMAL').map((section, index) => (
              <NormalSection
                key={index + 1}
                orderIndex={index + 1}
                onRemoveSection={() => setListSections(prev => prev.filter((_, i) => i !== index))}
                dataSections={section}
                setListSections={setListSections}
              />
            ))}
            <div className="flex justify-center">
              <div
                className="w-10 h-10 bg-amber-500 rounded-md cursor-pointer flex items-center justify-center hover:opacity-80 duration-300 text-white"
                onClick={() =>
                  setListSections(prev => [
                    ...prev,
                    {
                      orderIndex: prev.length + 1,
                      type: 'NORMAL',
                      projectId: currentProject?.id ?? 0,
                      id: 0,
                      title: '',
                      description: ''
                    } as ProjectsSectionsEntity
                  ])
                }
              >
                <PlusIcon title="Thêm section" />
              </div>
            </div>
          </div>

          <TienIch
            listImagesTienIch={listImagesTienIch}
            setListImagesTienIch={setListImagesTienIch}
          />

          <ThuVienHinhAnh
            listImagesThuVienHinhAnh={listImagesThuVienHinhAnh}
            setListImagesThuVienHinhAnh={setListImagesThuVienHinhAnh}
          />
        </div>
      </Form>
    </div>
  )
}

export default UpdateProject