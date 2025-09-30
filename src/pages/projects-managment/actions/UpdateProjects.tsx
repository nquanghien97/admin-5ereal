import { Button, Form, Input, Modal, Image } from "antd";
import { getProjects, updateProjects, uploadImageProjects } from "../../../services/projects";
import { useEffect, useRef, useState } from "react";
import type { ProjectsEntity } from "../../../entities/projects";
import { useNotification } from "../../../hooks/useNotification";
import { Editor } from "@tinymce/tinymce-react";
import { useNavigate } from "react-router-dom";
import type { Editor as TinyMCEEditor } from "tinymce";

interface EditProjectsProps {
  open: boolean;
  onClose: () => void;
  id: number
  setRefreshKey: React.Dispatch<React.SetStateAction<boolean>>
}

interface FormValues {
  name: string;
  location: string;
  totalArea: string;
  investor: string;
  floorHeightMin: string;
  constructionRate: string;
  floorHeightMax: string;
  numberOfUnits: string;
  type: string;
}

interface BlobInfo {
  blob(): Blob;
  filename(): string;
  base64(): string;
}

type UploadSuccessCallback = (url: string) => void;
type UploadFailureCallback = (message: string, options?: { remove?: boolean }) => void;

function UpdateProjects(props: EditProjectsProps) {
  const { open, onClose, id, setRefreshKey } = props;

  const editorRef = useRef<TinyMCEEditor | null>(null);

  const [form] = Form.useForm();

  const [file, setFile] = useState<File>();
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [dataProjects, setDataProjects] = useState<ProjectsEntity>()

  const notification = useNotification();
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      const res = await getProjects(id)
      const data = res.data.data as ProjectsEntity
      setDataProjects(res.data.data)
      form.setFieldsValue({
        name: data.name,
        location: data.location,
        totalArea: data.totalArea,
        investor: data.investor,
        constructionRate: data.constructionRate,
        floorHeightMin: data.floorHeightMin,
        floorHeightMax: data.floorHeightMax,
        numberOfUnits: data.numberOfUnits,
        type: data.type,
      });
    })()
  }, [form, id]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target || !e.target.files) return;
    const newFiles = e.target.files[0]
    try {
      setFile(newFiles)
    } catch (err) {
      console.log(err)
    }
  }

  const onFinish = async (data: FormValues) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('location', data.location);
    formData.append('totalArea', data.totalArea);
    formData.append('investor', data.investor);
    formData.append('constructionRate', data.constructionRate);
    formData.append('floorHeightMin', data.floorHeightMin);
    formData.append('floorHeightMax', data.floorHeightMax);
    formData.append('numberOfUnits', data.numberOfUnits);
    formData.append('type', data.type);
    formData.append('content', content);
    formData.append('file', file!)
    try {
      await updateProjects(id, formData)
      notification.success('Sửa Dự án thành công')
      onClose();
      setRefreshKey(pre => !pre)
    } catch (err) {
      if (err instanceof Error) {
        if (err.message === "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.") {
          navigate('/login')
          notification.error(err.message)
        } else {
          notification.error('Sửa Dự án thất bại')
        }
      }
    } finally {
      setLoading(false);
    }
  }
  if (!dataProjects) return;

  return (
    <Modal
      open={open}
      onCancel={onClose}
      className='!p-0 !w-4/6 !top-4'
      footer={false}
    >
      <div className="w-full text-center p-3 h-[60px] leading-[36px] bg-[#84571B] rounded-t-lg uppercase font-bold">Xem Bản tin</div>
      <div className="p-4">
        <Form form={form} className="flex flex-col gap-6" onFinish={onFinish}>
          <div className="flex items-center h-[40px]">
            <p className="w-[120px] text-left text-[#84571B]">Tên dự án</p>
            <Form.Item
              className="!mb-0 w-full"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Trường này là bắt buộc"
                },
              ]}
            >
              <Input className="py-2" />
            </Form.Item>
          </div>
          <div className="flex items-center h-[40px]">
            <p className="w-[120px] text-left text-[#84571B]">Vị trí</p>
            <Form.Item
              className="!mb-0 w-full"
              name="location"
              rules={[
                {
                  required: true,
                  message: "Trường này là bắt buộc"
                },
              ]}
            >
              <Input className="py-2" />
            </Form.Item>
          </div>
          <div className="flex items-center h-[40px]">
            <p className="w-[120px] text-left text-[#84571B]">Tổng diện tích</p>
            <Form.Item
              className="!mb-0 w-full"
              name="totalArea"
              rules={[
                {
                  required: true,
                  message: "Trường này là bắt buộc"
                },
              ]}
            >
              <Input className="py-2" />
            </Form.Item>
          </div>
          <div className="flex items-center h-[40px]">
            <p className="w-[120px] text-left text-[#84571B]">Mật độ xây dựng</p>
            <Form.Item
              className="!mb-0 w-full"
              name="constructionRate"
              rules={[
                {
                  required: true,
                  message: "Trường này là bắt buộc"
                },
              ]}
            >
              <Input className="py-2" />
            </Form.Item>
          </div>
          <div className="flex items-center h-[40px]">
            <p className="w-[120px] text-left text-[#84571B]">Số tầng thấp nhất</p>
            <Form.Item
              className="!mb-0 w-full"
              name="floorHeightMin"
              rules={[
                {
                  required: true,
                  message: "Trường này là bắt buộc"
                },
              ]}
            >
              <Input className="py-2" />
            </Form.Item>
          </div>
          <div className="flex items-center h-[40px]">
            <p className="w-[120px] text-left text-[#84571B]">Số tầng cao nhất</p>
            <Form.Item
              className="!mb-0 w-full"
              name="floorHeightMax"
              rules={[
                {
                  required: true,
                  message: "Trường này là bắt buộc"
                },
              ]}
            >
              <Input className="py-2" />
            </Form.Item>
          </div>
          <div className="flex items-center h-[40px]">
            <p className="w-[120px] text-left text-[#84571B]">Loại hình BĐS</p>
            <Form.Item
              className="!mb-0 w-full"
              name="type"
              rules={[
                {
                  required: true,
                  message: "Trường này là bắt buộc"
                },
              ]}
            >
              <Input className="py-2" />
            </Form.Item>
          </div>
          <div className="flex items-center h-[40px]">
            <p className="w-[120px] text-left text-[#84571B]">Tổng số căn</p>
            <Form.Item
              className="!mb-0 w-full"
              name="numberOfUnits"
              rules={[
                {
                  required: true,
                  message: "Trường này là bắt buộc"
                },
              ]}
            >
              <Input className="py-2" />
            </Form.Item>
          </div>
          <div className="flex items-center h-[40px]">
            <p className="w-[120px] text-left text-[#84571B]">Tên chủ đầu tư</p>
            <Form.Item
              className="!mb-0 w-full"
              name="investor"
              rules={[
                {
                  required: true,
                  message: "Trường này là bắt buộc"
                },
              ]}
            >
              <Input className="py-2" />
            </Form.Item>
          </div>
          <div className="flex items-center flex-col">
            <div className="flex items-center w-full h-full">
              <p className="w-[120px] text-left text-[#84571B]">Hình ảnh thumbnail</p>
              <Form.Item
                className="!mb-0 w-full"
                name="images"
              >
                <Input type="file" className="py-2" onChange={onFileChange} />
              </Form.Item>
            </div>
            {file ? (
              <div className="flex flex-wrap justify-center w-full py-4 gap-4">
                <Image.PreviewGroup
                >
                  <Image className="border-2 m-auto cursor-pointer" width={200} src={URL.createObjectURL(file)} alt="preview avatar" />
                </Image.PreviewGroup>
              </div>
            ) : (
              <div className="flex flex-wrap justify-center w-full py-4 gap-4 eee">
                <Image.PreviewGroup
                >
                  <Image className="border-2 m-auto cursor-pointer" width={200} src={`${import.meta.env.VITE_API_URL}${dataProjects.thumbnailUrl}`} alt="preview avatar" />
                </Image.PreviewGroup>
              </div>
            )}
          </div>
          <div className="flex items-center">
            <p className="w-[106px] text-left text-[#84571B]">Nội dung</p>
            <Editor
              apiKey="hkoepxco9p2gme5kius6axtlk3n83yberu5a59m56l7dhgn3"
              value={content}
              onEditorChange={(newContent) => setContent(newContent)}
              init={{
                height: 300,
                width: 1000,
                menubar: false,
                extended_valid_elements: "iframe[src|frameborder|style|scrolling|class|width|height|name|align]",
                valid_elements: '*[*]',
                plugins: [
                  'advlist autolink lists link image charmap print preview anchor',
                  'searchreplace visualblocks code fullscreen',
                  'insertdatetime media paste code help wordcount textcolor',
                  'table',
                  'media',
                  'image'
                  // 'mediaembed'
                ],
                toolbar:
                  'undo redo | formatselect | bold italic backcolor | ' +
                  'alignleft aligncenter alignright alignjustify | ' +
                  'bullist numlist outdent indent | table | forecolor | removeformat | media |image',
                setup: (editor: { on: (arg0: string, arg1: () => void) => void; setContent: (arg0: string) => void; }) => {
                  editor.on('init', () => {
                    editor.setContent(dataProjects?.content)
                  })
                },
                images_upload_handler: async (blobInfo: BlobInfo, success: UploadSuccessCallback, failure: UploadFailureCallback) => {
                  try {
                    const base64Src = `data:${blobInfo.blob().type};base64,${blobInfo.base64()}`;

                    const formData = new FormData();
                    formData.append('file', blobInfo.blob(), blobInfo.filename());

                    const res = await uploadImageProjects(formData);
                    const data = res.data;
                    const imageUrl = `${import.meta.env.VITE_API_URL}${data.url}`;

                    // MANUAL REPLACEMENT nếu success() không hoạt động
                    if (editorRef.current) {
                      const editor = editorRef.current;
                      const currentContent = editor.getContent();

                      // Thay thế base64 bằng URL
                      const updatedContent = currentContent.replace(base64Src, imageUrl);

                      if (updatedContent !== currentContent) {
                        console.log('Manually replacing base64 with URL');
                        editor.setContent(updatedContent);
                        setContent(updatedContent);
                      }
                    }

                    // Vẫn gọi success để TinyMCE biết upload thành công
                    success(imageUrl);
                  } catch (err) {
                    failure('Upload failed: ' + (err as Error).message);
                  }
                },
                paste_data_images: true,
                automatic_uploads: true,        // Tự động upload
                images_reuse_filename: true,    // Giữ tên file gốc
                images_upload_url: false,
              }}
            />
          </div>
          <div className="flex justify-evenly">
            <Button type="primary" danger onClick={onClose}>Hủy</Button>
            <Button type="primary" htmlType="submit" loading={loading}>Xác nhận</Button>
          </div>
        </Form>
      </div>
    </Modal>
  )
}

export default UpdateProjects