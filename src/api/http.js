import axios from 'axios'
// import { getToken } from "./token.js"
const instance = axios.create({
  baseURL: 'http://10.0.2.99:9000',
  timeout: 5000
})
// 添加请求拦截器
instance.interceptors.request.use((config) => {
//   const token = getToken()
//   if (token) {
//     config.headers['token'] = token
//   }
  return config
}, (error) => {
  return Promise.reject(error)
})

// 添加响应拦截器
instance.interceptors.response.use((response) => {
  return response
}, (error) => {

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
