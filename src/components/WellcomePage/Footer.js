import React from 'react';
import { Container, Row, Col, Image } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function Footer() {
    return (
        <footer className="bg-light py-5 mt-5 border-top">
            <Container>
                <Row className="align-items-center">
                    {/* Logo Section */}
                    <Col lg={3} md={12} className="text-center text-lg-start mb-4 mb-lg-0">
                        <div className="d-flex align-items-center justify-content-center justify-content-lg-start">
                            <div
                                className=' me-2'
                            >
                                <img
                                    src="/logo-foo.png"
                                    height="180"
                                    alt="Mỹ Thuật KSL"
                                    className="d-inline-block align-top me-2"
                                />
                            </div>
                            <div>
                                <h5 className="mb-0 text-danger fw-bold">
                                    PPA ART
                                </h5>
                                <small className="text-muted">
                                    SCHOOL OF FINE ARTS
                                </small>
                            </div>
                        </div>
                    </Col>

                    {/* System Information */}
                    <Col lg={9} md={12}>
                        <div className="mb-3">
                            <h5 className="text-danger fw-bold mb-3 text-center text-lg-start">
                                HỆ THỐNG TRUNG TÂM MỸ THUẬT PPA ART
                            </h5>
                        </div>

                        <Row>
                            {/* Left Column - Addresses */}
                            <Col lg={7} md={12} className="mb-3 mb-lg-0">
                                <div className="mb-3">
                                    <strong className="text-dark">PPA Tân Phú:</strong>
                                    <span className="ms-2 text-muted">
                                        Số 11 Yên Đỗ, Phường Tân Thành, Quận Tân Phú, TP.HCM
                                    </span>
                                </div>
                               
                            </Col>

                            {/* Right Column - Contact Info */}
                            <Col lg={5} md={12}>
                                <div className="mb-2">
                                    <strong className="text-dark">
                                        <i className="fas fa-phone text-danger me-2"></i>
                                        Điện thoại:
                                    </strong>
                                    <span className="ms-2 text-muted">(028) 1234 5678</span>
                                </div>
                                <div className="mb-2">
                                    <strong className="text-dark">
                                        <i className="fas fa-mobile-alt text-danger me-2"></i>
                                        Hotline:
                                    </strong>
                                    <span className="ms-2 text-muted">0901 234 567 - 0902 345 678</span>
                                </div>
                                <div className="mb-2">
                                    <strong className="text-dark">
                                        <i className="fas fa-envelope text-danger me-2"></i>
                                        Email:
                                    </strong>
                                    <span className="ms-2 text-muted">contact@ppaart.edu.vn</span>
                                </div>
                                <div className="mb-3">
                                    <strong className="text-dark">
                                        <i className="fas fa-globe text-danger me-2"></i>
                                        Website:
                                    </strong>
                                    <span className="ms-2 text-muted">ppaart.edu.vn</span>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Row>

                {/* Copyright & Social Section */}
                <Row className="mt-4 pt-4 border-top">
                    <Col lg={8} md={12} className="text-center text-lg-start mb-3 mb-lg-0">
                        <p className="mb-0 text-muted">
                            © 2025 <strong className="text-danger">MỸ THUẬT PPA</strong> - THE SCHOOL OF FINE ARTS PPA
                        </p>
                        
                    </Col>

                    <Col lg={4} md={12} className="text-center text-lg-end">
                        <div className="d-flex justify-content-center justify-content-lg-end align-items-center gap-3">
                            {/* Social Links */}
                            <a
                                href="#"
                                className="text-decoration-none"
                                style={{ color: '#1877f2' }}
                            >
                                <i className="fab fa-facebook fs-4"></i>
                            </a>
                            <a
                                href="#"
                                className="text-decoration-none"
                                style={{ color: '#1da1f2' }}
                            >
                                <i className="fab fa-twitter fs-4"></i>
                            </a>
                            <a
                                href="#"
                                className="text-decoration-none"
                                style={{ color: '#e4405f' }}
                            >
                                <i className="fab fa-instagram fs-4"></i>
                            </a>
                            <a
                                href="#"
                                className="text-decoration-none"
                                style={{ color: '#ff0000' }}
                            >
                                <i className="fab fa-youtube fs-4"></i>
                            </a>

                            {/* Contact Buttons */}
                            <div className="vr mx-2 d-none d-lg-block"></div>

                            <a
                                href="tel:0901234567"
                                className="btn btn-outline-danger btn-sm me-2"
                                style={{ borderRadius: '20px' }}
                            >
                                <i className="fas fa-phone me-1"></i>
                                LIÊN HỆ NGAY
                            </a>

                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-primary btn-sm"
                                style={{
                                    backgroundColor: '#1877f2',
                                    borderColor: '#1877f2',
                                    borderRadius: '20px'
                                }}
                            >
                                <i className="fab fa-facebook me-1"></i>
                                FACEBOOK
                            </a>
                        </div>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
}
export default Footer;