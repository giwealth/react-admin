# react-admin
react admin

## 修改后端地址
```
# 修改src/api/http.js文件中baseURL的值为自己主机IP地址
const instance = axios.create({
  baseURL: 'http://10.0.2.99:9000',
  timeout: 5000
})
```

## 安装依赖
```
npm install
```

## 运行
```
go run main.go
npm start
```

## 访问
```
http://127.0.0.1:3000
```