import React, { useState, useRef } from 'react';
import { Container, Row, Col, Button, Spinner, Image, Carousel } from 'react-bootstrap';
import "./ShowKhoaHoc.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import APIRoute from '../../APIRoute';

function ShowKhoaHoc({ courses = [], loading = false, error = null, navigate, onRefresh }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const startX = useRef(0);
    const currentX = useRef(0);
    const containerRef = useRef(null);

    const itemsPerSlide = 4; // 4 items mỗi slide

    const handleCourseClick = (courseId) => {
        if (!isDragging) {
            navigate && navigate(`/danh-sach-khoa-hoc/${courseId}`);
        }
    };

    const handleRetry = () => {
        onRefresh && onRefresh();
    };

    // Function để truncate text
    const truncateText = (text, maxLength = 120) => {
        if (!text) return '';
        if (text.length <= maxLength) return text;

        // Cắt cứng tại giới hạn maxLength trước
        let subString = text.substring(0, maxLength);

        // Tìm vị trí khoảng trắng cuối cùng trong chuỗi đã cắt
        const lastSpaceIndex = subString.lastIndexOf(' ');

        // Nếu tìm thấy khoảng trắng (để tránh trường hợp 1 từ quá dài chiếm hết maxLength)
        if (lastSpaceIndex > 0) {
            subString = subString.substring(0, lastSpaceIndex);
        }

        return subString + '...';
    };

    // Chia courses thành các slides
    const createSlides = () => {
        const slides = [];
        for (let i = 0; i < courses.length; i += itemsPerSlide) {
            slides.push(courses.slice(i, i + itemsPerSlide));
        }
        return slides;
    };

    const slides = createSlides();

    // Touch/Mouse event handlers
    const handleStart = (e) => {
        setIsDragging(false);
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        startX.current = clientX;
        currentX.current = clientX;
    };

    const handleMove = (e) => {
        if (startX.current === 0) return;

        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        currentX.current = clientX;

        const diffX = Math.abs(clientX - startX.current);
        if (diffX > 10) {
            setIsDragging(true);
        }
    };

    const handleEnd = () => {
        if (startX.current === 0) return;

        const diffX = currentX.current - startX.current;
        const threshold = 50;

        if (Math.abs(diffX) > threshold) {
            if (diffX > 0 && activeIndex > 0) {
                // Swipe right - previous slide
                setActiveIndex(activeIndex - 1);
            } else if (diffX < 0 && activeIndex < slides.length - 1) {
                // Swipe left - next slide
                setActiveIndex(activeIndex + 1);
            }
        }

        startX.current = 0;
        currentX.current = 0;

        // Reset dragging state after a short delay
        setTimeout(() => setIsDragging(false), 100);
    };

    if (loading) {
        return (
            <Container className="py-5 text-center">
                <Spinner animation="border" role="status" variant="primary">
                    <span className="visually-hidden">Đang tải...</span>
                </Spinner>
                <p className="mt-3">Đang tải danh sách khóa học...</p>
            </Container>
        );
    }

    if (error && courses.length === 0) {
        return (
            <Container className="py-5 text-center">
                <div className="alert alert-warning">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    {error}
                </div>
                <Button variant="primary" onClick={handleRetry}>
                    <i className="fas fa-redo me-2"></i>
                    Thử lại
                </Button>
            </Container>
        );
    }

    return (
        <section className="py-5 bg-white courses-section">
            <Container>
                {/* Section Header */}
                <Row>
                    <Col xs={12} className="text-center mb-5">
                        <h2 className="courses-title">KHÓA HỌC PPA</h2>
                        <div className="title-underline"></div>
                    </Col>
                </Row>

                {/* Courses Carousel */}
                {courses.length > 0 ? (
                    <div
                        className="courses-carousel"
                        ref={containerRef}
                        onMouseDown={handleStart}
                        onMouseMove={handleMove}
                        onMouseUp={handleEnd}
                        onMouseLeave={handleEnd}
                        onTouchStart={handleStart}
                        onTouchMove={handleMove}
                        onTouchEnd={handleEnd}
                    >
                        <Carousel
                            activeIndex={activeIndex}
                            onSelect={setActiveIndex}
                            controls={false}
                            indicators={false}
                            interval={null}
                            touch={true}
                            className="courses-carousel-inner"
                        >
                            {slides.map((slideItems, slideIndex) => (
                                <Carousel.Item key={slideIndex}>
                                    <Row className="justify-content-center">
                                        {slideItems.map((course, index) => {
                                            const globalIndex = slideIndex * itemsPerSlide + index;
                                            return (
                                                <Col
                                                    key={course.id}
                                                    lg={3}
                                                    md={6}
                                                    sm={6}
                                                    xs={12}
                                                    className="mb-4"
                                                >
                                                    <div
                                                        className="course-card text-center"
                                                        style={{ cursor: isDragging ? 'grabbing' : 'pointer' }}
                                                        onClick={() => handleCourseClick(course.id)}
                                                    >
                                                        {/* Hình ảnh tròn với viền gradient */}
                                                        <div className={`course-image-wrapper gradient-border-${(globalIndex % 4) + 1}`}>
                                                            <div className="course-image-inner">
                                                                <Image
                                                                    src={APIRoute.getUrlImage(course.hinhAnh)}
                                                                    alt={course.tenLoai}
                                                                    className="course-image"
                                                                    draggable={false}
                                                                />
                                                            </div>
                                                        </div>

                                                        {/* Course Title */}
                                                        <h4 className="course-title mt-4 mb-3">
                                                            {course.tenLoai.toUpperCase()}
                                                        </h4>

                                                        {/* Course Description */}
                                                        <p className="course-description px-2" title={course.moTa}>
                                                            {truncateText(course.moTa, 100)}
                                                        </p>

                                                        {/* CTA Button */}
                                                        <Button
                                                            className="course-btn"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleCourseClick(course.id);
                                                            }}
                                                        >
                                                            XEM TIẾP
                                                        </Button>
                                                    </div>
                                                </Col>
                                            );
                                        })}
                                    </Row>
                                </Carousel.Item>
                            ))}
                        </Carousel>

                        {/* Custom Navigation Arrows */}
                        {slides.length > 1 && (
                            <>
                                <button
                                    className="custom-carousel-prev"
                                    onClick={() => setActiveIndex(Math.max(0, activeIndex - 1))}
                                    disabled={activeIndex === 0}
                                >
                                    <i className="fas fa-chevron-left"></i>
                                </button>
                                <button
                                    className="custom-carousel-next"
                                    onClick={() => setActiveIndex(Math.min(slides.length - 1, activeIndex + 1))}
                                    disabled={activeIndex === slides.length - 1}
                                >
                                    <i className="fas fa-chevron-right"></i>
                                </button>
                            </>
                        )}


                    </div>
                ) : (
                    <Row>
                        <Col xs={12} className="text-center">
                            <h4 className="mb-4">Chưa có khóa học nào được hiển thị</h4>
                            <p>Vui lòng quay lại sau hoặc liên hệ quản trị viên.</p>
                        </Col>
                    </Row>
                )}
            </Container>
        </section>
    );
}

export default ShowKhoaHoc;