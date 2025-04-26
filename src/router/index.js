import { createBrowserRouter } from 'react-router-dom'
import React from 'react'
const Login = React.lazy(() => import('../pages/Login'))
const App = React.lazy(() => import('../App'))
const Home = React.lazy(() => import('../pages/home/index'))
const Blog = React.lazy(() => import('../pages/blog/index'))
const User = React.lazy(() => import('../pages/user/index'))
const NotFound = React.lazy(() => import('../pages/NotFound'))

// 创建路由
const routes = createBrowserRouter([
  {
    path: '/',
    Component: Login
  },
  {
    Component: App,
    children: [
      {
        path: '/home',
        Component: Home
      },
      {
        path: '/blog',
        Component: Blog
      },
      {
        path: '/user',
        Component: User
      },
      {
        path: '*',
        Component: NotFound
      }
    ]
  },
])

export default routes