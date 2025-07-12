import { Button, Form, Input, Tooltip } from "antd";
import SearchIcon from "../../assets/icons/SearchIcon";
import type { SearchFormType } from ".";

interface HeaderProps {
  setSearchForm: React.Dispatch<React.SetStateAction<SearchFormType>>
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
}

function Header(props: HeaderProps) {
  const { setSearchForm, setLoading } = props;
  const [form] = Form.useForm();

  const onFinish = async (data: SearchFormType) => {
    console.log(data)
    setLoading(true);
    setSearchForm(pre => ({...pre, ...data}));
  }

  return (
    <Form onFinish={onFinish} className="flex py-2 justify-between" form={form}>
      <div className="flex gap-2 items-center">
        <Form.Item
          className="w-[160px]"
          name="title"
        >
          <Input
            placeholder="Tiêu đề"
            className="!py-2"
            rootClassName="!border-[1px] !border-[#84571B] !rounded-lg"
            allowClear
          />
        </Form.Item>
        <Form.Item>
          <Tooltip title="Tìm kiếm">
            <Button
              htmlType="submit"
              className="!bg-[#84571B] hover:!bg-[#c58229] duration-300"
              shape="circle"
              icon={<SearchIcon color="white" />}
            />
          </Tooltip>
        </Form.Item>
      </div>
    </Form>
  )
}

export default Header;

