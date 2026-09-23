import { FunctionComponent, useEffect, useState } from "react";
import { Form, Input, Checkbox, Button, Typography, Flex, Alert } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { getGlobalContext } from "../lib/context";
import Card from "antd/es/card/Card";
import { UserRole } from "../lib/constants/roles";
import { DASHBOARD_ROUTES } from "../lib/constants/routes";

interface LoginPageProps {}

const LoginPage: FunctionComponent<LoginPageProps> = () => {
  const { authUser, setAuthUser, serviceClient } = getGlobalContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (authUser) {
      navigate(
        Number(authUser.role) === UserRole.LocationOperator
          ? DASHBOARD_ROUTES.METER_READING
          : "/",
        { replace: true },
      );
    }
  }, [authUser, navigate]);

  const submitLogin = async (values: {
    email: string;
    password: string;
    remember?: boolean;
  }) => {
    setLoading(true);
    setError(undefined);
    try {
      const response = await serviceClient.post("auth/login", {
        email: values.email,
        password: values.password,
      });
      const account = response.data;
      localStorage.setItem("accessToken", account.accessToken);
      localStorage.setItem("sessionId", account.sessionId);
      setAuthUser({
        userId: account.id,
        name: account.fullName,
        email: account.email,
        role: String(account.role),
        sessionId: account.sessionId,
      });
      navigate(
        Number(account.role) === UserRole.LocationOperator
          ? DASHBOARD_ROUTES.METER_READING
          : "/",
        { replace: true },
      );
    } catch (requestError: any) {
      setError(
        requestError?.response?.data?.message ||
          "Unable to sign in. Please check your credentials.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex
      style={{
        width: "100vw",
        minHeight: "100vh",
        justifyContent: "center",
        alignItems: "center",
      }}
      className="m-login-img"
    >
      <Card className="m-login" style={{ width: "min(92vw, 480px)" }}>
        <Form
          name="login"
          className="m-login-form"
          initialValues={{ remember: true }}
          autoComplete="off"
          layout="vertical"
          onFinish={submitLogin}
        >
          <Typography.Title level={2} style={{ textAlign: "center" }}>
            <HomeOutlined style={{ marginRight: "0.5rem" }} />
            Đăng nhập quản trị
          </Typography.Title>
          <Typography.Paragraph type="secondary">
            Đăng nhập để quản lý hệ thống nhà trọ.
          </Typography.Paragraph>
          {error && (
            <Alert
              message={error}
              type="error"
              showIcon
              style={{ marginBottom: 16 }}
            />
          )}
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                type: "email",
                message: "Vui lòng nhập email hợp lệ.",
              },
            ]}
          >
            <Input
              size="large"
              autoComplete="email"
              placeholder="you@example.com"
            />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu." }]}
          >
            <Input.Password
              size="large"
              autoComplete="current-password"
              placeholder="Your password"
            />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>Ghi nhớ đăng nhập</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={loading}
            >
              Đăng nhập
            </Button>
          </Form.Item>

          <Button type="link" block onClick={() => navigate("/register")}>
            Chưa có tài khoản? Đăng ký ngay
          </Button>
        </Form>
      </Card>
    </Flex>
  );
};

export default LoginPage;
