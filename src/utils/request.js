import axios from 'axios';

class Request {
    constructor(config = {}) {
        // 创建 axios 实例
        this.instance = axios.create({
            baseURL: config.baseURL || '',
            timeout: config.timeout || 5000,
            headers: config.headers || {},
        });

        // 请求拦截器
        this.instance.interceptors.request.use(
            (config) => {
                // 在发送请求之前检查 token
                const token = localStorage.getItem('token'); // 假设 token 存储在 localStorage
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // 响应拦截器
        this.instance.interceptors.response.use(
            (response) => {
                return response.data;
            },
            (error) => {
                return Promise.reject(error);
            }
        );
    }

    // GET 请求
    get(url, params = {}, config = {}) {
        return this.instance.get(url, { params, ...config });
    }

    // POST 请求
    post(url, data = {}, config = {}) {
        // 自动将普通键值对转换为 FormData
        if (!(data instanceof FormData)) {
            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
                formData.append(key, value);
            });
            data = formData;

            // 设置 Content-Type 为 multipart/form-data
            config.headers = {
                ...config.headers,
                'Content-Type': 'multipart/form-data',
            };
        }

        return this.instance.post(url, data, config);
    }

    // PUT 请求
    put(url, data = {}, config = {}) {
        return this.instance.put(url, data, config);
    }

    // DELETE 请求
    delete(url, config = {}) {
        return this.instance.delete(url, config);
    }

    // PATCH 请求
    patch(url, data = {}, config = {}) {
        return this.instance.patch(url, data, config);
    }
}

// 创建默认实例
const request = new Request({
    baseURL: 'http://localhost:3000',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default request;
