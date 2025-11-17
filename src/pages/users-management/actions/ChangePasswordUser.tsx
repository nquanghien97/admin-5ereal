import { Button, Form, Input, Modal } from 'antd';
import { useState } from 'react';
import type { UserEntity } from '../../../entities/user';
import { changePassword } from '../../../services/users';
import { useNotification } from '../../../hooks/useNotification';

interface ChangePasswordUserProps {
  open: boolean
  onClose: () => void
  user: UserEntity
}

function ChangePasswordUser(props: ChangePasswordUserProps) {
  const { open, onClose, user } = props

  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);
  const notification = useNotification()

  const onFinish = async (data: { password: string, confirmPassword: string }) => {
    setLoading(true)
    try {
      await changePassword({ id: user.id, password: data.password })
      onClose()
      notification.success(`Cập nhật mật khẩu ${user.fullName} thành công`)
    } catch (err) {
      console.log(err)
      notification.error((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      open={open}
      onCancel={onClose}
      className='!p-0 !w-4/6 !top-4'
      footer={false}
    >
      <div className="w-full text-center text-xl uppercase font-bold">Đổi mật khẩu người dùng {user.fullName}</div>
      <div className="p-4">
        <Form form={form} className="flex flex-col gap-6" onFinish={onFinish}>
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

export default ChangePasswordUser