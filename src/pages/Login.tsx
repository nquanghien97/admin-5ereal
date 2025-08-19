import { Button, Form, Input } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { useNavigate } from 'react-router-dom';
import withAuth from '../hocs/withAuth';
import { useEffect, useState } from 'react';
import { useNotification } from '../hooks/useNotification';
import { login } from "../services/auth";
import { parseJwt } from "../utils/parseJwt";
import Cookies from "js-cookie";
import { useUserStore } from "../zustand/user.store";

interface FormValue {
  phoneNumber: string;
  password: string;
}

function Login() {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm<FormValue>()
  const navigate = useNavigate();
  const { getMe } = useUserStore()
  useEffect(() => {
    document.title = "Đăng nhập"
  }, []);

  const notification = useNotification();
  const onSubmit = async (formValue: FormValue) => {
    setLoading(true)
    try {
      const res = await login(formValue);
      const { data } = res
      const data_parse = parseJwt(data.accessToken)
      if (data_parse.role !== 'ADMIN' && data_parse.role !== 'STAFF') {
        notification.warning("Bạn không có quyền truy cập")
        return;
      }
      Cookies.set('accessToken', data.accessToken);
      await getMe()
      notification.success("Đăng nhập thành công")
      navigate('/')
    } catch (err) {
      console.log(err)
      notification.error("Đăng nhập không thành công")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-[url('/background-login.jpg')] bg-no-repeat bg-auto w-screen h-screen bg-center flex items-center justify-center">
      <div className="md:w-6/12 bg-white opacity-80 rounded-md p-8">
        <div className="text-[#84571B] uppercase text-3xl font-bold py-8 text-center">
          <p>Đăng nhập</p>
        </div>
        <Form
          form={form}
          className="flex flex-col"
          onFinish={onSubmit}
        >
          <Form.Item
            className="py-2"
            name="phoneNumber"
            rules={[
              {
                required: true,
                message: "Trường này là bắt buộc"
              }
            ]}
          >
            <Input
              placeholder="Tài khoản"
              size="large"
            />
          </Form.Item>
          <Form.Item
            className="py-2"
            name="password"
            rules={[
              {
                required: true,
                message: "Trường này là bắt buộc"
              }
            ]}
          >
            <Input.Password
              placeholder="Mật khẩu"
              size="large"
              iconRender={
                (visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)
              }
            />
          </Form.Item>

          <div className="flex justify-center my-4">
            <Button
              color="primary"
              className="text-white" style={{ outline: 'none' }}
              htmlType="submit"
              type="primary"
              loading={loading}
            >
              Đăng nhập
            </Button>
          </div>
        </Form>
      </div>
    </div>
  )
}

const LoginWithAuth = withAuth(Login, false);

export default LoginWithAuth;