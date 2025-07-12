import { Button, Form, Input, Modal, Image } from "antd";
import { getNews, updateNews } from "../../../services/news";
import { useEffect, useState } from "react";
import type { NewsEntity } from "../../../entities/News";
import { useNotification } from "../../../hooks/useNotification";
import { Editor } from "@tinymce/tinymce-react";
import { useNavigate } from "react-router-dom";

interface EditNewsProps {
  open: boolean;
  onClose: () => void;
  id: number
  setRefreshKey: React.Dispatch<React.SetStateAction<boolean>>
}

interface FormValues {
  title: string;
}

function UpdateNews(props: EditNewsProps) {
  const { open, onClose, id, setRefreshKey } = props;

  const [form] = Form.useForm();

  const [file, setFile] = useState<File>();
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [dataNews, setDataNews] = useState<NewsEntity>()

  const notification = useNotification();
  const navigate = useNavigate();
  useEffect(() => {
    (async() => {
      const res = await getNews(id)
      const data = res.data.data as NewsEntity
      setDataNews(res.data.data)
      form.setFieldsValue({
        title: data.title,
      });
    })()
  }, [form, id]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target || !e.target.files) return;
    const newFiles = e.target.files[0]
    try {
      setFile(newFiles)
    } catch(err) {
      console.log(err)
    }
  }

  const onFinish = async (data: FormValues) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('content', content);
    formData.append('file', file!)
    try {
      await updateNews(id, formData)
      notification.success('Sửa Bản tin thành công')
      onClose();
      setRefreshKey(pre => !pre)
    } catch (err) {
      if (err instanceof Error) {
        if (err.message === "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.") {
          navigate('/login')
          notification.error(err.message)
        } else {
          notification.error('Sửa Bản tin thất bại')
        }
      }
    } finally {
      setLoading(false);
    }
  }
  if(!dataNews) return;

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
            <p className="w-[120px] text-left text-[#84571B]">Tiêu đề</p>
            <Form.Item
              className="!mb-0 w-full"
              name="title"
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
              <p className="w-[120px] text-left text-[#84571B]">Hình ảnh</p>
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
                  <Image className="border-2 m-auto cursor-pointer" width={200} src={`${import.meta.env.VITE_API_URL}${dataNews.imageUrl}`} alt="preview avatar" />
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
                height: 400,
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
                ],
                toolbar:
                  'undo redo | formatselect | bold italic backcolor | ' +
                  'alignleft aligncenter alignright alignjustify | ' +
                  'bullist numlist outdent indent | table | forecolor | removeformat | media',
                setup: (editor: { on: (arg0: string, arg1: () => void) => void; setContent: (arg0: string) => void; }) => {
                  editor.on('init', () => {
                    editor.setContent(dataNews?.content)
                  })
                }
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

export default UpdateNews