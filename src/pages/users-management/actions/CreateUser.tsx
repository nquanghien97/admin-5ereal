import { Button, Form, Input, Modal } from "antd";
import { useState } from "react";
import { useNotification } from "../../../hooks/useNotification";
import { useNavigate } from "react-router-dom";
import { createUser } from "../../../services/users";

interface CreateUserProps {
  open: boolean;
  onClose: () => void;
  setRefreshKey: React.Dispatch<React.SetStateAction<boolean>>
}
interface FormValues {
  fullName: string;
  phoneNumber: string;
  password: string;
}

function CreateUser(props: CreateUserProps) {
  const { open, onClose, setRefreshKey } = props;

  const [loading, setLoading] = useState<boolean>(false);

  const [form] = Form.useForm();
  const notification = useNotification();
  const navigate = useNavigate()

  const onFinish = async (data: FormValues) => {
    try {
      const dataSubmit = {
        fullName: data.fullName,
        phoneNumber: data.phoneNumber,
        password: data.password
      }
      setLoading(true);
      await createUser(dataSubmit)
      notification.success('Thêm người dùng thành công')
      onClose();
      setRefreshKey(pre => !pre)
    } catch (err) {
      if (err instanceof Error) {
        if (err.message === "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.") {
          navigate('/login')
          notification.error(err.message)
        } else {
          notification.error('Thêm người dùng thất bại')
        }
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal
      open={open}
      onCancel={onClose}
      className='!p-0 !w-4/6 !top-4'
      footer={false}
    >
      <div className="w-full text-center rounded-t-lg text-xl uppercase font-bold">Thêm Tin tức</div>
      <div className="p-4">
        <Form form={form} className="flex flex-col gap-6" onFinish={onFinish}>
          <div className="flex items-center h-[40px]">
            <p className="w-[120px] text-left text-[#84571B]">Họ tên</p>
            <Form.Item
              className="!mb-0 w-full"
              name="fullName"
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
            <p className="w-[120px] text-left text-[#84571B]">Số điện thoại</p>
            <Form.Item
              className="!mb-0 w-full"
              name="phoneNumber"
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
            <p className="w-[120px] text-left text-[#84571B]">Mật khẩu</p>
            <Form.Item
              className="!mb-0 w-full"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Trường này là bắt buộc"
                },
              ]}
            >
              <Input.Password className="py-2" type="password" />
            </Form.Item>
          </div>
          <div className="flex items-center h-[40px]">
            <p className="w-[120px] text-left text-[#84571B]">Xác nhận mật khẩu</p>
            <Form.Item
              className="!mb-0 w-full"
              name="confirmPassword"
              rules={[
                {
                  required: true,
                  message: "Trường này là bắt buộc"
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Mật khẩu xác nhận không chính xác'));
                  },
                }),
              ]}
            >
              <Input.Password className="py-2" type="password" />
            </Form.Item>
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

export default CreateUser