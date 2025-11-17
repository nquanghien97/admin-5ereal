import { useEffect, useState } from 'react'
import Header from './Header'
import type { TableColumnsType } from 'antd'
import { Button, ConfigProvider, Table } from 'antd'
import CloseIcon from '../../assets/icons/CloseIcon'
import withAuth from '../../hocs/withAuth'
import { formatDate } from '../../utils/formatDate'
import type { UserEntity } from '../../entities/user'
import DeleteUser from './actions/DeleteUser'
import { getUsers } from '../../services/users'
import PlusIcon from '../../assets/icons/PlusIcon'
import CreateUser from './actions/CreateUser'
import EditIcon from '../../assets/icons/EditIcon'
import UpdateUser from './actions/UpdateUser'
import ChangePasswordUser from './actions/ChangePasswordUser'
import ChangePasswordIcon from '../../assets/icons/ChangePasswordIcon'

const roleOptions = {
  STAFF: 'Nhân viên',
  USER: 'Khách hàng'
}

function UsersManagement() {

  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<UserEntity[]>([]);
  const [paging, setPaging] = useState({ page: 1, pageSize: 10, total: 0 });
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(false);
  const [searchForm, setSearchForm] = useState<{ page?: number, pageSize?: number, search?: string }>({
    page: 1,
    pageSize: 10,
    search: '',
  });
  const [user, setUser] = useState<UserEntity>();
  const [isOpenCreateUser, setIsOpenCreateUser] = useState(false);
  const [isOpenUpdateUser, setIsOpenUpdateUser] = useState(false);
  const [isOpenChangePasswordUser, setIsOpenChangePasswordUser] = useState(false);

  const columns: TableColumnsType<UserEntity> = [
    {
      title: "STT",
      key: 1,
      width: 50,
      render(_, __, index) {
        return (paging.page - 1) * paging.pageSize + index + 1;
      },
    },
    {
      title: "Họ tên",
      dataIndex: 'fullName',
      key: 2,
      width: 150
    },
    {
      title: "Số điện thoại",
      dataIndex: 'phoneNumber',
      key: 3,
      width: 150
    },
    {
      title: "Chức vụ",
      dataIndex: "role",
      key: 4,
      render(value: 'STAFF' | 'USER') {
        return roleOptions[value];
      },
      width: 100
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: 4,
      render(value) {
        return formatDate(value)
      },
      width: 100
    },
    {
      title: "Thao tác",
      dataIndex: 14,
      width: 150,
      render(_, user) {
        return (
          <div className="flex flex-col gap-2">
            <div className="flex items-center">
              <Button
                icon={<EditIcon />}
                type="primary"
                className="w-full"
                onClick={() => {
                  setIsOpenUpdateUser(true)
                  setUser(user)
                }}
              >
                <p>Cập nhật</p>
              </Button>
            </div>
            <div className="flex items-center">
              <Button
                icon={<CloseIcon />}
                type="primary"
                danger
                className="w-full"
                onClick={() => {
                  setOpenDeleteModal(true)
                  setUser(user)
                }}
              >
                <p>Xóa</p>
              </Button>
            </div>
            <div className="flex items-center">
              <Button
                icon={<ChangePasswordIcon />}
                type="primary"
                danger
                className="w-full !bg-emerald-600"
                onClick={() => {
                  setIsOpenChangePasswordUser(true)
                  setUser(user)
                }}
              >
                <p>Đổi mật khẩu</p>
              </Button>
            </div>
          </div>
        )
      },
    }
  ]

  useEffect(() => {
    document.title = "Quản lý người dùng"
  }, []);

  useEffect(() => {
    setLoading(true);
    (async () => {
      const res = await getUsers({
        ...searchForm,
        page: paging.page,
        pageSize: paging.pageSize,
      })
      setUsers(res.data.data);
      setPaging(prev => ({ ...prev, total: res.data.paging.total }))
      setLoading(false)
    })()
  }, [paging.page, paging.pageSize, refreshKey, searchForm]);

  const onChangePaging = async (page: number, pageSize: number) => {
    setLoading(true);
    setPaging({ page, pageSize, total: paging.total });
  }

  return (
    <>
      {user && <UpdateUser open={isOpenUpdateUser} onClose={() => setIsOpenUpdateUser(false)} setRefreshKey={setRefreshKey} user={user} />}
      {user && <ChangePasswordUser open={isOpenChangePasswordUser}  onClose={() => setIsOpenChangePasswordUser(false)} user={user} />}
      <CreateUser open={isOpenCreateUser} onClose={() => setIsOpenCreateUser(false)} setRefreshKey={setRefreshKey} />
      <div className="p-4 relative">
        <Header setSearchForm={setSearchForm} setLoading={setLoading} />
        <div className="flex mb-4 items-center">
          <h1 className="text-center flex-1 text-black text-4xl font-semibold">Quản lý người dùng</h1>
          <div
            className="bg-[#84571B] rounded-md cursor-pointer h-full px-4 py-2 flex items-center justify-center hover:opacity-80 duration-300 text-white"
            onClick={() => setIsOpenCreateUser(true)}
          >
            Thêm mới
            <PlusIcon color="white" />
          </div>
        </div>
        <div>
          <ConfigProvider
            theme={{
              token: {
                borderRadius: 8,
              },
              components: {
                Table: {
                  borderColor: "black",
                  headerBg: "#84571B !important",
                  headerColor: "white",
                }
              }
            }}
          >
            <Table
              dataSource={users}
              columns={columns}
              rowHoverable={false}
              rowKey={record => record.id}
              rowClassName={(_, index) => index % 2 === 0 ? 'bg-[#e9e9e9]' : 'bg-white'}
              bordered
              loading={loading}
              pagination={{
                total: paging.total,
                pageSize: paging.pageSize,
                onChange: onChangePaging,
                showSizeChanger: true
              }}
              scroll={{ y: 700 }}
            />
          </ConfigProvider>
        </div>
        {user && <DeleteUser user={user} onCancel={() => setOpenDeleteModal(false)} open={openDeleteModal} setRefreshKey={setRefreshKey} />}
      </div>
    </>
  )
}

const UsersManagementWithAuth = withAuth(UsersManagement)

export default UsersManagementWithAuth