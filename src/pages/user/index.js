import { useEffect, useState, useCallback } from "react";
import { Input, Table, Space} from "antd";
import api from "../../api/api"

function User() {
  const [tableData, setTableData] = useState([]);
  const [total, setTotal] = useState(0);
  const [params, setParams] = useState({
    current: 1,
    size: 10,
  });

  // 使用 useCallback 包装 getUserList 函数
  const getUserList = useCallback(async () => {
    const { data } = await api.getUserList(params)
    setTotal(data.data.length)
    setTableData(data.data)
  }, [params]); // 只有当 params 变化时，getUserList 函数才会重新创建

  useEffect(() => {
    getUserList();
  }, [getUserList]); // 依赖 getUserList
  
  return (
    <>
      <Space>
        <Input.Search
          value={params.name}
          onChange={(e) => setParams({...params, name: e.target.value})}
          style={{width: '300px'}}
          allowClear
          placeholder="请输入账号"
          enterButton
        />
      </Space>
      <Table
        pagination={{
          current: params.current,
          pageSize: params.size,
          total: total,
          showTotal: (total) => `共${total}条`,
          onChange: (page, size) => setParams({...params, current: page, size: size})
        }}
        dataSource={tableData}
      >
        <Table.Column title="编号" dataIndex="id" key="id" />
        <Table.Column title="账号" dataIndex="username" key="username" />
        <Table.Column title="昵称" dataIndex="nickname" key="nickname" />
      </Table>
    </>
  )
}

export default User