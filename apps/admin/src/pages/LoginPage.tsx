import { FunctionComponent, useEffect, useState } from "react";
import { Form, Input, Checkbox, Button, Typography, Alert } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { getGlobalContext } from "../lib/context";
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
    <div className="aws-login-shell">
      <header className="aws-login-header">
        <div className="aws-login-brand">
          <span className="aws-login-brand-icon">
            <HomeOutlined />
          </span>
          <span className="aws-login-brand-name">Rental</span>
        </div>
      </header>

      <main className="aws-login-main">
        <section className="aws-login-card" aria-labelledby="login-title">
          <Typography.Title
            id="login-title"
            level={2}
            className="aws-login-title"
          >
            Đăng nhập
          </Typography.Title>

          <Form
            name="login"
            className="aws-login-form"
            initialValues={{ remember: true }}
            autoComplete="off"
            layout="vertical"
            onFinish={submitLogin}
          >
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
              />
            </Form.Item>

            <Form.Item
              name="remember"
              valuePropName="checked"
              className="aws-login-remember"
            >
              <Checkbox>Ghi nhớ đăng nhập</Checkbox>
            </Form.Item>

            <Form.Item className="aws-login-submit-item">
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={loading}
                className="aws-login-submit"
              >
                Đăng nhập
              </Button>
            </Form.Item>
          </Form>

          <div className="aws-login-register">
            <Button type="link" onClick={() => navigate("/register")}>
              Tạo tài khoản
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LoginPage;
