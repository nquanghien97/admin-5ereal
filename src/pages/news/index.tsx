import type { TableColumnsType } from 'antd'
import { Button, Table, ConfigProvider, Image } from 'antd'
import { useEffect, useState } from 'react';
import type { NewsEntity } from '../../entities/news';
import CloseIcon from '../../assets/icons/CloseIcon';
import PlusIcon from '../../assets/icons/PlusIcon';
import DeleteNews from './actions/DeleteNews';
import { getAllNews } from '../../services/news';
import withAuth from '../../hocs/withAuth';
import { formatDate } from '../../utils/formatDate';
import ArticleIcon from '../../assets/icons/ArticleIcon';
import Header from './Header';
import { Link } from 'react-router-dom';

export interface SearchFormType {
  search?: string;
  page?: number;
  pageSize?: number;
}

function News() {

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<NewsEntity[]>([]);
  const [searchForm, setSearchForm] = useState<SearchFormType>({
    page: 1,
    pageSize: 10,
    search: '',
  })
  const [total, setToal] = useState(0);
  const [refreshKey, setRefreshKey] = useState(false);
  const [idNews, setIdNews] = useState(-1);

  useEffect(() => {
    document.title = "Tin tức"
  }, []);

  const columns: TableColumnsType = [
    {
      title: "Thời gian tạo",
      key: 2,
      width: 120,
      render(_, record) {
        return (
          <div>{formatDate(record.createdAt)}</div>
        )
      }
    },
    {
      title: "Tiêu đề",
      key: 2,
      width: 200,
      render(_, record) {
        return (
          <div className="flex items-center gap-4">
            <p>{record.title}</p>
          </div>
        )
      }
    },
    {
      title: "Nội dung",
      key: 3,
      width: 300,
      render(_, record) {
        return (
          <div className="max-w-[300px] overflow-hidden text-ellipsis whitespace-nowrap" dangerouslySetInnerHTML={{ __html: record.summary }} />
        )
      }
    },
    {
      title: "Ảnh thumbnail",
      key: 4,
      width: 200,
      render(_, record) {
        return (
          <div className="flex flex-wrap justify-center w-full py-4 gap-4">
            <Image.PreviewGroup>
              <Image
                src={`${import.meta.env.VITE_API_URL}${record.thumbnail}`}
                alt={record.title}
                className="rounded-md"
                width={160}
                height={160}
              />
            </Image.PreviewGroup>
          </div>
        )
      }
    },
    {
      title: "Thao tác",
      dataIndex: 5,
      width: 200,
      render(_, record) {
        return (
          <div className="flex flex-col justify-between gap-2">
            <Link
              className="flex items-center"
              to={`/tin-tuc/${record.id}`}
            >
              <Button
                className="w-full"
                type="primary"
                icon={<ArticleIcon width={16} height={16} fill='white' />}
              >
                <p className="text-white">Xem</p>
              </Button>
            </Link>
            <div className="flex items-center min-w-[120px]">
              <Button
                icon={<CloseIcon />}
                type="primary"
                danger
                className="w-full"
                onClick={() => {
                  setOpenDeleteModal(true)
                  setIdNews(record.id)
                }}
              >
                <p>Xóa</p>
              </Button>
            </div>
          </div>
        )
      },
    }
  ]

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getAllNews(searchForm);
        setData(res.data.data);
        setToal(res.data.paging.total)
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData()
  }, [refreshKey, searchForm])

  const onChangePaging = async (page: number, pageSize: number) => {
    setSearchForm({ ...searchForm, page, pageSize })
  }

  return (
    <div className="h-full p-4">
      <Header setSearchForm={setSearchForm} setLoading={setLoading} />
      <div className="flex mb-4">
        <div className="m-auto">
          <span className="px-6 p-2 rounded-full bg-[#84571B] uppercase font-bold text-white text-2xl">Quản lý Tin tức</span>
        </div>
        <Link
          className="bg-[#84571B] rounded-md cursor-pointer h-full px-4 py-2 flex items-center justify-center hover:opacity-80 duration-300 text-white"
          to="/tin-tuc/tao-moi"
        >
          Thêm mới
          <PlusIcon color="white" />
        </Link>
      </div>
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
          dataSource={data}
          columns={columns}
          rowHoverable={false}
          rowKey={record => record.id}
          rowClassName={(_, index) => index % 2 === 0 ? 'bg-[#e9e9e9]' : 'bg-white'}
          bordered
          loading={loading}
          pagination={{
            total: total,
            pageSize: searchForm.pageSize,
            onChange: onChangePaging,
            showSizeChanger: true
          }}
          scroll={{ y: 600 }}
        />
      </ConfigProvider>
      {openDeleteModal && <DeleteNews open={openDeleteModal} onCancel={() => setOpenDeleteModal(false)} id={idNews} setRefreshKey={setRefreshKey} />}
    </div>
  )
}

const NewsWithAuth = withAuth(News)

export default NewsWithAuth