import React, { useState,useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert, Spinner, InputGroup } from 'react-bootstrap';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import APIRoute from '../../APIRoute';
import DungChung from '../../DungChung';

const apiRoute=new APIRoute();

function DangNhap() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validated, setValidated] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [IsLoading, setIsLoading] = useState(false);


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

  const handleSubmit = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
     try {
      console.log("mk:",password.length);
       const response = await axios.post(APIRoute.getURL(`XacThuc/DangNhap`), {
         mail: email,
         matKhau: password.trim()
       });
       if (response.status === 200) {
        console.log(response.data);
        console.log(DungChung.staff)
         if (response.data.status === DungChung.staff) {
           setErrorMessage('Tài khoản không hợp lệ');
           setIsLoading(false);
           return;
         }
         setSuccessMessage(response.data.message);
         localStorage.setItem('token', response.data.token);
         localStorage.setItem('refreshToken', response.data.refreshToken);
         localStorage.setItem('UserId', response.data.userId);
         localStorage.setItem('status', response.data.status);
         setIsLoading(true);
         setTimeout(() => {
          navigate(-1); 
         }, 1500);
       } else {
         setErrorMessage(response.data.message);
         setIsLoading(false);
       }
     } catch (error) {
       console.error('Login Error:', error);
       setErrorMessage(error.response.data.message || 'Đăng nhập thất bại');
       setIsLoading(false);
     }
    }
    
    setValidated(true);
  };

  const handleGoogleSignIn = async (credentialResponse) => {
    try {
      setErrorMessage('');
      setSuccessMessage('');
      setIsLoading(false)
      const idToken = credentialResponse.credential
      console.log(idToken);
      console.log(APIRoute.getURL(`XacThuc/GoogleLogin`))
      const respone = await axios.post(APIRoute.getURL(`XacThuc/GoogleLogin`), {idToken});
      console.log(respone.status);
      if(respone.status === 200){
        setSuccessMessage(respone.data.message);
        localStorage.setItem('token', respone.data.token)
        localStorage.setItem('refreshToken', respone.data.refreshToken)
        localStorage.setItem('UserId', respone.data.userId);
        localStorage.setItem('status', respone.data.status);
        setIsLoading(true);
        setSuccessMessage('Đăng nhập Google thành công');
        console.log('Google Sign-In Success:', credentialResponse);
        setTimeout(() => {
          navigate(-1); 
         }, 1500);
      }
    } catch (error) {
      console.log(error.status);
      setErrorMessage('Đăng nhập Google thất bại');
      console.error('Google Sign-In Error:', error);
    }
  }

  const handleGoogleError = () => {
    setErrorMessage('Đăng nhập Google thất bại');
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
                      background: 'linear-gradient(135deg, #007bff, #0056b3)',
                      borderRadius: '20px',
                      boxShadow: '0 10px 30px rgba(0, 123, 255, 0.3)'
                    }}
                  >
                    <i className="fas fa-sign-in-alt text-white" style={{ fontSize: '2rem' }}></i>
                  </div>
                  <h3 className="fw-bold text-dark mb-2">Đăng Nhập</h3>
                  <p className="text-muted mb-0">
                    Chào mừng bạn quay trở lại với KSL Art
                  </p>
                </div>

                {/* Form */}
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                  {/* Email Field */}
                  <Form.Group className="mb-3">
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
                      <Form.Control.Feedback type="invalid">
                        Vui lòng nhập email hợp lệ
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>

                  {/* Password Field */}
                  <Form.Group className="mb-4">
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
                        placeholder="Nhập mật khẩu của bạn"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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
                      <Form.Control.Feedback type="invalid">
                        Vui lòng nhập mật khẩu
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>

                  {/* Remember Me & Forgot Password */}
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <Form.Check 
                      type="checkbox" 
                      label="Ghi nhớ đăng nhập"
                      className="text-muted"
                    />
                    <Button 
                      variant="link" 
                      className="p-0 text-decoration-none"
                      onClick={() => navigate('/QuenMatKhau')}
                      style={{ fontSize: '0.9rem' }}
                    >
                      Quên mật khẩu?
                    </Button>
                  </div>

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
                          : 'linear-gradient(135deg, #007bff, #0056b3)',
                        border: 'none',
                        borderRadius: '15px',
                        padding: '12px',
                        fontWeight: '600',
                        fontSize: '1.1rem',
                        boxShadow: '0 8px 25px rgba(0, 123, 255, 0.3)',
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
                          Đang đăng nhập...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-sign-in-alt me-2"></i>
                          Đăng Nhập
                        </>
                      )}
                    </Button>
                  </div>
                </Form>

                {/* Divider */}
                <div className="position-relative mb-4">
                  <hr className="text-muted" />
                  <span 
                    className="position-absolute top-50 start-50 translate-middle bg-white px-3 text-muted"
                    style={{ fontSize: '0.9rem' }}
                  >
                    Hoặc đăng nhập với
                  </span>
                </div>

                {/* Google Login */}
                <div className="text-center mb-4">
                  <GoogleOAuthProvider clientId='521963997704-vkah2m1omr72fr73eqrto4onej0dbr7r.apps.googleusercontent.com'>
                    <div className="d-flex justify-content-center">
                      <GoogleLogin
                        onSuccess={handleGoogleSignIn}
                        onError={handleGoogleError}
                        theme="outline"
                        size="large"
                        text="signin_with"
                        shape="rectangular"
                        logo_alignment="left"
                        width="300"
                      />
                    </div>
                  </GoogleOAuthProvider>
                </div>

                {/* Footer Links */}
                <div className="text-center pt-3 border-top">
                  <p className="text-muted mb-3">Bạn chưa có tài khoản?</p>
                  <div className="d-flex gap-3 justify-content-center">
                    <Button
                      variant="outline-success"
                      onClick={() => navigate('/DangKy')}
                      className="flex-fill"
                      style={{ borderRadius: '10px' }}
                    >
                      <i className="fas fa-user-plus me-2"></i>
                      Đăng Ký Ngay
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
    </div>
  );
}

export default DangNhap;