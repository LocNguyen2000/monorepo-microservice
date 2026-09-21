import { FunctionComponent, useEffect, useState } from "react";
import { Alert, Button, Card, Form, Input, Typography, Flex } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { getGlobalContext } from "../lib/context";

interface RegisterFormValues {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const RegisterPage: FunctionComponent = () => {
  const { authUser, serviceClient } = getGlobalContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (authUser) navigate("/", { replace: true });
  }, [authUser, navigate]);

  const submitRegister = async (values: RegisterFormValues) => {
    setLoading(true);
    setError(undefined);
    try {
      await serviceClient.post("auth/register", {
        fullName: values.fullName.trim(),
        email: values.email.trim(),
        password: values.password,
      });
      setSuccess(true);
      setTimeout(() => navigate("/login", { replace: true }), 900);
    } catch (requestError: any) {
      setError(
        requestError?.response?.data?.message ||
          "Unable to create the account. Please try again.",
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
          name="register"
          className="m-login-form"
          layout="vertical"
          autoComplete="off"
          onFinish={submitRegister}
        >
          <Typography.Title level={2} style={{ textAlign: "center" }}>
            <HomeOutlined style={{ marginRight: "0.5rem" }} />
            Đăng ký tài khoản
          </Typography.Title>
          <Typography.Paragraph type="secondary">
            Tạo tài khoản để sử dụng hệ thống nhà trọ.
          </Typography.Paragraph>
          {error && (
            <Alert
              message={error}
              type="error"
              showIcon
              style={{ marginBottom: 16 }}
            />
          )}
          {success && (
            <Alert
              message="Đăng ký thành công. Đang chuyển đến trang đăng nhập..."
              type="success"
              showIcon
              style={{ marginBottom: 16 }}
            />
          )}

          <Form.Item
            label="Họ và tên"
            name="fullName"
            rules={[{ required: true, message: "Vui lòng nhập họ và tên." }]}
          >
            <Input
              size="large"
              autoComplete="name"
              placeholder="Your full name"
            />
          </Form.Item>

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
            rules={[
              { required: true, message: "Vui lòng tạo mật khẩu." },
              { min: 8, message: "Mật khẩu phải có ít nhất 8 ký tự." },
            ]}
          >
            <Input.Password
              size="large"
              autoComplete="new-password"
              placeholder="At least 8 characters"
            />
          </Form.Item>

          <Form.Item
            label="Xác nhận mật khẩu"
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu." },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  return !value || getFieldValue("password") === value
                    ? Promise.resolve()
                    : Promise.reject(new Error("Mật khẩu không khớp."));
                },
              }),
            ]}
          >
            <Input.Password
              size="large"
              autoComplete="new-password"
              placeholder="Repeat your password"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={loading}
            >
              Đăng ký
            </Button>
          </Form.Item>

          <Button type="link" block onClick={() => navigate("/login")}>
            Đã có tài khoản? Đăng nhập
          </Button>
        </Form>
      </Card>
    </Flex>
  );
};

export default RegisterPage;
