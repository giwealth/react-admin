import { useEffect, useState, useCallback } from "react";
import { Input, Table, Space, Button, Popconfirm, ConfigProvider } from "antd";
import  EditDialog from "../components/EditDialog"
import zhCN from "antd/locale/zh_CN";
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

  // 删除数据
  const handleDelete = async (record) => {
    await api.deleteBlog({id: record.id})
    const newDataSource = dataSource.filter(item => item.id !== record.id)
    setDataSource(newDataSource)
  }

  useEffect(() => {
    getDataSource();
  }, [getDataSource]); // 依赖 getDataSource

  // EditDialog
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [editRecord, setEditRecord] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const formItems = [
    {
      name: 'title',
      label: '标题',
      rules: [{ required: true, message: '请输入标题' }],
    },
    {
      name: 'content',
      label: '内容',
      type: 'textarea',
      rules: [{ required: true, message: '请输入内容' }],
    },
    // {
    //   name: 'category',
    //   label: 'Category',
    //   type: 'select',
    //   rules: [{ required: true, message: 'Please select a category' }],
    //   options: [
    //     { label: 'Electronics', value: 'electronics' },
    //     { label: 'Clothing', value: 'clothing' },
    //   ],
    // },
  ];
  // 新增事件
  const handleAdd = () => {
    setIsEditMode(false);
    setEditRecord({});
    setVisible(true);
  };

  // 编辑事件
  const handleEdit = (record) => {
    setIsEditMode(true);
    setEditRecord(record);
    setVisible(true);
  };
  // 关闭事件
  const handleCancel = () => {
    setVisible(false);
  };

  // 提交事件
  const handleSubmit = async (values) => {
    setConfirmLoading(true);
    try {
      if (isEditMode) {
        // 更新
        const newEditRecord = {...editRecord, ...values}
        
        await api.updateBlog(newEditRecord)
        const newDataSource = dataSource.map(item => 
          // {}中为展运算符, ...item 首先复制当前对象的所有属性, ...values 然后用新的值覆盖对应的属性
          item.id === editRecord.id ? { ...item, ...values } : item
        );
        setDataSource(newDataSource);
      
      } else {
        // 新增
        const newRecord = {
          ...values,
        };
        const res = await api.createBlog(newRecord)
        setDataSource([res.data.data, ...dataSource]);
      }
      setConfirmLoading(false);
      setVisible(false);
    } catch (error) {
      console.error('请求服务端错误', error)
    }
  };
  
  return (
    <>
      <Space style={{ marginBottom: "20px" }}>
        <Input.Search
          value={params.name}
          onChange={(e) => setParams({...params, search: e.target.value})}
          style={{width: '300px'}}
          allowClear
          placeholder="请输入名称"
          enterButton
        />
        <Button type="primary" onClick={handleAdd}>新增数据</Button>
      </Space>
      <ConfigProvider locale={zhCN}>
        <Table
          rowKey="id"
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
                <Button type="primary" size="small" onClick={() => handleEdit(record)}>编辑</Button>
                <Popconfirm
                  title="删除提示"
                  description="你确定要删除该项吗？"
                  onConfirm={() => handleDelete(record)}
                  okText="确定"
                  cancelText="取消"
                >
                  <Button color="danger" variant="outlined" size="small">删除</Button>
                </Popconfirm>
              </Space>
            )}
          />
        </Table>
      </ConfigProvider>
      <EditDialog 
        visible={visible}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
        initialValues={editRecord}
        title="数据"
        formItems={formItems}
        confirmLoading={confirmLoading}
        formLayout={{
          labelCol: { span: 3 },
          wrapperCol: { span: 21 }
        }}
      />
    </>
  )
}

export default Blog