import { Button, Modal } from "antd";
import { useState } from "react";
import { useNotification } from "../../../hooks/useNotification";
import { useNavigate } from "react-router-dom";
import { deleteUser } from "../../../services/users";
import type { UserEntity } from "../../../entities/user";

interface DeleteUserProps {
  open: boolean;
  onCancel: () => void;
  user: UserEntity;
  setRefreshKey: React.Dispatch<React.SetStateAction<boolean>>
}

function DeleteUser(props: DeleteUserProps) {
  const { open, onCancel, user, setRefreshKey } = props

  const [loading, setLoading] = useState(false);

  const notification = useNotification();
  const navigate = useNavigate();
  const onSubmit = async () => {
    setLoading(true);
    try {
      await deleteUser(user.id)
      notification.success('Xóa thông tin người dùng thành công')
      onCancel();
      setRefreshKey(pre => !pre)
    } catch (err) {
      if (err instanceof Error) {
        if (err.message === "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.") {
          navigate('/login')
          notification.error(err.message)
        } else {
          notification.error('Xóa thông tin người dùng thất bại')
        }
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal
      open={open}
      className='!p-0 !w-1/2'
      onCancel={onCancel}
      footer={false}
      wrapClassName='!p-0'
    >
      <div className="w-full text-center p-3 h-[60px] leading-[36px] bg-[#84571B] rounded-t-lg uppercase font-bold">{`Bạn có chắc chắn muốn xóa ${user.fullName} không?`}</div>
      <div className="flex justify-center gap-12 p-4">
        <Button type="primary" danger onClick={onCancel}>Hủy</Button>
        <Button type="primary" onClick={onSubmit} loading={loading}>Xác nhận</Button>
      </div>
    </Modal>
  )
}

export default DeleteUser