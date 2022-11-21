import { Button, Checkbox, Form, Input, message } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axios";


import "./styles.scss";

const LoginPage = () => {
    const navigate = useNavigate();

  const onFinish = ({email, password}: any) => {
    axios.post('/auth/local', {
      identifier: email,
      password
    })
    .then(({ data }) => {
      localStorage.setItem("token", data.jwt);
      navigate('/events')
    
      message.success(`Welcome back ${  data.user.username  }!`)
    }).catch(error=>{
      message.error(error?.response?.data?.error?.message )
    });
  };
  const onFinishFailed = (e: any) => {
    console.log("e", e);
  };

  return (
    <div className="login-page">
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Please input your email!" }]}
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

        <Form.Item
          name="remember"
          valuePropName="checked"
          wrapperCol={{ offset: 8, span: 16 }}
        >
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginPage;
