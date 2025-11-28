import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Row, Col, Card, Button, Spinner, Alert } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";
import { useEffect, useState } from "react";
import Footer from "../../components/WellcomePage/Footer";
import CustomNavbar from '../../components/WellcomePage/Navbar';
import { useCourses } from "../../Hooks/WellcomPageHook";
import APIRoute from "../../APIRoute";
import './DanhSachKhoaHoc.css';

function DanhSachKhoaHoc() {

    const { courses: navCourses } = useCourses(); // Đổi tên để tránh xung đột
    const { idLoaiKhoaHoc } = useParams();

    const [coursesList, setCoursesList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [loadingLoaiKhoaHoc, setLoadingLoaiKhoaHoc] = useState(true);
    const [errorLoaiKhoaHoc, setErrorLoaiKhoaHoc] = useState(null);
    const [detailLoaiKhoaHoc, setDetailLoaiKhoaHoc] = useState(null);

    const navigate = useNavigate();

    const handleCourseDetail = (courseId) => {
        navigate(`/khoa-hoc/${courseId}`);
    };

    useEffect(() => {
        // Hàm fetch danh sách khóa học
        const fetchCourses = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await axios.get(APIRoute.getURL(`TrangChu/GetAllKhoaHocOfLoaiKhoaHoc/${idLoaiKhoaHoc}`));
                if (response.status === 200) {
                    setCoursesList(response.data);
                    console.log("Danh sách khóa học:", response.data);
                }
            } catch (err) {
                setError("Không thể tải danh sách khóa học.");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        // Hàm fetch chi tiết loại khóa học
        const fetchLoaiKhoaHocDetail = async () => {
            setLoadingLoaiKhoaHoc(true);
            setErrorLoaiKhoaHoc(null);
            try {
                const response = await axios.get(APIRoute.getURL(`TrangChu/GetDetailLoaiKhoaHoc/${idLoaiKhoaHoc}`));
                if (response.status === 200) {
                    setDetailLoaiKhoaHoc(response.data);
                }
            } catch (err) {
                setErrorLoaiKhoaHoc("Không thể tải thông tin về loại khóa học này.");
                console.error(err);
            } finally {
                setLoadingLoaiKhoaHoc(false);
            }
        };

        // Gọi cả hai hàm
        fetchCourses();
        fetchLoaiKhoaHocDetail();

    }, [idLoaiKhoaHoc]);



    return (
        <div>
            <CustomNavbar navigate={navigate} courses={navCourses} />

            {/* Section giới thiệu loại khóa học */}
            <Container>
                {loadingLoaiKhoaHoc ? (
                    <div className="text-center py-5"><Spinner animation="border" /></div>
                ) : errorLoaiKhoaHoc ? (
                    <Alert variant="danger" className="mt-5">{errorLoaiKhoaHoc}</Alert>
                ) : detailLoaiKhoaHoc && (
                    <header className="course-category-header">
                        <img src={APIRoute.getUrlImage(detailLoaiKhoaHoc.hinhAnh)} alt={detailLoaiKhoaHoc.tenChuyenMon} className="category-bg-image" />
                        <div className="category-header-content">
                            <h1 className="category-title">{detailLoaiKhoaHoc.tenChuyenMon}</h1>
                            <p className="category-description">{detailLoaiKhoaHoc.moTa}</p>
                        </div>
                    </header>
                )}
            </Container>

            {/* Section danh sách các khóa học */}
            <section className="courses-list-section">
                <Container>
                    <h2 className="text-center mb-5">Các Khóa Học Hiện Có</h2>
                    {isLoading ? (
                        <div className="text-center"><Spinner animation="border" /></div>
                    ) : error ? (
                        <Alert variant="danger">{error}</Alert>
                    ) : (
                        <Row>
                            {coursesList.length > 0 ? (
                                coursesList.map(course => (
                                    <Col key={course.id} lg={3} md={6} className="mb-4 d-flex align-items-stretch">
                                        <Card className="course-item-card">
                                            {console.log('Image URL:', APIRoute.getUrlImage(course.hinhAnh))}
                                            {console.log('course.hinhAnh:', course.hinhAnh)}
                                            {course.hinhAnh !=null? (<Card.Img variant="top" src={APIRoute.getUrlImage(course.hinhAnh)} />):(<Card.Img variant="top" src={'/5-935.jpg'} />)}
                                            
                                            <Card.Body>
                                                <Card.Title>{course.tenKH}</Card.Title>
                                                <Card.Text>
                                                    {course.moTa.length > 100 ? `${course.moTa.substring(0, 100)}...` : course.moTa}
                                                </Card.Text>
                                                <div className="course-info">
                                                    <span className="course-duration">
                                                        <i className="fas fa-clock me-2"></i>{course.thoiGianHoc} buổi
                                                    </span>
                                                    <span className="course-fee">
                                                        {(() => {
                                                            const original = Number(course.hocPhi) || 0;     // Giá gốc (1.600.000)
                                                            const discountAmount = Number(course.giamGia) || 0; // Số tiền giảm (160.000)

                                                            // Tính giá sau giảm: Giá gốc - Tiền giảm
                                                            const finalPrice = original - discountAmount;

                                                            // Tính % giảm để hiển thị cho đẹp
                                                            const percent = original > 0 ? Math.round((discountAmount / original) * 100) : 0;

                                                            const fmt = (v) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);

                                                            return discountAmount > 0 ? (
                                                                <>
                                                                    {/* Giá gốc bị gạch ngang */}
                                                                    <div><del className="text-muted small">{fmt(original)}</del></div>

                                                                    {/* Giá mới + % giảm */}
                                                                    <div className="d-flex align-items-center gap-2">
                                                                        <span className="fw-bold text-danger">{fmt(finalPrice)}</span>
                                                                        <span className="badge bg-danger small" style={{ fontSize: '0.7rem' }}>-{percent}%</span>
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                // Nếu không giảm thì chỉ hiện giá gốc
                                                                <span className="fw-bold text-primary">{fmt(original)}</span>
                                                            );
                                                        })()}
                                                    </span>
                                                </div>
                                            </Card.Body>
                                            <Card.Footer className="bg-white border-0 p-3">
                                                <Button variant="primary" className="btn-register-course" onClick={() => handleCourseDetail(course.id)}>Xem chi tiết</Button>
                                            </Card.Footer>
                                        </Card>
                                    </Col>
                                ))
                            ) : (
                                <Col>
                                    <Alert variant="info">Chưa có khóa học nào trong danh mục này.</Alert>
                                </Col>
                            )}
                        </Row>
                    )}
                </Container>
            </section>

            <Footer />
        </div>
    );
}

export default DanhSachKhoaHoc;