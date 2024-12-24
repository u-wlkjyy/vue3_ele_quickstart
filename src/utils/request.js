import axios from 'axios'

class Request {
    constructor(config = {}) {
        // 创建 axios 实例
        this.instance = axios.create({
            baseURL: config.baseURL || '',
            timeout: config.timeout || 5000,
            headers: config.headers || {}
        })

        // 请求拦截器
        this.instance.interceptors.request.use(
            (config) => {
                // 在发送请求之前做些什么
                // 例如：添加 token
                // const token = localStorage.getItem('token')
                // if (token) {
                //     config.headers.Authorization = `Bearer ${token}`
                // }
                return config
            },
            (error) => {
                return Promise.reject(error)
            }
        )

        // 响应拦截器
        this.instance.interceptors.response.use(
            (response) => {
                // 对响应数据做点什么
                return response.data
            },
            (error) => {
                // 对响应错误做点什么
                // if (error.response) {
                //     switch (error.response.status) {
                //         case 401:
                //             // 未授权，可以在这里处理登出逻辑
                //             break
                //         case 403:
                //             // 禁止访问
                //             break
                //         case 404:
                //             // 未找到
                //             break
                //         case 500:
                //             // 服务器错误
                //             break
                //     }
                // }
                return Promise.reject(error)
            }
        )
    }

    // GET 请求
    get(url, params = {}, config = {}) {
        return this.instance.get(url, { params, ...config })
    }

    // POST 请求
    post(url, data = {}, config = {}) {
        return this.instance.post(url, data, config)
    }

    // PUT 请求
    put(url, data = {}, config = {}) {
        return this.instance.put(url, data, config)
    }

    // DELETE 请求
    delete(url, config = {}) {
        return this.instance.delete(url, config)
    }

    // PATCH 请求
    patch(url, data = {}, config = {}) {
        return this.instance.patch(url, data, config)
    }
}

// 创建默认实例
const request = new Request({
    baseURL: 'http://localhost:3000',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json'
    }
})

export default request