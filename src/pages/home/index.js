import { Button } from 'antd';

function Home(params) {
  // const [messageApi, contextHolder] = message.useMessage();
  const handleOk = () => {
    // messageApi.success("hello")
  }
  return (
    <div>

      {/* {contextHolder} */}
      <Button type='primary' onClick={handleOk}>确定</Button>
    </div>
  )
}

export default Home