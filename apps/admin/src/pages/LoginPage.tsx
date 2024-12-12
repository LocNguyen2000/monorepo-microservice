import { Fragment, FunctionComponent, useEffect } from "react";
import { Form, Input, Checkbox, Button, Typography, Flex } from "antd";
import { useNavigate } from "react-router-dom";
import { getGlobalContext } from "../lib/context";
import Card from "antd/es/card/Card";

interface LoginPageProps {}

const LoginPage: FunctionComponent<LoginPageProps> = () => {
  const { authUser } = getGlobalContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (authUser) {
      navigate("/");
    }
  });

  return (
    <Flex
      style={{ width: "100vw", height: "100vh", justifyContent: "center", alignItems: "center" }}
      className="m-login-img"
    >
      <Card className="m-login" style={{ width: "650px", height: "300px" }}>
        <Form
          name="basic"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
          className="m-login-form"
          initialValues={{ remember: true }}
          autoComplete="off"
        >
          {/* <Typography.Title level={1} title="Login Page" style={{ textAlign: "center" }}>
            Login Page
          </Typography.Title> */}
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 4, span: 16 }}>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
            <Button type="primary" htmlType="submit" size="large">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Flex>
  );
};

export default LoginPage;
