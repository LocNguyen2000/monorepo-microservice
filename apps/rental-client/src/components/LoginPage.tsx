import { FunctionComponent, useState } from "react";
import { Form, Input, Checkbox, Button, Flex } from "antd";
import Card from "antd/es/card/Card";
import { useNavigate } from "react-router-dom";
import { getGlobalContext } from "../lib/context";
import { ScreenRoutes } from "../lib/constant";

interface LoginPageProps {}

const LoginPage: FunctionComponent<LoginPageProps> = () => {
  const params = location.search
  const callbackUri = params.substring(13, params.length) || ScreenRoutes.Home
  const { setAuthUser, accountClient, useToast } = getGlobalContext()
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Handle form submission
  const handleLogin = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      const payload = {...values, clientId: process.env.ADMIN_AUTH_RENTAL_CLIENTID}
      const response = await accountClient.post(`account/login?callbackUri=${encodeURIComponent(callbackUri)}`, payload);
      
      // ✅ Store token in localStorage
      useToast("success", "Đăng nhập thành công!");
      const data = response.data
      console.log('Data', data);

      localStorage.setItem('authUser', JSON.stringify(data))
      
      setAuthUser({...data})
      navigate(ScreenRoutes.Home)
    } catch (error) {
      useToast("error", error.response?.data?.message || "Đăng nhập thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex
      style={{ width: "100vw", height: "100vh", justifyContent: "center", alignItems: "center" }}
      className="m-login-img"
    >
      <Card className="m-login" style={{ width: "650px", height: "320px" }}>
        <Form
          name="login"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
          className="m-login-form"
          initialValues={{ remember: true }}
          autoComplete="off"
          onFinish={handleLogin} // ✅ Connect form to API
        >
          <Form.Item
            label="Tài khoản"
            name="email"
            rules={[{ required: true, type: "email", message: "Vui lòng nhập email hợp lệ!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 4, span: 16 }}>
            <Checkbox>Lưu đăng nhập?</Checkbox>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
            <Button type="primary" htmlType="submit" size="large" loading={loading} style={{ marginRight: "8px" }}>
              Đăng nhập
            </Button>

            <Button type="default" size="large" onClick={() => navigate(ScreenRoutes.Register)}>
              Đăng ký tài khoản mới?
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Flex>
  );
};

export default LoginPage;
