import http from './http'


const login = (p) => http.post('/api/login', p)

const createBlog = (p) => http.post('/api/blogs', p)
const deleteBlog = (p) => http.del(`/api/blogs`, p)  // 参数id
const updateBlog = (p) => http.put(`/api/blogs`, p)  
const getBlogList = (p) => http.get(`/api/blogs`, p) // 参数page, limit

const createUser = (p) => http.post('/api/users', p)
const deleteUser = (p) => http.del(`/api/users`, p)  // 参数id
const updateUser = (p) => http.put(`/api/users`, p)  
const getUserList = (p) => http.get(`/api/users`, p) // 参数page, limit

//eslint-disable-next-line
export default {
    login,
    createBlog,
    deleteBlog,
    updateBlog,
    getBlogList,
    createUser,
    deleteUser,
    updateUser,
    getUserList,
}