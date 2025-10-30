import { useState, useEffect } from 'react';
import axiosInstance from '../AxioxInstance';
import APIRoute from '../APIRoute';
import axios from 'axios';
// Custom hook để fetch courses data
export const useCourses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            setError(null);
            const apiRoute = new APIRoute();
            const response = await axios.get(
                APIRoute.getURL('TrangChu/GetAllLoaiKhoaHoc')
            );
            
            if (response.status === 200) {
                setCourses(response.data);
            }
        } catch (err) {
            console.error('Error fetching courses:', err);
            setError('Không thể tải danh sách khóa học');
            
            // Fallback data for demo when API fails
            setCourses([
                {
                    id: 1,
                    tenLoai: 'Khóa Học Vẽ Cơ Bản',
                    moTa: 'Nền tảng vững chắc cho người mới bắt đầu học vẽ. Học các kỹ thuật cơ bản từ nét vẽ đến tạo hình.',
                    hinhAnh: '/logo192.png'
                },
                {
                    id: 2,
                    tenLoai: 'Khóa Học Màu Nước',
                    moTa: 'Khám phá vẻ đẹp của màu nước từ cơ bản đến nâng cao. Tạo ra những tác phẩm nghệ thuật tuyệt đẹp.',
                    hinhAnh: '/logo192.png'
                },
                {
                    id: 3,
                    tenLoai: 'Khóa Học Vẽ Chân Dung',
                    moTa: 'Nghệ thuật vẽ chân dung chuyên nghiệp. Học cách vẽ chân dung chính xác và sinh động.',
                    hinhAnh: '/logo192.png'
                },
                {
                    id: 4,
                    tenLoai: 'Khóa Học Tranh Sơn Dầu',
                    moTa: 'Làm chủ kỹ thuật sơn dầu cổ điển. Từ chuẩn bị canvas đến hoàn thiện tác phẩm.',
                    hinhAnh: '/logo192.png'
                },
                {
                    id: 5,
                    tenLoai: 'Khóa Học Vẽ Manga',
                    moTa: 'Học vẽ manga và anime theo phong cách Nhật Bản. Từ nhân vật đến background.',
                    hinhAnh: '/logo192.png'
                },
                {
                    id: 6,
                    tenLoai: 'Khóa Học Digital Art',
                    moTa: 'Nghệ thuật số hiện đại với các phần mềm chuyên nghiệp như Photoshop, Illustrator.',
                    hinhAnh: '/logo192.png'
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const refetchCourses = () => {
        fetchCourses();
    };

    return {
        courses,
        loading,
        error,
        refetchCourses
    };
};

//custom hook fecth data giang vien
export const useGiaoVienData = () => {
    const [giaoVien, setGiaoVien] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchGiaoVien = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axiosInstance.get(
                APIRoute.getURL('TrangChu/GetAllTeacher') // <-- ĐÃ SỬA TÊN ENDPOINT
            );
            
            if (response.status === 200) {
                console.log("Dữ liệu giáo viên nhận được:", response.data);
                setGiaoVien(response.data);
            }
        } catch (err) {
            console.error('Lỗi khi fetch dữ liệu giáo viên:', err);
            setError('Không thể tải danh sách giáo viên.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGiaoVien();
    }, []); // Hook này chỉ chạy một lần khi component được mount

    return { giaoVien, loading, error, refetchGiaoVien: fetchGiaoVien };
};

// Custom hook để fetch other welcome page data (có thể mở rộng thêm)
export const useWelcomePageData = () => {
    const [banners, setBanners] = useState([]);
    const [testimonials, setTestimonials] = useState([]);
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchBanners = async () => {
        try {
            setLoading(true);
            const apiRoute = new APIRoute();
            // Giả sử có API cho banners
            const response = await axiosInstance.get(
                apiRoute.getURL('GetBanners')
            );
            setBanners(response.data);
        } catch (err) {
            console.error('Error fetching banners:', err);
            setError('Không thể tải banners');
        } finally {
            setLoading(false);
        }
    };

    const fetchTestimonials = async () => {
        try {
            setLoading(true);
            const apiRoute = new APIRoute();
            // Giả sử có API cho testimonials
            const response = await axiosInstance.get(
                apiRoute.getURL('GetTestimonials')
            );
            setTestimonials(response.data);
        } catch (err) {
            console.error('Error fetching testimonials:', err);
            setError('Không thể tải testimonials');
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            setLoading(true);
            const apiRoute = new APIRoute();
            // Giả sử có API cho statistics
            const response = await axiosInstance.get(
                apiRoute.getURL('GetStats')
            );
            setStats(response.data);
        } catch (err) {
            console.error('Error fetching stats:', err);
            setError('Không thể tải thống kê');
        } finally {
            setLoading(false);
        }
    };

    return {
        banners,
        testimonials,
        stats,
        loading,
        error,
        fetchBanners,
        fetchTestimonials,
        fetchStats
    };
};