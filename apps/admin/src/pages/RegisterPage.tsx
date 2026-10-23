import { FunctionComponent, useEffect, useState } from "react";
import { Alert, Button, Form, Input, Typography } from "antd";
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
        <section className="aws-login-card" aria-labelledby="register-title">
          <Typography.Title
            id="register-title"
            level={2}
            className="aws-login-title"
          >
            Tạo tài khoản
          </Typography.Title>
          <Form
            name="register"
            className="aws-login-form"
            layout="vertical"
            autoComplete="off"
            onFinish={submitRegister}
          >
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
                message="Đăng ký thành công."
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
              <Input size="large" autoComplete="name" />
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
              <Input size="large" autoComplete="email" />
            </Form.Item>

            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[
                { required: true, message: "Vui lòng tạo mật khẩu." },
                { min: 8, message: "Mật khẩu phải có ít nhất 8 ký tự." },
              ]}
            >
              <Input.Password size="large" autoComplete="new-password" />
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
              <Input.Password size="large" autoComplete="new-password" />
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
                Tạo tài khoản
              </Button>
            </Form.Item>

            <div className="aws-login-register">
              <Button type="link" onClick={() => navigate("/login")}>
                Đăng nhập
              </Button>
            </div>
          </Form>
        </section>
      </main>
    </div>
  );
};

export default RegisterPage;
