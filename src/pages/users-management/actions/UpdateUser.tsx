import { Button, Form, Input, Modal } from "antd";
import { useState } from "react";
import { useNotification } from "../../../hooks/useNotification";
import { useNavigate } from "react-router-dom";
import {  updateUser } from "../../../services/users";
import type { UserEntity } from "../../../entities/user";

interface UpdateUserProps {
  open: boolean;
  onClose: () => void;
  setRefreshKey: React.Dispatch<React.SetStateAction<boolean>>
  user: UserEntity
}
interface FormValues {
  fullName: string;
  username: string;
  password: string;
}

function UpdateUser(props: UpdateUserProps) {
  const { open, onClose, setRefreshKey, user } = props;

  const [loading, setLoading] = useState<boolean>(false);

  const [form] = Form.useForm();
  const notification = useNotification();
  const navigate = useNavigate()

  const onFinish = async (data: FormValues) => {
    try {
      const dataSubmit = {
        id: user.id,
        fullName: data.fullName,
      }
      setLoading(true);
      await updateUser(dataSubmit)
      notification.success('Cập nhật thông tin thành công')
      onClose();
      setRefreshKey(pre => !pre)
    } catch (err) {
      if (err instanceof Error) {
        if (err.message === "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.") {
          navigate('/login')
          notification.error(err.message)
        } else {
          notification.error('Cập nhật thông tin thất bại')
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
      <div className="w-full text-center p-3 h-[60px] leading-[36px] bg-[#84571B] rounded-t-lg uppercase font-bold">Cập nhật thông tin {user.fullName}</div>
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
              <Input className="py-2" defaultValue={user.fullName} />
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

export default UpdateUser