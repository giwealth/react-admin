import React from 'react';
import ReactDOM from 'react-dom/client';
import '@ant-design/v5-patch-for-react-19';
import './index.css';
import App from './App';
import router from './router'
import { App as AntdApp } from 'antd'
import { RouterProvider } from 'react-router-dom'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AntdApp>
    <RouterProvider router={router}>
      <App />
    </RouterProvider>
  </AntdApp>
);

