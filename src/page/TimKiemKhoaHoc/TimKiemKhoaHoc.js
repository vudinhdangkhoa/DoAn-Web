import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import APIRoute from '../../APIRoute';
import CustomNavbar from '../../components/WellcomePage/Navbar';
import Footer from '../../components/WellcomePage/Footer';
import { useCourses } from "../../Hooks/WellcomPageHook";
import '../GioiThieuVaDKKhoaHoc/DanhSachKhoaHoc.css'; 

function TimKiemKhoaHoc() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q'); // Lấy từ khóa người dùng nhập từ URL frontend
    const navigate = useNavigate();
    const { courses: navCourses } = useCourses();

    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (!query) return;

            setIsLoading(true);
            setError(null);
            try {
                // === THAY ĐỔI Ở ĐÂY ===
                // Sử dụng method GET
                // params: { searchTerm: query } sẽ tự động tạo ra url: .../TimKiemKhoaHoc?searchTerm=giatri
                const response = await axios.get(APIRoute.getSearchURL(), {
                    params: {
                        searchTerm: query 
                    }
                });

                if (response.status === 200) {
                    setResults(response.data);
                }
            } catch (err) {
                console.error("Lỗi tìm kiếm:", err);
                setError("Đã xảy ra lỗi khi kết nối đến server.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchSearchResults();
    }, [query]);

    // ... Phần render giao diện (JSX) giữ nguyên như cũ ...
    // ... (Chỉ paste lại phần return bên dưới nếu bạn cần, nhưng logic hiển thị không đổi)
    
    return (
        <div>
            <CustomNavbar navigate={navigate} courses={navCourses} />
            <div className="courses-list-section" style={{ minHeight: '60vh', paddingTop: '140px' }}>
                <Container>
                    <h3 className="mb-4 border-bottom pb-2">
                        Kết quả tìm kiếm cho: <span className="text-primary">"{query}"</span>
                    </h3>

                    {isLoading ? (
                        <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>
                    ) : error ? (
                        <Alert variant="danger">{error}</Alert>
                    ) : results.length === 0 ? (
                        <Alert variant="warning" className="text-center mt-4">
                            <i className="fas fa-search me-2"></i>
                            Không tìm thấy khóa học nào phù hợp.
                        </Alert>
                    ) : (
                        <Row>
                            {results.map(course => (
                                <Col key={course.id} lg={3} md={6} className="mb-4 d-flex align-items-stretch">
                                    <Card className="course-item-card h-100">
                                        <Card.Img 
                                            variant="top" 
                                            src={APIRoute.getUrlImage(course.hinhAnh)} 
                                            style={{height: '200px', objectFit: 'cover'}}
                                            onError={(e) => {e.target.onerror = null; e.target.src = "/path/to/default-image.jpg"}} // Xử lý nếu ảnh lỗi
                                        />
                                        <Card.Body className="d-flex flex-column">
                                            <Card.Title className="fw-bold">{course.tenKH}</Card.Title>
                                            <Card.Text className="text-muted small flex-grow-1">
                                                {course.moTa?.length > 80 ? `${course.moTa.substring(0, 80)}...` : course.moTa}
                                            </Card.Text>
                                            <div className="course-info mt-auto pt-3 border-top">
                                                <div className="d-flex justify-content-between align-items-center w-100">
                                                    <span className="text-muted small">
                                                        <i className="fas fa-clock me-1"></i>{course.thoiGianHoc} buổi
                                                    </span>
                                                    <span className="course-fee fw-bold text-danger">
                                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(course.hocPhi - (course.giamGia || 0))}
                                                    </span>
                                                </div>
                                            </div>
                                        </Card.Body>
                                        <Card.Footer className="bg-white border-0 p-3">
                                            <Button 
                                                variant="primary" 
                                                className="w-100 fw-bold" 
                                                onClick={() => navigate(`/khoa-hoc/${course.id}`)}
                                                style={{background: 'linear-gradient(45deg, #0d6efd, #6610f2)', border: 'none'}}
                                            >
                                                Xem chi tiết
                                            </Button>
                                        </Card.Footer>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    )}
                </Container>
            </div>
            <Footer />
        </div>
    );
}

export default TimKiemKhoaHoc;