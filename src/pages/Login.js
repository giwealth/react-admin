import {Card, Button, Form, Input, Row, Col, message } from 'antd'
import {useNavigate} from 'react-router-dom'

const loginStyle = {
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}

function Login() {
  const navigate = useNavigate()
  const [messageApi, contextHolder] = message.useMessage()
  const onFinish = async (loginForm) => {
    try {
      if (loginForm.username === "admin" && loginForm.password === "admin") {
        navigate("/home")
      } else {
        messageApi.warning('账号密码错误!')
      }
    } catch (error) {
      message.error(error.message)
    }
  }
  const onFinishFailed = (errorInfo) => {
    message.error(errorInfo.message)
  }
  return (
    {contextHolder},
    <div style={loginStyle}>
      <Card style={{width: 400}}>
        <Row justify="center" style={{lineHeight: "50px"}}>
          <Col style={{fontSize: "18px", fontWeight: "bold"}}>后台管理</Col>
        </Row>
        <Form onFinish={onFinish} onFinishFailed={onFinishFailed}>
          <Form.Item label="账号" name="username" rules={[{required: true, message: "用户账号不能为空!"}]}>
            <Input placeholder="请输入账号"></Input>
          </Form.Item>
          <Form.Item label="密码" name="password" rules={[{required: true, message: "请输入密码！"}]}>
            <Input.Password placeholder="请输入密码" />
          </Form.Item>
          <Form.Item style={{textAlign: "center"}}>
            <Button type="primary" htmlType="submit">登录</Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default Login