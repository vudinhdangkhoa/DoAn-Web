import axios from 'axios';
import APIRoute from './APIRoute'; // Import APIRoute của bạn

// Tạo axios instance
const axiosInstance = axios.create({
    baseURL: APIRoute.getURL(), // Hoặc URL base của API
    timeout: 10000,
});

// Biến để theo dõi việc refresh token
let isRefreshing = false;
let failedQueue = [];

// Hàm xử lý queue khi refresh token thành công/thất bại
const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    
    failedQueue = [];
};

// Request interceptor - Tự động thêm token vào header
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Tự động refresh token khi hết hạn
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Kiểm tra nếu lỗi 401 và chưa retry
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // Nếu đang refresh, đưa request vào queue
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return axiosInstance(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                
                if (!refreshToken) {
                    throw new Error('No refresh token available');
                }

                // Gọi API refresh token
                const response = await axios.post(
                    APIRoute.getURL('XacThuc/RefreshToken'),
                    { refreshToken: refreshToken }
                );

                const { token: newToken, refreshToken: newRefreshToken } = response.data;

                // Lưu token mới
                localStorage.setItem('token', newToken);
                localStorage.setItem('refreshToken', newRefreshToken);

                // Cập nhật header cho request gốc
                originalRequest.headers.Authorization = `Bearer ${newToken}`;

                // Xử lý queue
                processQueue(null, newToken);

                return axiosInstance(originalRequest);

            } catch (refreshError) {
                // Refresh token thất bại - đăng xuất user
                processQueue(refreshError, null);
                
                // Clear localStorage
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('UserId');
                localStorage.removeItem('status');

                // Redirect to login
                window.location.href = '/DangNhap';

                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;