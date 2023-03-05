import { Fragment, FunctionComponent } from "react";
import {Form, Input, Checkbox, Button, Typography} from 'antd'
interface LoginPageProps {
    
}
 
const LoginPage: FunctionComponent<LoginPageProps> = () => {
    return ( 
        <Fragment>
            <section className="m-login">
                <Form
                    name="basic"
                    labelCol={{ span: 8 }}
                    className='m-login-form'
                    initialValues={{ remember: true }}
                    autoComplete="off"
                >
                    <Typography.Title level={1} title="Login Page" style={{textAlign: "center"}}>Login Page</Typography.Title>
                    <Form.Item
                        label="Username"
                        name="username"
                        rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
                        <Checkbox>Remember me</Checkbox>
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
                <div className="m-login-img"></div>
            </section>
        </Fragment> 
    );
}
 
export default LoginPage;