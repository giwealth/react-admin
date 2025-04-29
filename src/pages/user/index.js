import { useEffect, useState, useCallback } from "react";
import { Input, Table, Space} from "antd";
import api from "../../api/api"

function User() {
  const [dataSource, setDataSource] = useState([]);
  const [total, setTotal] = useState(0);
  const [params, setParams] = useState({
    page: 1,
    limit: 10,
    search: ''
  });

  // 使用 useCallback 包装 getDataSource 函数
  const getDataSource = useCallback(async () => {
    const { data } = await api.getUserList(params)
    setTotal(data.data.total)
    setDataSource(data.data.records)
  }, [params]); // 只有当 params 变化时，getDataSource 函数才会重新创建

  useEffect(() => {
    getDataSource();
  }, [getDataSource]); // 依赖 getDataSource
  
  return (
    <>
      <Space>
        <Input.Search
          value={params.name}
          onChange={(e) => setParams({...params, search: e.target.value})}
          style={{width: '300px'}}
          allowClear
          placeholder="请输入账号"
          enterButton
        />
      </Space>
      <Table
        pagination={{
          current: params.page,
          pageSize: params.limit,
          total: total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共${total}条`,
          onChange: (page, size) => setParams({...params, page: page, limit: size})
        }}
        dataSource={dataSource}
      >
        <Table.Column title="编号" dataIndex="id" key="id" />
        <Table.Column title="账号" dataIndex="username" key="username" />
        <Table.Column title="昵称" dataIndex="nickname" key="nickname" />
      </Table>
    </>
  )
}

export default User