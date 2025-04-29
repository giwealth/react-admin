import { useEffect, useState, useCallback } from "react";
import { Input, Table, Space, Button, Popconfirm } from "antd";
import api from "../../api/api"
import moment from "moment";

function Blog() {
  const [dataSource, setDataSource] = useState([]);
  const [total, setTotal] = useState(0);
  const [params, setParams] = useState({
    page: 1,
    limit: 10,
    search: ''
  });

  // 使用 useCallback 包装 getDataSource 函数
  const getDataSource = useCallback(async () => {
    const { data } = await api.getBlogList(params)
    setTotal(data.data.total)
    setDataSource(data.data.records)
  }, [params]); // 只有当 params 变化时，getDataSource 函数才会重新创建

  const deleteConfirm = async (id) => {
    await api.deleteBlog({id: id})
    const newData = dataSource.filter(item => item.id !== id)
    setDataSource(newData)
  }

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
          placeholder="请输入名称"
          enterButton
        />
        <Button type="primary">新增数据</Button>
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
        <Table.Column title="标题" dataIndex="title" key="title" />
        <Table.Column title="内容" dataIndex="content" key="content" />
        <Table.Column 
          title="时间" 
          dataIndex="created_at" 
          key="created_at" 
          render={(value) => moment.unix(value).format("YYYY-MM-DD HH:mm:ss")} 
        />
        <Table.Column 
          title="操作" 
          key="action"
          render={(_, record) => (
            <Space>
              <Button type="primary" size="small">编辑</Button>
              <Popconfirm
                title="删除提示"
                description="你确定要删除该项吗？"
                onConfirm={() => deleteConfirm(record.id)}
                okText="确定"
                cancelText="取消"
              >
                <Button color="danger" variant="outlined" size="small">删除</Button>
              </Popconfirm>
            </Space>
          )}
        />
      </Table>
    </>
  )
}

export default Blog