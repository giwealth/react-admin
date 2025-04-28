import { useState, useEffect } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
  UserOutlined,
  ReadOutlined,
  DownOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, Dropdown, Space, ConfigProvider, ColorPicker, Flex } from 'antd';
import { Outlet, useNavigate, useLocation } from "react-router-dom";
const { Header, Sider, Content } = Layout;

const siderStyle = {
  overflow: 'auto',
  height: 'calc(100vh - 64px)',
  position: 'sticky',
  insetInlineStart: 0,
  top: '64px',
  bottom: 0,
  scrollbarWidth: 'thin',
  scrollbarGutter: 'stable',
  borderRight: '1px solid #e6e6e6',
};
const headerStyle = {
  position: 'sticky',
  top: 0,
  zIndex: 1,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  padding: 0, 
  background: '#fff',
  justifyContent: 'space-between',
  borderBottom: '1px solid #e6e6e6',
}
const logoStyle = {
  height: '64px',
  padding: '16px',
  background: '#fff',
  position: 'sticky',
  width: '100%',
  top: 0,
  borderBottom: '1px solid #e6e6e6',
}

const contentStyle = {
  margin: '24px 16px',
  padding: 24,
  minHeight: 280,
  background: '#fff',
  borderRadius: 8,
}
const buttonStyle = {
  fontSize: '16px',
  width: 64,
  height: 64,
}
const menus = [
  {
    key: '/home',
    icon: <HomeOutlined />,
    label: '首页',
  },
  {
    key: '/blog',
    icon: <ReadOutlined />,
    label: '数据',
  },
  {
    key: '/user',
    icon: <UserOutlined />,
    label: '用户',
    // children: [
    //   {
    //     key: '/user',
    //     label: '系统用户'
    //   },
    //   {
    //     key: '/bbb',
    //     label: '普通用户'
    //   }
    // ]
  },
]


function App() {
  const themeColor = localStorage.getItem('themeColor') || '#1677ff'
  const [primary, setPrimary] = useState(themeColor)
  let location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const defaultSelectedKeys = [location.pathname];
  const logoTxtStyle = {
    height: '32px',
    background: 'rgba(20, 20, 20, .2)',
    borderRadius: '6px',
    fontSize: '22px',
    fontWeight: 'bold',
    textAlign: 'center',
    color: primary,
  }
  const personMenus = [
    {
      key: '1',
      label: '个人信息',
    },
    {
      key: '2',
      label: '主题设置',
    },
    {
      type: 'divider'
    },
    {
      key: '3',
      label: '退出系统',
    }
  ]

  useEffect(() => {
    console.log('--->', primary)
    localStorage.setItem('themeColor', primary)
  }, [primary]);

  const toLink = (e) => {
    navigate(e.key)
  };
  const personEvent = ({key}) => {
    console.log(key)
  };


  return (
    
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: primary,
        },
      }}
    >
      <Layout>
        <Sider  trigger={null} collapsible collapsed={collapsed}>
          <div style={logoStyle}>
            <div style={logoTxtStyle}>{collapsed ? '后台' : '后台管理系统'}</div>
          </div>
          <Menu 
            style={siderStyle}  
            mode="inline" 
            defaultSelectedKeys={defaultSelectedKeys} 
            items={menus} onClick={(e) => toLink(e)} 
          />
        </Sider>
        <Layout>
          <Header style={headerStyle}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={buttonStyle}
            />
            <Flex wrap gap="small">
              <Button type='text' style={buttonStyle}>
                <ColorPicker value={primary} onChange={(color) => setPrimary(color.toHexString())} />
              </Button>
              <Dropdown menu={{ items: personMenus, onClick: personEvent }}>
                <Button type='text' icon={<UserOutlined />} style={buttonStyle} onClick={e => e.preventDefault()}>
                  <Space>
                    <DownOutlined style={{fontSize: 10}} />
                  </Space>
                </Button>
              </Dropdown>
            </Flex>
          </Header>
          <Content style={contentStyle} type="primary">
            <Outlet></Outlet>
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default App;