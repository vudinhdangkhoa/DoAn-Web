import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";
import APIRoute from "../../APIRoute";
import DungChung from "../../DungChung";
import { Alert, Container, Form, Modal, Button, Card, Row, Col, Spinner, InputGroup } from "react-bootstrap";



function QuenMatKhau() {

    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');

    const [userId, setUserId] = useState(null);

    const [validated, setValidated] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [IsLoading, setIsLoading] = useState(false);

    const [showModalOTP, setShowModalOTP] = useState(false);
    const [showModalMK, setShowModalMK] = useState(false);



    const validateForm = () => {
        setValidated(true);
        if (!email) {
            setErrorMessage('Email is required');
            return false;
        }
        setErrorMessage('');
        return true;
    };

    const handleSubmit =async (event) => {
        event.preventDefault();
        setIsLoading(true);
        if (!validateForm()) {
            setIsLoading(false);
            return;
        }

        try {
            setErrorMessage('');
            setSuccessMessage('');
            const response = await axios.post(APIRoute.getURL(`XacThuc/QuenMatKhau`), { mail: email, matkhau: "a" });
            if (response.status === 200) {

                setSuccessMessage('Yêu cầu đặt lại mật khẩu thành công. Vui lòng kiểm tra email của bạn.');
                setIsLoading(false);
                setShowModalOTP(true);

            }
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'Yêu cầu đặt lại mật khẩu thất bại.');
            setIsLoading(false);
        }
        // Handle form submission logic here
    }

    useEffect(() => {
        if (errorMessage) {
            const timer = setTimeout(() => {
                setErrorMessage('');
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [errorMessage]);

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage('');
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    const handleVerifyOTP = async () => {

        try {
            setErrorMessage('');
            setSuccessMessage('');
            setIsLoading(true);
            const response = await axios.post(APIRoute.getURL(`XacThuc/XacNhanOTP`), {
                mail: email,
                otp: otp
            });
            if (response.status === 200) {
                setSuccessMessage('Xác thực OTP thành công.');
                setUserId(response.data.userId);
                setShowModalOTP(false);
                setShowModalMK(true);
                setIsLoading(false);
                setOtp('');
            }
        } catch (error) {
            setErrorMessage('Xác thực OTP thất bại.');
            setIsLoading(false);
        } 

    }

    const handleResetPassword = async () => {

        try {

            const response = await axios.post(APIRoute.getURL(`XacThuc/DoiMatKhau/${userId}`), {
                mail: email,
                matKhau: password
            });
            if (response.status === 200) {
                setSuccessMessage('Đặt lại mật khẩu thành công. Vui lòng đăng nhập lại.');
                setShowModalMK(false);
                setIsLoading(false);
                setPassword('');
                setTimeout(() => {
                    navigate(-1);
                },2000);
            }
        } catch (error) {
            setErrorMessage('Đặt lại mật khẩu thất bại.');
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
                    <Col md={6} lg={5} xl={4}>
                        {/* Back Button */}
                        <div className="mb-4">
                            <Button 
                                variant="outline-light" 
                                onClick={() => navigate(-1)}
                                className="d-flex align-items-center border-0"
                                style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}
                            >
                                <i className="fas fa-arrow-left me-2"></i>
                                Quay lại
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
                                            background: 'linear-gradient(135deg, #667eea, #764ba2)',
                                            borderRadius: '20px',
                                            boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)'
                                        }}
                                    >
                                        <i className="fas fa-key text-white" style={{ fontSize: '2rem' }}></i>
                                    </div>
                                    <h3 className="fw-bold text-dark mb-2">Quên Mật Khẩu</h3>
                                    <p className="text-muted mb-0">
                                        Nhập email của bạn để nhận mã xác thực
                                    </p>
                                </div>

                                {/* Form */}
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-4">
                                        <Form.Label className="fw-semibold text-dark mb-2">
                                            <i className="fas fa-envelope me-2 text-primary"></i>
                                            Địa chỉ Email
                                        </Form.Label>
                                        <InputGroup>
                                            <InputGroup.Text 
                                                style={{ 
                                                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                                                    border: 'none',
                                                    color: 'white'
                                                }}
                                            >
                                                <i className="fas fa-at"></i>
                                            </InputGroup.Text>
                                            <Form.Control
                                                type="email"
                                                placeholder="Nhập địa chỉ email của bạn"
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
                                        <Form.Control.Feedback type="invalid">
                                            Vui lòng nhập địa chỉ email hợp lệ
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    <div className="d-grid">
                                        <Button
                                            variant="primary"
                                            type="submit"
                                            disabled={IsLoading}
                                            size="lg"
                                            style={{
                                                background: IsLoading 
                                                    ? 'linear-gradient(135deg, #6c757d, #495057)' 
                                                    : 'linear-gradient(135deg, #667eea, #764ba2)',
                                                border: 'none',
                                                borderRadius: '15px',
                                                padding: '12px',
                                                fontWeight: '600',
                                                fontSize: '1.1rem',
                                                boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
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
                                                    Đang gửi yêu cầu...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="fas fa-paper-plane me-2"></i>
                                                    Gửi Mã Xác Thực
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </Form>

                                {/* Footer Links */}
                                <div className="text-center mt-4 pt-3 border-top">
                                    <p className="text-muted mb-3">Bạn đã nhớ mật khẩu?</p>
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
                                            variant="outline-success"
                                            onClick={() => navigate('/DangKy')}
                                            className="flex-fill"
                                            style={{ borderRadius: '10px' }}
                                        >
                                            <i className="fas fa-user-plus me-2"></i>
                                            Đăng Ký
                                        </Button>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

            {/* OTP Verification Modal */}
            <Modal 
                show={showModalOTP} 
                onHide={() => {
                    setShowModalOTP(false);
                    setOtp('');
                }}
                centered
                backdrop="static"
            >
                <Modal.Header 
                    closeButton
                    style={{ 
                        background: 'linear-gradient(135deg, #667eea, #764ba2)',
                        color: 'white',
                        border: 'none'
                    }}
                >
                    <Modal.Title className="d-flex align-items-center">
                        <i className="fas fa-shield-alt me-2"></i>
                        Xác Thực OTP
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4">
                    <div className="text-center mb-4">
                        <div 
                            className="mx-auto mb-3 d-flex align-items-center justify-content-center"
                            style={{
                                width: '60px',
                                height: '60px',
                                background: 'linear-gradient(135deg, #28a745, #20c997)',
                                borderRadius: '15px',
                                boxShadow: '0 8px 20px rgba(40, 167, 69, 0.3)'
                            }}
                        >
                            <i className="fas fa-mobile-alt text-white" style={{ fontSize: '1.5rem' }}></i>
                        </div>
                        <p className="text-muted mb-0">
                            Chúng tôi đã gửi mã xác thực 6 chữ số đến email <strong>{email}</strong>
                        </p>
                    </div>

                    <Form.Group className="mb-4">
                        <Form.Label className="fw-semibold text-dark mb-2">
                            <i className="fas fa-key me-2 text-success"></i>
                            Mã OTP
                        </Form.Label>
                        <InputGroup>
                            <InputGroup.Text 
                                style={{ 
                                    background: 'linear-gradient(135deg, #28a745, #20c997)',
                                    border: 'none',
                                    color: 'white'
                                }}
                            >
                                <i className="fas fa-hashtag"></i>
                            </InputGroup.Text>
                            <Form.Control
                                type="text"
                                placeholder="Nhập mã OTP 6 chữ số"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                                maxLength="6"
                                style={{
                                    border: 'none',
                                    fontSize: '1.2rem',
                                    textAlign: 'center',
                                    letterSpacing: '0.5em',
                                    padding: '12px',
                                    background: 'rgba(248, 249, 250, 0.8)'
                                }}
                                className="shadow-sm"
                            />
                        </InputGroup>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer className="border-0 pt-0">
                    <div className="d-flex gap-2 w-100">
                        <Button 
                            variant="outline-secondary" 
                            onClick={() => {
                                setShowModalOTP(false);
                                setOtp('');
                            }}
                            className="flex-fill"
                            style={{ borderRadius: '10px' }}
                        >
                            <i className="fas fa-times me-2"></i>
                            Hủy
                        </Button>
                        <Button 
                            variant="success" 
                            onClick={handleVerifyOTP}
                            className="flex-fill"
                            style={{ 
                                borderRadius: '10px',
                                background: 'linear-gradient(135deg, #28a745, #20c997)',
                                border: 'none'
                            }}
                        >
                            <i className="fas fa-check me-2"></i>
                            Xác Thực
                        </Button>
                    </div>
                </Modal.Footer>
            </Modal>

            {/* Reset Password Modal */}
            <Modal 
                show={showModalMK} 
                onHide={() => {
                    setShowModalMK(false);
                    setPassword('');
                }}
                centered
                backdrop="static"
            >
                <Modal.Header 
                    closeButton
                    style={{ 
                        background: 'linear-gradient(135deg, #fd7e14, #e63946)',
                        color: 'white',
                        border: 'none'
                    }}
                >
                    <Modal.Title className="d-flex align-items-center">
                        <i className="fas fa-lock me-2"></i>
                        Đặt Lại Mật Khẩu
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4">
                    <div className="text-center mb-4">
                        <div 
                            className="mx-auto mb-3 d-flex align-items-center justify-content-center"
                            style={{
                                width: '60px',
                                height: '60px',
                                background: 'linear-gradient(135deg, #fd7e14, #e63946)',
                                borderRadius: '15px',
                                boxShadow: '0 8px 20px rgba(253, 126, 20, 0.3)'
                            }}
                        >
                            <i className="fas fa-key text-white" style={{ fontSize: '1.5rem' }}></i>
                        </div>
                        <p className="text-muted mb-0">
                            Tạo mật khẩu mới cho tài khoản của bạn
                        </p>
                    </div>

                    <Form.Group className="mb-4">
                        <Form.Label className="fw-semibold text-dark mb-2">
                            <i className="fas fa-lock me-2 text-warning"></i>
                            Mật Khẩu Mới
                        </Form.Label>
                        <InputGroup>
                            <InputGroup.Text 
                                style={{ 
                                    background: 'linear-gradient(135deg, #fd7e14, #e63946)',
                                    border: 'none',
                                    color: 'white'
                                }}
                            >
                                <i className="fas fa-shield-alt"></i>
                            </InputGroup.Text>
                            <Form.Control
                                type="password"
                                placeholder="Nhập mật khẩu mới"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
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
                        <Form.Text className="text-muted">
                            <i className="fas fa-info-circle me-1"></i>
                            Mật khẩu phải có ít nhất 6 ký tự
                        </Form.Text>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer className="border-0 pt-0">
                    <div className="d-flex gap-2 w-100">
                        <Button 
                            variant="outline-secondary" 
                            onClick={() => {
                                setShowModalMK(false);
                                setPassword('');
                            }}
                            className="flex-fill"
                            style={{ borderRadius: '10px' }}
                        >
                            <i className="fas fa-times me-2"></i>
                            Hủy
                        </Button>
                        <Button 
                            variant="warning" 
                            onClick={handleResetPassword}
                            className="flex-fill"
                            style={{ 
                                borderRadius: '10px',
                                background: 'linear-gradient(135deg, #fd7e14, #e63946)',
                                border: 'none',
                                color: 'white'
                            }}
                        >
                            <i className="fas fa-save me-2"></i>
                            Đặt Lại
                        </Button>
                    </div>
                </Modal.Footer>
            </Modal>
        </div>


    );

}
export default QuenMatKhau;