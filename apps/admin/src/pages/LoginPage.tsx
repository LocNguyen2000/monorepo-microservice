import { FunctionComponent, useEffect, useState } from "react";
import { Form, Input, Checkbox, Button, Typography, Flex, Alert } from "antd";
import { useNavigate } from "react-router-dom";
import { getGlobalContext } from "../lib/context";
import Card from "antd/es/card/Card";

interface LoginPageProps {}

const LoginPage: FunctionComponent<LoginPageProps> = () => {
  const { authUser, setAuthUser, serviceClient } = getGlobalContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (authUser) {
      navigate("/", { replace: true });
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
      setAuthUser({
        userId: account.id,
        name: account.fullName,
        email: account.email,
        role: String(account.role),
      });
      navigate("/", { replace: true });
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
          <Typography.Title level={2}>Admin sign in</Typography.Title>
          <Typography.Paragraph type="secondary">
            Sign in to manage your rental workspace.
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
                message: "Enter a valid email address.",
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
            label="Password"
            name="password"
            rules={[{ required: true, message: "Enter your password." }]}
          >
            <Input.Password
              size="large"
              autoComplete="current-password"
              placeholder="Your password"
            />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={loading}
            >
              Sign in
            </Button>
          </Form.Item>

          <Button type="link" block onClick={() => navigate("/register")}>
            Need an account? Create one
          </Button>
        </Form>
      </Card>
    </Flex>
  );
};

export default LoginPage;
