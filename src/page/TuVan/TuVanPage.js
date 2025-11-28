import React, { useState } from 'react';
import { Container, Row, Col, Accordion, Card, Button, Form, Badge } from 'react-bootstrap';
import CustomNavbar from '../../components/WellcomePage/Navbar';
import Footer from '../../components/WellcomePage/Footer';
import { useCourses } from "../../Hooks/WellcomPageHook"; // Tái sử dụng hook lấy menu khóa học
import './TuVanPage.css'; // File CSS ở bước 3
import APIRoute from '../../APIRoute';
import axios from 'axios';

function TuVanPage() {
    const { courses: navCourses } = useCourses();
    const [validated, setValidated] = useState(false);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // State cho form liên hệ
    const [formData, setFormData] = useState({
        hoTen: '',
        email: '',
        sdt: '',
        noiDung: ''
    });

    // Validation functions
    const validateHoTen = (value) => {
        if (!value || value.trim().length === 0) {
            return "Họ và tên không được để trống";
        }
        if (value.trim().length < 2) {
            return "Họ và tên phải có ít nhất 2 ký tự";
        }
        if (value.trim().length > 50) {
            return "Họ và tên không được vượt quá 50 ký tự";
        }
        if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(value.trim())) {
            return "Họ và tên chỉ được chứa chữ cái và khoảng trắng";
        }
        return null;
    };

    const validateSdt = (value) => {
        if (!value || value.trim().length === 0) {
            return "Số điện thoại không được để trống";
        }
        const cleanPhone = value.replace(/\s+/g, '');
        if (!/^0[3-9][0-9]{8}$/.test(cleanPhone)) {
            return "Số điện thoại phải có định dạng: 0xxxxxxxxx (10 chữ số, bắt đầu 03-09)";
        }
        return null;
    };

    const validateEmail = (value) => {
        if (value && value.trim().length > 0) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                return "Email không đúng định dạng";
            }
        }
        return null;
    };

    const validateNoiDung = (value) => {
        if (!value || value.trim().length === 0) {
            return "Nội dung cần tư vấn không được để trống";
        }
        if (value.trim().length < 10) {
            return "Nội dung phải có ít nhất 10 ký tự";
        }
        if (value.trim().length > 500) {
            return "Nội dung không được vượt quá 500 ký tự";
        }
        return null;
    };

    // Validate toàn bộ form
    const validateForm = () => {
        const newErrors = {};
        
        const hoTenError = validateHoTen(formData.hoTen);
        const sdtError = validateSdt(formData.sdt);
        const emailError = validateEmail(formData.email);
        const noiDungError = validateNoiDung(formData.noiDung);
        
        if (hoTenError) newErrors.hoTen = hoTenError;
        if (sdtError) newErrors.sdt = sdtError;
        if (emailError) newErrors.email = emailError;
        if (noiDungError) newErrors.noiDung = noiDungError;
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Xử lý thay đổi input với validation real-time
    const handleInputChange = (field, value) => {
        setFormData({...formData, [field]: value});
        
        // Clear error khi user bắt đầu sửa
        if (errors[field]) {
            setErrors(prev => ({...prev, [field]: null}));
        }
    };

    // Dữ liệu giả lập cho FAQ (Sau này có thể lấy từ API nếu muốn quản lý động)
    const faqs = [
        {
            key: "0",
            question: "Tôi chưa biết gì về mỹ thuật thì nên bắt đầu từ đâu?",
            answer: "Đừng lo lắng! Tại PPA, chúng tôi có khóa 'Nhập môn Mỹ thuật' dành riêng cho người mới bắt đầu (Zero-experience). Bạn sẽ được học từ cách cầm bút, dựng hình khối cơ bản đến phối màu."
        },
        {
            key: "1",
            question: "Học phí có bao gồm họa cụ không?",
            answer: "Học phí thường đã bao gồm giấy vẽ và bảng vẽ tại lớp. Các họa cụ cá nhân như bút chì, màu, cọ... học viên sẽ tự chuẩn bị theo danh sách được giáo viên hướng dẫn buổi đầu tiên (hoặc mua combo tại trung tâm)."
        },
        {
            key: "2",
            question: "Nếu tôi bận đột xuất thì có được học bù không?",
            answer: "Có. Học viên được phép nghỉ và học bù tối đa 3 buổi/khóa. Bạn cần báo trước với giáo vụ ít nhất 2 tiếng qua Zalo hoặc Hotline để được sắp xếp lịch bù phù hợp."
        },
        {
            key: "3",
            question: "Trung tâm có cam kết đầu ra không?",
            answer: "Chúng tôi cam kết học viên sẽ nắm vững kiến thức nền tảng và hoàn thiện ít nhất 1-2 tác phẩm hoàn chỉnh sau khóa học. Ngoài ra, cuối khóa sẽ có buổi triển lãm nhỏ để đánh giá năng lực."
        }
    ];

    // Xử lý gửi form
    const handleSubmit = async (event) => {
        event.preventDefault();
        event.stopPropagation();
        
        if (!validateForm()) {
            setValidated(true);
            return;
        }
        
        setIsSubmitting(true);
        
        try {
            // Chuẩn bị data để gửi
            const submitData = {
                hoTen: formData.hoTen.trim(),
                sdt: formData.sdt.replace(/\s+/g, ''),
                email: formData.email.trim() || null,
                noiDung: formData.noiDung.trim()
            };
            
            // Gọi API gửi liên hệ (Bạn cần viết API này ở backend)
            // const res = await axios.post(APIRoute.getURL('LienHe/GuiLienHe'), submitData);
            
            // Giả lập thời gian gửi
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            alert("Cảm ơn bạn! Chúng tôi đã nhận được câu hỏi và sẽ phản hồi sớm nhất.");
            
            // Reset form
            setFormData({ hoTen: '', email: '', sdt: '', noiDung: '' });
            setValidated(false);
            setErrors({});
            
        } catch (error) {
            console.error(error);
            alert("Có lỗi xảy ra, vui lòng thử lại sau.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="tu-van-page">
            <CustomNavbar courses={navCourses} />
            
            {/* 1. HERO SECTION */}
            <div className="tu-van-hero text-center text-white d-flex align-items-center justify-content-center">
                <Container>
                    <h1 className="fw-bold display-5">Góc Tư Vấn & Giải Đáp</h1>
                    <p className="lead">Mọi thông tin bạn cần để bắt đầu hành trình sáng tạo</p>
                </Container>
            </div>

            <Container className="my-5">
                {/* 2. LỘ TRÌNH GỢI Ý (Self-Service) */}
                <div className="mb-5">
                    <h2 className="text-center text-primary mb-4 fw-bold">Bạn thuộc nhóm nào?</h2>
                    <Row>
                        <Col md={4} className="mb-4">
                            <Card className="h-100 shadow-sm border-0 guide-card">
                                <Card.Body className="text-center">
                                    <div className="icon-wrapper bg-info-subtle text-info mb-3">
                                        <i className="fas fa-child fa-2x"></i>
                                    </div>
                                    <Card.Title className="fw-bold">Thiếu Nhi (5-12 tuổi)</Card.Title>
                                    <Card.Text>
                                        Bé yêu thích màu sắc và vẽ tranh tự do.
                                    </Card.Text>
                                    <div className="suggested-course">
                                        <Badge bg="info" className="me-1">Lớp Sáng tạo</Badge>
                                        <Badge bg="warning" text="dark">Màu sáp/Màu nước</Badge>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={4} className="mb-4">
                            <Card className="h-100 shadow-sm border-0 guide-card">
                                <Card.Body className="text-center">
                                    <div className="icon-wrapper bg-success-subtle text-success mb-3">
                                        <i className="fas fa-graduation-cap fa-2x"></i>
                                    </div>
                                    <Card.Title className="fw-bold">Luyện Thi (13-18 tuổi)</Card.Title>
                                    <Card.Text>
                                        Ôn thi vào các trường ĐH Kiến Trúc, Mỹ Thuật.
                                    </Card.Text>
                                    <div className="suggested-course">
                                        <Badge bg="success" className="me-1">Hình họa chì</Badge>
                                        <Badge bg="danger">Trang trí màu</Badge>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={4} className="mb-4">
                            <Card className="h-100 shadow-sm border-0 guide-card">
                                <Card.Body className="text-center">
                                    <div className="icon-wrapper bg-primary-subtle text-primary mb-3">
                                        <i className="fas fa-palette fa-2x"></i>
                                    </div>
                                    <Card.Title className="fw-bold">Người Lớn / Đi làm</Card.Title>
                                    <Card.Text>
                                        Học để giải trí, xả stress hoặc nâng cao kỹ năng.
                                    </Card.Text>
                                    <div className="suggested-course">
                                        <Badge bg="primary" className="me-1">Sơn dầu</Badge>
                                        <Badge bg="secondary">Màu Acrylic</Badge>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </div>

                <Row>
                    {/* 3. FAQ SECTION (Accordion) */}
                    <Col lg={7} className="mb-5">
                        <h3 className="fw-bold mb-4 border-start border-4 border-primary ps-3">Câu hỏi thường gặp</h3>
                        <Accordion defaultActiveKey="0" flush className="custom-accordion">
                            {faqs.map((item) => (
                                <Accordion.Item eventKey={item.key} key={item.key}>
                                    <Accordion.Header>{item.question}</Accordion.Header>
                                    <Accordion.Body>
                                        {item.answer}
                                    </Accordion.Body>
                                </Accordion.Item>
                            ))}
                        </Accordion>
                        
                        {/* Zalo CTA Button */}
                        <div className="mt-4 p-3 bg-light rounded d-flex align-items-center">
                            <i className="fas fa-headset fa-2x text-primary me-3"></i>
                            <div>
                                <span className="d-block fw-bold">Vẫn chưa tìm thấy câu trả lời?</span>
                                <small>Chat nhanh qua Zalo: <a href="https://zalo.me/0907401493" target="_blank" rel="noreferrer" className="fw-bold text-decoration-none">0907 401 493</a></small>
                            </div>
                        </div>
                    </Col>

                    {/* 4. FORM LIÊN HỆ (Contact Form) */}
                    <Col lg={5}>
                        <Card className="shadow border-0">
                            <Card.Body className="p-4">
                                <h4 className="fw-bold mb-3 text-center">Gửi câu hỏi tư vấn</h4>
                                <p className="text-muted text-center small mb-4">Chúng tôi sẽ phản hồi qua Email/Zalo trong vòng 24h.</p>
                                
                                <Form noValidate onSubmit={handleSubmit}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Họ và tên <span className="text-danger">*</span></Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            placeholder="Nhập tên của bạn"
                                            value={formData.hoTen}
                                            onChange={(e) => handleInputChange('hoTen', e.target.value)}
                                            isInvalid={!!errors.hoTen}
                                            maxLength="50"
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.hoTen}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Số điện thoại (Zalo) <span className="text-danger">*</span></Form.Label>
                                                <Form.Control 
                                                    type="tel" 
                                                    placeholder="0123456789" 
                                                    value={formData.sdt}
                                                    onChange={(e) => handleInputChange('sdt', e.target.value)}
                                                    isInvalid={!!errors.sdt}
                                                    maxLength="11"
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.sdt}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Email (Tùy chọn)</Form.Label>
                                                <Form.Control 
                                                    type="email" 
                                                    placeholder="name@example.com"
                                                    value={formData.email}
                                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                                    isInvalid={!!errors.email}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.email}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Nội dung cần tư vấn <span className="text-danger">*</span></Form.Label>
                                        <Form.Control 
                                            as="textarea" 
                                            rows={4} 
                                            placeholder="Ví dụ: Tôi muốn hỏi về lịch học lớp Sơn dầu..."
                                            value={formData.noiDung}
                                            onChange={(e) => handleInputChange('noiDung', e.target.value)}
                                            isInvalid={!!errors.noiDung}
                                            maxLength="500"
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.noiDung}
                                        </Form.Control.Feedback>
                                        <div className="text-end mt-1">
                                            <small className="text-muted">
                                                {formData.noiDung.length}/500 ký tự
                                            </small>
                                        </div>
                                    </Form.Group>

                                    <Button 
                                        variant="primary" 
                                        type="submit" 
                                        className="w-100 fw-bold py-2"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Đang gửi...
                                            </>
                                        ) : (
                                            'Gửi câu hỏi'
                                        )}
                                    </Button>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
            <Footer />
        </div>
    );
}

export default TuVanPage;