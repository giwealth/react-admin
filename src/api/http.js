import axios from 'axios'
import { message } from 'antd'
import {useNavigate} from 'react-router-dom'
// import { getToken } from "./token.js"
const instance = axios.create({
  baseURL: 'http://10.0.2.99:9000',
  timeout: 5000
})
// 添加请求拦截器
instance.interceptors.request.use((config) => {
  // config.headers["content-type"] = "application/json"
  return config
}, (error) => {
  return Promise.reject(error)
})

// 添加响应拦截器
instance.interceptors.response.use(
  (response) => {
    const { status, data } = response
    if (status === 200 && data) {
      switch (data.code) {
        case 2001:
          message.info('创建成功')
          break;
        case 2002:
          message.info('更新成功')
          break;
        case 2003:
          message.info('删除成功')
          break;
        default: // 不加这一行eslint检查不通过
      }
    }
    return response
  }, 
  (error) => {
    const response = error.response || {}
    const status = response.status
    const data = response.data || {}
    switch (status) {
      case 401:
        const navigate = useNavigate()
        message.warning('登录已过期，请重新登录')
        navigate('/')
        break
      case 403:
        message.warning('您没有权限执行此操作')
        break
      case 500:
        message.error(data.message || '服务器错误，请稍后重试')
        break
      default:
        if (status) {
          if (data.message) {
            message.warning(data.message);
          } else {
            message.warning(`请求异常 (${status})`);
          }
        } else {
          // 网络错误或请求被取消
          message.error('网络异常，请检查您的网络连接');
        }
    }

    return Promise.reject(error)
})


const post = (url, data) => {
  return new Promise((resolve, reject) => {
    instance
      .post(url, data)
      .then((res) => {
          resolve(res);
      })
      .catch((err) => {
          reject(err);
      });
  });
};
const get = (url, data) => {
  return new Promise((resolve, reject) => {
    instance
      .get(url, { params: data })
      .then((res) => {
          resolve(res);
      })
      .catch((err) => {
          reject(err);
      });
  });
};
const put = (url, data) => {
  return new Promise((resolve, reject) => {
    instance
      .put(url, data)
      .then((res) => {
          resolve(res);
      })
      .catch((err) => {
          reject(err);
      });
  });
};

const del = (url, data) => {
  return new Promise((resolve, reject) => {
    instance
      .delete(url, { params: data })
      .then((res) => {
          resolve(res);
      })
      .catch((err) => {
          reject(err);
      });
  });
};

//eslint-disable-next-line
export default {
    post,
    get,
    put,
    del,
};
