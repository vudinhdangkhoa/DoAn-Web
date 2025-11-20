import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Card, Form, Button, Spinner, Row, Col, Alert } from "react-bootstrap";
import axios from "axios";
import APIRoute from "../../APIRoute";
// import CustomNavbar from "../../components/WellcomePage/Navbar"; // Đã bỏ
import Footer from "../../components/WellcomePage/Footer";
import './Feedback.css';

const Feedback = () => {
    const { idLopHoc, idHocVien } = useParams();
    const navigate = useNavigate();
    
    // State
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });
    const [courseInfo, setCourseInfo] = useState(null);
    const [loadingInfo, setLoadingInfo] = useState(true);

    const ratingLabels = {
        1: "Rất không hài lòng 😞",
        2: "Không hài lòng 😕",
        3: "Bình thường 😐",
        4: "Hài lòng 🙂",
        5: "Tuyệt vời! 🥰"
    };

    // Fetch info
    useEffect(() => {
        const fetchCourseInfo = async () => {
            try {
                // Nhớ chỉnh lại APIRoute cho đúng Controller
                const response = await axios.get(APIRoute.getURL(`Feedback/GetDetailKhoaHocFeedback/${idLopHoc}`));
                if (response.status === 200) {
                    setCourseInfo(response.data);
                }
            } catch (error) {
                console.error("Lỗi tải thông tin:", error);
                setMessage({ type: "danger", text: "Không thể tải thông tin lớp học." });
            } finally {
                setLoadingInfo(false);
            }
        };

        if (idLopHoc) fetchCourseInfo();
    }, [idLopHoc]);

    // Handle Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            setMessage({ type: "warning", text: "Bạn ơi, hãy tặng sao cho lớp học nhé!" });
            return;
        }

        setIsSubmitting(true);
        setMessage({ type: "", text: "" });

        const payload = {
            IdHocVien: parseInt(idHocVien),
            IdLopHoc: parseInt(idLopHoc),
            SoSao: rating,
            NoiDung: comment
        };

        try {
            // Nhớ chỉnh lại APIRoute cho đúng Controller
            const response = await axios.post(APIRoute.getURL("Feedback/SubmitFeedback"), payload);
            if (response.status === 200) {
                setMessage({ type: "success", text: "Cảm ơn đánh giá quý báu của bạn!" });
                setTimeout(() => navigate(-1), 2000);
            }
        } catch (error) {
            setMessage({ type: "danger", text: error.response?.data?.message || "Gửi đánh giá thất bại. Vui lòng thử lại." });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loadingInfo) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    return (
        <div className="position-relative">
            {/* --- PHẦN HEADER TÙY CHỈNH (CUSTOM BRAND HEADER) --- */}
            <div className="brand-header">
                <Container className="d-flex justify-content-between align-items-center">
                    {/* Logo & Tên trung tâm */}
                    <div className="d-flex align-items-center gap-3">
                        <img 
                            src="/logoKSL.png" 
                            alt="KSL Art Logo" 
                            className="brand-logo-img" 
                        />
                        <div className="d-none d-sm-block">
                            <h5 className="brand-name">PPA ART CENTER</h5>
                            <p className="brand-slogan">Sáng tạo không giới hạn</p>
                        </div>
                    </div>

                    {/* Nút về trang chủ nhỏ gọn */}
                    <Button 
                        variant="outline-secondary" 
                        size="sm" 
                        className="rounded-pill px-3 fw-bold border-2"
                        onClick={() => navigate('/')}
                    >
                        <i className="fas fa-home me-1"></i> Trang chủ
                    </Button>
                </Container>
            </div>

            {/* --- NỘI DUNG CHÍNH --- */}
            <div className="feedback-page">
                <Container>
                    {/* Tiêu đề trang */}
                    <div className="mb-5 text-center">
                        <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill mb-3 fw-bold">
                            FEEDBACK
                        </span>
                        <h2 className="fw-bold text-dark display-6">Phản Hồi Chất Lượng Đào Tạo</h2>
                        <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
                            Ý kiến đóng góp của bạn là động lực to lớn giúp đội ngũ PPA Art Center nâng cao chất lượng giảng dạy mỗi ngày.
                        </p>
                    </div>

                    <Row className="g-4 justify-content-center">
                        {/* CỘT TRÁI: THÔNG TIN */}
                        <Col lg={5} md={12}>
                            <Card className="course-info-card">
                                <div className="course-info-header">
                                    <h4 className="mb-1">{courseInfo?.tenKhoaHoc}</h4>
                                    <div className="opacity-75 small">
                                        <i className="fas fa-hashtag me-2"></i>Tên lớp: {courseInfo?.tenLopHoc}
                                    </div>
                                </div>
                                <Card.Body className="p-4">
                                    <div className="mb-4">
                                        <div className="info-label">Giảng Viên</div>
                                        <div className="mt-2">
                                            {courseInfo?.giaoViens && courseInfo.giaoViens.length > 0 ? (
                                                courseInfo.giaoViens.map((gv, index) => (
                                                    <span key={index} className="teacher-badge">
                                                        {gv.tenGv}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-muted">--</span>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="info-label">Giới thiệu</div>
                                        <p className="text-muted text-justify small mb-0" style={{ lineHeight: '1.6' }}>
                                            {courseInfo?.moTa}
                                        </p>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>

                        {/* CỘT PHẢI: FORM */}
                        <Col lg={7} md={12}>
                            <Card className="course-info-card">
                                <Card.Body className="p-4 p-lg-5 d-flex flex-column justify-content-center">
                                    {message.text && (
                                        <Alert variant={message.type} dismissible onClose={() => setMessage({ type: "", text: "" })}>
                                            {message.text}
                                        </Alert>
                                    )}

                                    <Form onSubmit={handleSubmit}>
                                        <div className="text-center mb-4">
                                            <h5 className="fw-bold text-dark">Trải nghiệm của bạn thế nào?</h5>
                                            
                                            <div className="star-rating-container">
                                                {[...Array(5)].map((_, index) => {
                                                    const ratingValue = index + 1;
                                                    return (
                                                        <i
                                                            key={index}
                                                            className={`fas fa-star star-icon ${
                                                                ratingValue <= (hover || rating) ? "active" : ""
                                                            }`}
                                                            onClick={() => setRating(ratingValue)}
                                                            onMouseEnter={() => setHover(ratingValue)}
                                                            onMouseLeave={() => setHover(rating)}
                                                        ></i>
                                                    );
                                                })}
                                            </div>
                                            <div className="fw-bold text-primary h6">
                                                {hover > 0 ? ratingLabels[hover] : (rating > 0 ? ratingLabels[rating] : "Chạm vào sao để đánh giá")}
                                            </div>
                                        </div>

                                        <Form.Group className="mb-4">
                                            <Form.Label className="fw-bold text-secondary small">GÓP Ý CHI TIẾT</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={4}
                                                className="custom-textarea"
                                                placeholder="Chia sẻ thêm với chúng tôi..."
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)}
                                            />
                                        </Form.Group>

                                        <div className="d-flex justify-content-end gap-3 pt-2">
                                            <Button 
                                                variant="light" 
                                                onClick={() => navigate(-1)}
                                                className="px-4 fw-bold text-muted"
                                            >
                                                Bỏ qua
                                            </Button>
                                            <Button 
                                                variant="primary" 
                                                type="submit" 
                                                disabled={isSubmitting}
                                                className="px-5 fw-bold shadow-sm text-white"
                                                style={{ 
                                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                                                    border: 'none' 
                                                }}
                                            >
                                                {isSubmitting ? <Spinner animation="border" size="sm" /> : "Gửi Ngay"}
                                            </Button>
                                        </div>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
            <Footer />
        </div>
    );
};

export default Feedback;