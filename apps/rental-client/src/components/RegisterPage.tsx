import { useState } from "react";
import { Button, Form, Input, Select, Typography, Card, Modal } from "antd";
import { useNavigate } from "react-router-dom";
import { getGlobalContext } from "../lib/context";
import { ScreenRoutes } from "../lib/constant";

const { Title } = Typography;
const { Option } = Select;

const RegisterPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const {accountClient, useToast} = getGlobalContext()
  const [isVerificationModalVisible, setIsVerificationModalVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");

  // Redirect to login
  const backToLogin = () => {
    navigate(ScreenRoutes.Login);
  };

  // Handle form submission
  const handleSubmit = async (values) => {
    try {
      delete values.confirmPassword
      await accountClient.post("account/register", values);
      useToast("success", "Đăng ký thành công! Kiểm tra email để nhận mã xác nhận.");
      setEmail(values.email);
      setIsVerificationModalVisible(true);
    } catch (error) {
      useToast("error", error.response?.data?.message || "Đăng ký thất bại!");
    }
  };

  // Handle verification
  const handleVerify = async () => {
    try {
      await accountClient.post("account/verify", { email, code: +verificationCode });
      useToast("success", "Xác nhận thành công! Đăng nhập ngay.");
      setIsVerificationModalVisible(false);
      navigate(ScreenRoutes.Login);
    } catch (error) {
      useToast("error", error.response?.data?.message || "Xác nhận thất bại!");
    }
  };

  return (
    <div className="register-container">
      <Card className="register-card">
        <Title level={2} className="text-center">Đăng ký tài khoản</Title>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="Họ tên đầy đủ" name="fullName" rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}> 
            <Input />
          </Form.Item>

          <Form.Item label="Email" name="email" rules={[{ required: true, type: "email", message: "Vui lòng nhập email hợp lệ" }]}> 
            <Input />
          </Form.Item>

          <Form.Item 
            label="Mật khẩu" 
            name="password" 
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu" },
              { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" }
            ]}
          > 
            <Input.Password />
          </Form.Item>

          {/* ✅ Confirm Password Field */}
          <Form.Item 
            label="Xác nhận mật khẩu" 
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Mật khẩu không khớp!"));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item label="Kiểu tài khoản" name="role" initialValue={4} rules={[{ required: true }]}> 
            <Select>
              <Option value={4}>Người thuê nhà</Option>
              <Option value={5}>Chủ trọ</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block style={{ marginBottom: "8px" }}>Đăng ký</Button>
            <Button type="default" block onClick={backToLogin}>Quay lại</Button>
          </Form.Item>
        </Form>
      </Card>

      {/* Verification Modal */}
      <Modal
        title="Xác thực tài khoản"
        open={isVerificationModalVisible}
        onCancel={() => setIsVerificationModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsVerificationModalVisible(false)}>Hủy</Button>,
          <Button key="verify" type="primary" onClick={handleVerify}>Xác nhận</Button>,
        ]}
      >
        <p>Nhập mã xác thực đã được gửi đến email của bạn.</p>
        <Input
          placeholder="Mã xác thực"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
        />
      </Modal>
    </div>
  );
};

export default RegisterPage;
