import { Button, App } from 'antd';

function Home(params) {
  const { message } = App.useApp();
  const handleOk = () => {
    message.success('aaaaa')
  }
  return (
    <div>
      <Button type='primary' onClick={handleOk}>确定</Button>
    </div>
  )
}

export default Home