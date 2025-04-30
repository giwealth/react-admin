import React, { useEffect } from 'react';
import { Modal, Form, Input, Button, Select, DatePicker, InputNumber } from 'antd';

/**
 * EditDialog - 用于创建或编辑项目的可重用对话框组件
 * 
 * @param {boolean} visible - 控制对话框是否可见
 * @param {function} onCancel - 单击取消按钮时调用的函数
 * @param {function} onSubmit - 单击提交时调用表单数据的函数
 * @param {object} initialValues - 表单的初始值（用于编辑模式）
 * @param {string} title - 对话框标题
 * @param {array} formItems - 表单项配置数组
 * @param {boolean} confirmLoading - 提交按钮是否应显示加载状态
 * @param {object} formLayout - 表单布局配置
 */
const EditDialog = ({
  visible,
  onCancel,
  onSubmit,
  initialValues = {},
  title = 'Add Item',
  formItems = [],
  confirmLoading = false,
  formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  }
}) => {
  const [form] = Form.useForm();
  const isEditMode = Object.keys(initialValues).length > 0;

  // 当对话框打开/关闭或初始值更改时重置表单
  useEffect(() => {
    if (visible) {
      form.resetFields();
      
      if (isEditMode) {
        form.setFieldsValue(initialValues);
      }
    }
  }, [visible, initialValues, form, isEditMode]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
    } catch (error) {
      console.error('Form validation failed:', error);
    }
  };

  // 呈现不同表单项类型的辅助函数
  const renderFormItem = (item) => {
    const { type, name, label, rules, options, ...rest } = item;

    switch (type) {
      case 'select':
        return (
          <Select placeholder={`Select ${label}`} {...rest}>
            {options?.map((option) => (
              <Select.Option key={option.value} value={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select>
        );
      case 'textarea':
        return <Input.TextArea rows={4} placeholder={`输入${label}`} {...rest} />;
      case 'number':
        return <InputNumber style={{ width: '100%' }} placeholder={`输入${label}`} {...rest} />;
      case 'date':
        return <DatePicker style={{ width: '100%' }} {...rest} />;
      case 'rangePicker':
        return <DatePicker.RangePicker style={{ width: '100%' }} {...rest} />;
      default:
        return <Input placeholder={`输入${label}`} {...rest} />;
    }
  };

  return (
    <Modal
      title={isEditMode ? `编辑 ${title}` : `添加 ${title}`}
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          取消
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={confirmLoading}
          onClick={handleSubmit}
        >
          {isEditMode ? '更新' : '添加'}
        </Button>
      ]}
      maskClosable={false}
      destroyOnClose
    >
      <Form
        form={form}
        {...formLayout}
        layout="horizontal"
        name="custom_form_dialog"
      >
        {formItems.map((item) => (
          <Form.Item
            key={item.name}
            name={item.name}
            label={item.label}
            rules={item.rules || []}
          >
            {renderFormItem(item)}
          </Form.Item>
        ))}
      </Form>
    </Modal>
  );
};

export default EditDialog;