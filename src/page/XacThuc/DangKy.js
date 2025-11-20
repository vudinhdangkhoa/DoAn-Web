import axios from "axios";
import React, { useState, useEffect } from "react";
import { Button, Container, Form, Alert, Card, Row, Col, Spinner, InputGroup, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import APIRoute from "../../APIRoute";
import DungChung from "../../DungChung";

function DangKy() {
    const navigate = useNavigate();

    const [errorMessage, setErrorMessage] = React.useState('');
    const [successMessage, setSuccessMessage] = React.useState('');
    const [IsLoading, setIsLoading] = React.useState(false);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [dob, setDob] = useState('');
    const [otp, setOtp] = useState('');

    const [showOtpField, setShowOtpField] = useState(false);

    // ✅ Auto clear error message sau 2 giây
    useEffect(() => {
        if (errorMessage) {
            const timer = setTimeout(() => {
                setErrorMessage('');
            }, 2000);

            return () => clearTimeout(timer); // Cleanup timer
        }
    }, [errorMessage]);

    // ✅ Auto clear success message sau 2 giây
    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage('');
            }, 2000);

            return () => clearTimeout(timer); // Cleanup timer
        }
    }, [successMessage]);

    // Hàm validate form
    const validateForm = () => {
        window.scrollTo(0, 0);
        if (!name.trim()) {
            setErrorMessage("Vui lòng nhập họ và tên.");
            return false;
        }
        if (!email.trim()) {
            setErrorMessage("Vui lòng nhập email.");
            return false;
        }
        if (!password.trim()) {
            setErrorMessage("Vui lòng nhập mật khẩu.");
            return false;
        }
        if (!phone.trim()) {
            setErrorMessage("Vui lòng nhập số điện thoại.");
            return false;
        }
        if (!dob.trim()) {
            setErrorMessage("Vui lòng nhập ngày sinh.");
            return false;
        }
        if (password.length < 6) {
            setErrorMessage("Mật khẩu phải có ít nhất 6 ký tự.");
            return false;
        }
        if (`${phone}`.length < 10 || `${phone}`.length > 11) {
            setErrorMessage("Số điện thoại không hợp lệ.");
            return false;
        }
        if (isNaN(Date.parse(dob))) {
            setErrorMessage("Ngày sinh không hợp lệ.");
            return false;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setErrorMessage("Email không hợp lệ.");
            return false;
        }
        if (!/^\d+$/.test(phone)) {
            setErrorMessage("Số điện thoại chỉ được chứa chữ số.");
            return false;
        }
        setErrorMessage('');
        return true;
    };

    const handleSubmit = async (event) => {
        const form = event.currentTarget;
        event.preventDefault();

        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            try {
                if (!validateForm()) {
                    return;
                }
                setIsLoading(true);
                setErrorMessage('');
                console.log("mk:", password);
                console.log("name:", name);
                console.log("email:", email);
                console.log("phone:", phone);
                console.log("dob:", dob);

                // Gọi API đăng ký ở đây

                const response = await axios.post(APIRoute.getURL(`XacThuc/SendOTP`), {
                    mail: email,
                    matKhau: password.trim(),
                    tenHV: name.trim(),
                    ngaySinh: dob,
                    sdt: phone.trim(),
                    otp: otp.trim()
                });

                if (response.status === 200) {
                    console.log(response.data);
                    setSuccessMessage(response.data.message);
                    setIsLoading(false);
                    setShowOtpField(true);
                }
            } catch (error) {
                console.error('Registration Error:', error);
                setErrorMessage(error.response?.data?.message || 'Đăng ký thất bại');
                setIsLoading(false);
            }
        }

    }

    const handleVerifyOtp = async () => {

        try {
            setIsLoading(true);
            const response = await axios.post(APIRoute.getURL(`XacThuc/DangKy`), {
                mail: email,
                matKhau: password.trim(),
                tenHV: name.trim(),
                ngaySinh: dob,
                sdt: phone.trim(),
                otp: otp.trim()
            });

            if (response.status === 200) {
                console.log(response.data);
                setShowOtpField(false);
                setSuccessMessage(response.data.message);
                setIsLoading(false);

                setTimeout(() => {
                    navigate('/DangNhap');
                }, 2500);
            }

        } catch (error) {
            console.error('OTP Error:', error);
            setErrorMessage(error.response?.data?.message || 'Gửi OTP thất bại');
            setIsLoading(false);
        }

    }


    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
        }}>
            <Container>



                <Row className="justify-content-center">
                    <Col md={8} lg={6} xl={5}>
                        {/* Back Button */}
                        <div className="mb-4">
                            <Button
                                variant="outline-light"
                                onClick={() => navigate('/')}
                                className="d-flex align-items-center border-0"
                                style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}
                            >
                                <i className="fas fa-home me-2"></i>
                                Về Trang Chủ
                            </Button>
                        </div>

                        {/* Alert Messages */}
                        {errorMessage && (
                            <Alert
                                variant="danger"
                                className="mb-4"
                                dismissible
                                onClose={() => setErrorMessage('')}
                                style={{
                                    background: 'rgba(220, 53, 69, 0.9)',
                                    border: 'none',
                                    backdropFilter: 'blur(10px)',
                                    color: 'white'
                                }}
                            >
                                <i className="fas fa-exclamation-triangle me-2"></i>
                                {errorMessage}
                            </Alert>
                        )}

                        {successMessage && (
                            <Alert
                                variant="success"
                                className="mb-4"
                                dismissible
                                onClose={() => setSuccessMessage('')}
                                style={{
                                    background: 'rgba(25, 135, 84, 0.9)',
                                    border: 'none',
                                    backdropFilter: 'blur(10px)',
                                    color: 'white'
                                }}
                            >
                                <i className="fas fa-check-circle me-2"></i>
                                {successMessage}
                            </Alert>
                        )}

                        {/* Main Card */}
                        <Card
                            className="shadow-lg border-0"
                            style={{
                                background: 'rgba(255, 255, 255, 0.95)',
                                backdropFilter: 'blur(20px)',
                                borderRadius: '20px'
                            }}
                        >
                            <Card.Body className="p-5">
                                {/* Header */}
                                <div className="text-center mb-4">
                                    <div
                                        className="mx-auto mb-3 d-flex align-items-center justify-content-center"
                                        style={{
                                            width: '80px',
                                            height: '80px',
                                            background: 'linear-gradient(135deg, #28a745, #20c997)',
                                            borderRadius: '20px',
                                            boxShadow: '0 10px 30px rgba(40, 167, 69, 0.3)'
                                        }}
                                    >
                                        <i className="fas fa-user-plus text-white" style={{ fontSize: '2rem' }}></i>
                                    </div>
                                    <h3 className="fw-bold text-dark mb-2">Tạo Tài Khoản</h3>
                                    <p className="text-muted mb-0">
                                        Tham gia cộng đồng học viên mỹ thuật KSL
                                    </p>
                                </div>

                                {/* Form */}
                                <Form onSubmit={handleSubmit} >
                                    <Row>
                                        {/* Họ và Tên */}
                                        <Col md={12} className="mb-3">
                                            <Form.Group>
                                                <Form.Label className="fw-semibold text-dark mb-2">
                                                    <i className="fas fa-user me-2 text-success"></i>
                                                    Họ và Tên
                                                </Form.Label>
                                                <InputGroup>
                                                    <InputGroup.Text
                                                        style={{
                                                            background: 'linear-gradient(135deg, #28a745, #20c997)',
                                                            border: 'none',
                                                            color: 'white'
                                                        }}
                                                    >
                                                        <i className="fas fa-id-card"></i>
                                                    </InputGroup.Text>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Nhập họ và tên đầy đủ"
                                                        value={name}
                                                        onChange={(e) => setName(e.target.value)}
                                                        required
                                                        disabled={IsLoading}
                                                        style={{
                                                            border: 'none',
                                                            fontSize: '1rem',
                                                            padding: '12px 16px',
                                                            background: 'rgba(248, 249, 250, 0.8)'
                                                        }}
                                                        className="shadow-sm"
                                                    />
                                                </InputGroup>
                                            </Form.Group>
                                        </Col>

                                        {/* Email */}
                                        <Col md={12} className="mb-3">
                                            <Form.Group>
                                                <Form.Label className="fw-semibold text-dark mb-2">
                                                    <i className="fas fa-envelope me-2 text-primary"></i>
                                                    Địa chỉ Email
                                                </Form.Label>
                                                <InputGroup>
                                                    <InputGroup.Text
                                                        style={{
                                                            background: 'linear-gradient(135deg, #007bff, #0056b3)',
                                                            border: 'none',
                                                            color: 'white'
                                                        }}
                                                    >
                                                        <i className="fas fa-at"></i>
                                                    </InputGroup.Text>
                                                    <Form.Control
                                                        type="email"
                                                        placeholder="Nhập địa chỉ email"
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        required
                                                        disabled={IsLoading}
                                                        style={{
                                                            border: 'none',
                                                            fontSize: '1rem',
                                                            padding: '12px 16px',
                                                            background: 'rgba(248, 249, 250, 0.8)'
                                                        }}
                                                        className="shadow-sm"
                                                    />
                                                </InputGroup>
                                            </Form.Group>
                                        </Col>

                                        {/* Mật khẩu */}
                                        <Col md={12} className="mb-3">
                                            <Form.Group>
                                                <Form.Label className="fw-semibold text-dark mb-2">
                                                    <i className="fas fa-lock me-2 text-warning"></i>
                                                    Mật Khẩu
                                                </Form.Label>
                                                <InputGroup>
                                                    <InputGroup.Text
                                                        style={{
                                                            background: 'linear-gradient(135deg, #ffc107, #e0a800)',
                                                            border: 'none',
                                                            color: 'white'
                                                        }}
                                                    >
                                                        <i className="fas fa-shield-alt"></i>
                                                    </InputGroup.Text>
                                                    <Form.Control
                                                        type="password"
                                                        placeholder="Nhập mật khẩu"
                                                        value={password}
                                                        onChange={(e) => setPassword(e.target.value)}
                                                        required
                                                        disabled={IsLoading}
                                                        minLength="6"
                                                        style={{
                                                            border: 'none',
                                                            fontSize: '1rem',
                                                            padding: '12px 16px',
                                                            background: 'rgba(248, 249, 250, 0.8)'
                                                        }}
                                                        className="shadow-sm"
                                                    />
                                                </InputGroup>
                                            </Form.Group>
                                        </Col>

                                        {/* Số điện thoại */}
                                        <Col md={6} className="mb-3">
                                            <Form.Group>
                                                <Form.Label className="fw-semibold text-dark mb-2">
                                                    <i className="fas fa-phone me-2 text-info"></i>
                                                    Số Điện Thoại
                                                </Form.Label>
                                                <InputGroup>
                                                    <InputGroup.Text
                                                        style={{
                                                            background: 'linear-gradient(135deg, #17a2b8, #138496)',
                                                            border: 'none',
                                                            color: 'white'
                                                        }}
                                                    >
                                                        <i className="fas fa-mobile-alt"></i>
                                                    </InputGroup.Text>
                                                    <Form.Control
                                                        type="tel"
                                                        placeholder="Số điện thoại"
                                                        value={phone}
                                                        onChange={(e) => setPhone(e.target.value)}
                                                        required
                                                        disabled={IsLoading}
                                                        style={{
                                                            border: 'none',
                                                            fontSize: '1rem',
                                                            padding: '12px 16px',
                                                            background: 'rgba(248, 249, 250, 0.8)'
                                                        }}
                                                        className="shadow-sm"
                                                    />
                                                </InputGroup>
                                            </Form.Group>
                                        </Col>

                                        {/* Ngày sinh */}
                                        <Col md={6} className="mb-4">
                                            <Form.Group>
                                                <Form.Label className="fw-semibold text-dark mb-2">
                                                    <i className="fas fa-calendar me-2 text-danger"></i>
                                                    Ngày Sinh
                                                </Form.Label>
                                                <InputGroup>
                                                    <InputGroup.Text
                                                        style={{
                                                            background: 'linear-gradient(135deg, #dc3545, #c82333)',
                                                            border: 'none',
                                                            color: 'white'
                                                        }}
                                                    >
                                                        <i className="fas fa-birthday-cake"></i>
                                                    </InputGroup.Text>
                                                    <Form.Control
                                                        type="date"
                                                        value={dob}
                                                        onChange={(e) => setDob(e.target.value)}
                                                        required
                                                        disabled={IsLoading}
                                                        max={new Date().toISOString().split("T")[0]}
                                                        style={{
                                                            border: 'none',
                                                            fontSize: '1rem',
                                                            padding: '12px 16px',
                                                            background: 'rgba(248, 249, 250, 0.8)'
                                                        }}
                                                        className="shadow-sm"
                                                    />
                                                </InputGroup>
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    {/* Submit Button */}
                                    <div className="d-grid mb-4">
                                        <Button
                                            variant="primary"
                                            type="submit"
                                            disabled={IsLoading}
                                            size="lg"
                                            style={{
                                                background: IsLoading
                                                    ? 'linear-gradient(135deg, #6c757d, #495057)'
                                                    : 'linear-gradient(135deg, #28a745, #20c997)',
                                                border: 'none',
                                                borderRadius: '15px',
                                                padding: '12px',
                                                fontWeight: '600',
                                                fontSize: '1.1rem',
                                                boxShadow: '0 8px 25px rgba(40, 167, 69, 0.3)',
                                                transition: 'all 0.3s ease'
                                            }}

                                        >
                                            {IsLoading ? (
                                                <>
                                                    <Spinner
                                                        as="span"
                                                        animation="border"
                                                        size="sm"
                                                        role="status"
                                                        className="me-2"
                                                    />
                                                    Đang xử lý...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="fas fa-user-plus me-2"></i>
                                                    Tạo Tài Khoản
                                                </>
                                            )}
                                        </Button>
                                    </div>

                                    {/* Terms */}
                                    <div className="text-center mb-3">
                                        <small className="text-muted">
                                            Bằng việc đăng ký, bạn đồng ý với{' '}
                                            <a href="#" className="text-primary text-decoration-none">
                                                Điều khoản sử dụng
                                            </a>{' '}
                                            và{' '}
                                            <a href="#" className="text-primary text-decoration-none">
                                                Chính sách bảo mật
                                            </a>
                                        </small>
                                    </div>
                                </Form>

                                {/* Footer Links */}
                                <div className="text-center pt-3 border-top">
                                    <p className="text-muted mb-3">Bạn đã có tài khoản?</p>
                                    <div className="d-flex gap-3 justify-content-center">
                                        <Button
                                            variant="outline-primary"
                                            onClick={() => navigate('/DangNhap')}
                                            className="flex-fill"
                                            style={{ borderRadius: '10px' }}
                                        >
                                            <i className="fas fa-sign-in-alt me-2"></i>
                                            Đăng Nhập
                                        </Button>
                                        <Button
                                            variant="outline-secondary"
                                            onClick={() => navigate('/QuenMatKhau')}
                                            className="flex-fill"
                                            style={{ borderRadius: '10px' }}
                                        >
                                            <i className="fas fa-key me-2"></i>
                                            Quên Mật Khẩu
                                        </Button>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
            <Modal
                show={showOtpField}
                onHide={() => setShowOtpField(false)}
                centered
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header
                    closeButton
                    style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        border: 'none',
                        borderTopLeftRadius: '15px',
                        borderTopRightRadius: '15px'
                    }}
                >
                    <Modal.Title className="d-flex align-items-center">
                        <div
                            className="me-3 d-flex align-items-center justify-content-center"
                            style={{
                                width: '40px',
                                height: '40px',
                                background: 'rgba(255, 255, 255, 0.2)',
                                borderRadius: '10px',
                                backdropFilter: 'blur(10px)'
                            }}
                        >
                            <i className="fas fa-mobile-alt text-white"></i>
                        </div>
                        <div>
                            <h5 className="mb-0 fw-bold">Xác Thực OTP</h5>
                            <small className="opacity-75">Bước cuối để hoàn tất đăng ký</small>
                        </div>
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body
                    className="p-4"
                    style={{
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,249,250,0.95) 100%)',
                        backdropFilter: 'blur(20px)'
                    }}
                >
                    {/* --- THÊM PHẦN ALERT VÀO ĐÂY --- */}
                    {errorMessage && (
                        <Alert variant="danger" className="mb-3 shadow-sm border-0" style={{ fontSize: '0.9rem' }}>
                            <i className="fas fa-exclamation-triangle me-2"></i>
                            {errorMessage}
                        </Alert>
                    )}

                    {successMessage && (
                        <Alert variant="success" className="mb-3 shadow-sm border-0" style={{ fontSize: '0.9rem' }}>
                            <i className="fas fa-check-circle me-2"></i>
                            {successMessage}
                        </Alert>
                    )}
                    {/* ------------------------------- */}

                    <div className="text-center mb-4">
                        <div
                            className="mx-auto mb-3 d-flex align-items-center justify-content-center"
                            style={{
                                width: '60px',
                                height: '60px',
                                background: 'linear-gradient(135deg, #28a745, #20c997)',
                                borderRadius: '50%',
                                boxShadow: '0 8px 25px rgba(40, 167, 69, 0.3)'
                            }}
                        >
                            <i className="fas fa-shield-alt text-white" style={{ fontSize: '1.5rem' }}></i>
                        </div>
                        <h6 className="fw-bold text-dark mb-2">Nhập Mã Xác Thực</h6>
                        <p className="text-muted mb-0 small">
                            Mã OTP đã được gửi đến mail đăng ký <br />
                            <strong className="text-primary">{email}</strong>
                        </p>
                    </div>

                    <Form.Group className="mb-4">
                        <Form.Label className="fw-semibold text-dark mb-3 d-flex align-items-center justify-content-center">
                            <i className="fas fa-key me-2 text-warning"></i>
                            Mã OTP (6 chữ số)
                        </Form.Label>
                        <InputGroup size="lg">
                            <InputGroup.Text
                                style={{
                                    background: 'linear-gradient(135deg, #ffc107, #e0a800)',
                                    border: 'none',
                                    color: 'white'
                                }}
                            >
                                <i className="fas fa-hashtag"></i>
                            </InputGroup.Text>
                            <Form.Control
                                type="text"
                                placeholder="000000"
                                value={otp}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                                    setOtp(value);
                                }}
                                maxLength="6"
                                disabled={IsLoading}
                                style={{
                                    border: 'none',
                                    fontSize: '1.2rem',
                                    fontWeight: '600',
                                    letterSpacing: '0.5em',
                                    textAlign: 'center',
                                    padding: '15px',
                                    background: 'rgba(248, 249, 250, 0.8)',
                                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
                                }}
                                className="shadow-sm"
                            />
                        </InputGroup>
                        <div className="mt-2 text-center">
                            <small className="text-muted">
                                Vui lòng kiểm tra Mail bạn đã đăng ký
                            </small>
                        </div>
                    </Form.Group>

                    {/* Progress indicator - Giữ nguyên */}
                    <div className="text-center mb-3">
                        <div className="d-flex justify-content-center align-items-center">
                            <div className="step-indicator completed">
                                <i className="fas fa-check"></i>
                            </div>
                            <div className="step-line completed"></div>
                            <div className="step-indicator completed">
                                <i className="fas fa-envelope"></i>
                            </div>
                            <div className="step-line active"></div>
                            <div className="step-indicator active">
                                <i className="fas fa-mobile-alt"></i>
                            </div>
                        </div>
                        <div className="d-flex justify-content-between mt-2">
                            <small className="text-success fw-bold">Thông tin</small>
                            <small className="text-success fw-bold">Gửi OTP</small>
                            <small className="text-primary fw-bold">Xác thực</small>
                        </div>
                    </div>
                </Modal.Body>

                <Modal.Footer
                    className="p-4 border-0"
                    style={{
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,249,250,0.95) 100%)',
                        borderBottomLeftRadius: '15px',
                        borderBottomRightRadius: '15px'
                    }}
                >
                    <div className="w-100">
                        <div className="d-grid gap-2 mb-3">
                            <Button
                                variant="primary"
                                onClick={handleVerifyOtp}
                                disabled={IsLoading || otp.length !== 6}
                                size="lg"
                                style={{
                                    background: IsLoading || otp.length !== 6
                                        ? 'linear-gradient(135deg, #6c757d, #495057)'
                                        : 'linear-gradient(135deg, #28a745, #20c997)',
                                    border: 'none',
                                    borderRadius: '12px',
                                    padding: '12px',
                                    fontWeight: '600',
                                    fontSize: '1.1rem',
                                    boxShadow: otp.length === 6 ? '0 8px 25px rgba(40, 167, 69, 0.3)' : 'none',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                {IsLoading ? (
                                    <>
                                        <Spinner
                                            as="span"
                                            animation="border"
                                            size="sm"
                                            role="status"
                                            className="me-2"
                                        />
                                        Đang xác thực...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-check-circle me-2"></i>
                                        Xác Nhận OTP
                                    </>
                                )}
                            </Button>

                            <Button
                                variant="outline-secondary"
                                onClick={() => {
                                    setShowOtpField(false);
                                    setOtp('');
                                    setIsLoading(false);
                                }}
                                disabled={IsLoading}
                                style={{
                                    borderRadius: '12px',
                                    fontWeight: '600'
                                }}
                            >
                                <i className="fas fa-times me-2"></i>
                                Hủy Bỏ
                            </Button>
                        </div>

                        {/* Resend OTP option */}
                        <div className="text-center">
                            <small className="text-muted">
                                Không nhận được mã? {' '}
                                <Button
                                    variant="link"
                                    size="sm"
                                    className="p-0 text-decoration-none fw-bold"
                                    onClick={handleSubmit}
                                    disabled={IsLoading}
                                    style={{ fontSize: '0.85rem' }}
                                >
                                    Gửi lại OTP
                                </Button>
                            </small>
                        </div>
                    </div>
                </Modal.Footer>

                {/* Add custom styles */}
                <style jsx>{`
        .step-indicator {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.8rem;
            font-weight: bold;
        }
        
        .step-indicator.completed {
            background: linear-gradient(135deg, #28a745, #20c997);
            color: white;
        }
        
        .step-indicator.active {
            background: linear-gradient(135deg, #007bff, #0056b3);
            color: white;
        }
        
        .step-line {
            width: 40px;
            height: 3px;
            margin: 0 10px;
        }
        
        .step-line.completed {
            background: linear-gradient(135deg, #28a745, #20c997);
        }
        
        .step-line.active {
            background: linear-gradient(135deg, #007bff, #0056b3);
        }
        
        .modal-content {
            border-radius: 15px !important;
            border: none !important;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3) !important;
        }
        
        .modal-header .btn-close {
            background-color: rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            opacity: 0.8;
        }
        
        .modal-header .btn-close:hover {
            opacity: 1;
            background-color: rgba(255, 255, 255, 0.3);
        }
    `}
                </style>
            </Modal>
        </div>
    );
}

export default DangKy;