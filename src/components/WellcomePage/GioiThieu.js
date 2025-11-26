import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Card, Carousel, Image, Spinner, Alert } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import './GioiThieu.css';
import APIRoute from "../../APIRoute";


function GioiThieu({ giaoVien = [], loading, error }) {

    const [activeTab, setActiveTab] = useState('MY_THUAT_PPA');
    const [activeIndex, setActiveIndex] = useState(0);
    const itemsPerSlide = 4;
    const createSlides = (items, itemsPerSlide) => {
        const slides = [];
        if (!items || items.length === 0) {
            return [];
        }
        for (let i = 0; i < items.length; i += itemsPerSlide) {
            slides.push(items.slice(i, i + itemsPerSlide));
        }
        return slides;
    };
    const teacherSlides = createSlides(giaoVien, itemsPerSlide);

    const contentData = {
        MY_THUAT_PPA: {
            dropCap: 'M',
            title: 'MỸ THUẬT PPA',
            content: [
                'ỹ thuật không đơn giản chỉ là vẽ vời hay chỉ là một môn học năng khiếu mà nó bao hàm ý nghĩa về sự miêu tả cái đẹp, cảm nhận và gợi mở trí tưởng tượng để thể hiện bản thân. Mỹ thuật giúp con người phát triển nhận thức thẩm mỹ, biết cảm nhận và rung động trước cái đẹp.',
                'Nhờ mỹ thuật con người trở nên tự tin hơn, bộc lộ cá tính bản thân, phát triển khả năng tư duy về hình ảnh, trí tưởng tượng và óc sáng tạo. PPA được thành lập với sứ mệnh mang đến cho học viên những trải nghiệm nghệ thuật chất lượng cao nhất.',
                'Chúng tôi tin rằng mỗi người đều có khả năng sáng tạo tiềm ẩn, cần được khơi dậy và phát triển thông qua những phương pháp giảng dạy khoa học và hiện đại. Môi trường học tập tại PPA luôn tràn đầy năng lượng tích cực.',
                'Với đội ngũ giảng viên giàu kinh nghiệm và tâm huyết, PPA mong muốn tạo ra môi trường học tập rèn luyện tính sáng tạo và khả năng tư duy đang sẵn có trong mỗi người chúng ta.'
            ]
        },
        TRIET_LY_GIANG_DAY: {
            dropCap: 'T',
            title: 'TRIẾT LÝ GIẢNG DẠY',
            content: [
                'riết lý giảng dạy của PPA tập trung vào việc phát triển toàn diện cá nhân học viên. Chúng tôi tin rằng mỗi học viên đều có tiềm năng sáng tạo riêng biệt cần được khơi gợi và phát triển một cách tự nhiên nhất.',
                'Phương pháp giảng dạy của chúng tôi không chỉ dừng lại ở việc truyền đạt kỹ thuật mà còn chú trọng việc xây dựng tư duy nghệ thuật, khả năng quan sát và cảm thụ cái đẹp. Học viên được khuyến khích thể hiện cá tính và phong cách riêng thông qua từng tác phẩm.',
                'Tại PPA, chúng tôi áp dụng phương pháp giảng dạy cá nhân hóa, chú trọng đến đặc điểm và sở thích của từng học viên. Điều này giúp mỗi người có thể phát huy tối đa tiềm năng sáng tạo của bản thân.',
                'Môi trường học tập tại PPA được thiết kế để tạo cảm hứng và động lực cho học viên. Chúng tôi luôn cập nhật những xu hướng mới trong nghệ thuật và ứng dụng vào chương trình giảng dạy.'
            ]
        }
    };
    const TrietLy = [
        'Với Phương châm “tự do sáng tạo – thỏa đam mê”, PPA tin rằng học mỹ thuật không phải để trở thành họa sĩ mà đơn giản là học để rèn luyện tính sáng tạo, rèn luyện trí nhớ, nâng cao khả năng quan sát và khả năng diễn đạt cảm xúc một cách tốt hơn. Vì thế, PPA thiết kế các lớp vẽ tranh cho người lớn và thiếu nhi, nhằm tạo ra một sân chơi cho những ai thích hội họa (kể cả những người không có kiến thức về hội họa) và nhằm mang đến môi trường học tập, rèn luyện tính sáng tạo và khả năng tư duy đang tìm ẩn trong mỗi con người.',
        'Mỹ thuật là cuộc sống, mà cuộc sống thì không của riêng ai. Đến với PPA bạn có thể cảm nhận được cuộc sống muôn màu muôn vẻ của chính mình, khiến tâm hồn mình luôn gợi mở và tràn đầy năng lượng để hiện thực hóa những ước muốn tương lai cùa bản thân.'

    ]

    return (
        <Container fluid className="p-0 m-0 wellcome-intro-section">
            {/* PPA Introduction Section */}
            <section className="ppa-intro-section" id="gioi-thieu">
                <Container>
                    <Row className="justify-content-center">
                        <Col xs={12} className="text-center mb-5">
                            <h2 className="ppa-section-title" data-aos="fade-up">
                                GIỚI THIỆU VỀ PPA
                            </h2>
                        </Col>
                    </Row>

                    <Row className="align-items-center">
                        {/* Left Side - Image Grid */}
                        <Col lg={7} md={6} className="mb-4 mb-md-0">
                            <div className="image-grid-container" data-aos="fade-right">
                                <Row className="g-3">
                                    <Col xs={6} sm={6}>
                                        <div className="grid-image-wrapper" data-aos="zoom-in" data-aos-delay="100">
                                            <img
                                                src="/5-935.jpg"
                                                alt="Dụng cụ mỹ thuật"
                                                className="grid-image"
                                            />
                                        </div>
                                    </Col>
                                    <Col xs={6} sm={6}>
                                        <div className="grid-image-wrapper" data-aos="zoom-in" data-aos-delay="200">
                                            <img
                                                src="/6-762.jpg"
                                                alt="Học viên đang học"
                                                className="grid-image"
                                            />
                                        </div>
                                    </Col>
                                    <Col xs={6} sm={6}>
                                        <div className="grid-image-wrapper position-relative" data-aos="zoom-in" data-aos-delay="300">
                                            <img
                                                src="/7-700.jpg"
                                                alt="Học viên nhỏ tuổi"
                                                className="grid-image"
                                            />
                                            <button
                                                className={`image-label label-blue ${activeTab === 'MY_THUAT_PPA' ? 'active' : ''}`}
                                                onClick={() => setActiveTab('MY_THUAT_PPA')}
                                                aria-label="Xem thông tin Mỹ thuật PPA"
                                            >
                                                MỸ THUẬT PPA
                                            </button>
                                        </div>
                                    </Col>
                                    <Col xs={6} sm={6}>
                                        <div className="grid-image-wrapper position-relative" data-aos="zoom-in" data-aos-delay="400">
                                            <img
                                                src="/10.jpg"
                                                alt="Giáo viên hướng dẫn"
                                                className="grid-image"
                                            />
                                            <button
                                                className={`image-label label-orange ${activeTab === 'TRIET_LY_GIANG_DAY' ? 'active' : ''}`}
                                                onClick={() => setActiveTab('TRIET_LY_GIANG_DAY')}
                                                aria-label="Xem thông tin Triết lý giảng dạy"
                                            >
                                                TRIẾT LÝ GIẢNG DẠY
                                            </button>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </Col>

                        {/* Right Side - Dynamic Content */}
                        <Col lg={5} md={6}>
                            <div className="ppa-content-box" data-aos="fade-left" data-aos-delay="200">
                                <div className="content-text">
                                    <span className="drop-cap">
                                        {contentData[activeTab].dropCap}
                                    </span>
                                    {contentData[activeTab].content.map((paragraph, index) => (
                                        <p key={`${activeTab}-${index}`} className="fade-in">
                                            {paragraph}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>


            {/* Learn From Heart Section */}
            <section className="learn-from-heart-section">
                <div className="learn-bg-overlay"></div>

                {/* --- THAY ĐỔI Ở ĐÂY: Đưa đường kẻ ra ngoài Container --- */}
                {/* Hình ảnh đường nối và chim sẽ nằm ở đây, chiếm toàn màn hình */}
                <div className="full-width-decoration d-none d-lg-block"></div>

                <Container className="position-relative" style={{ zIndex: 2 }}>
                    {/* Tiêu đề */}
                    <Row className="justify-content-center mb-5">
                        <Col xs={12} className="text-center">
                            <h2 className="learn-heading">
                                TÂM DẪN LỐI NGHỆ THUẬT KHAI HOA
                            </h2>
                            <div className="learn-heading-underline"></div>
                        </Col>
                    </Row>

                    {/* Nội dung các bước */}
                    <div className="learn-steps-container">

                        {/* XÓA đoạn div className="dashed-line-decoration" cũ ở đây đi */}

                        <Row className="justify-content-center">
                            {/* ... (Phần các Col chứa hình tròn giữ nguyên như cũ) ... */}
                            {/* Bước 1 */}
                            <Col lg={3} md={6} xs={12} className="learn-step-col mb-4">
                                <div className="step-circle-wrapper">
                                    <div className="step-circle">
                                        <img src="/khoa-luyen-thi.jpg" alt="Giáo viên" />
                                    </div>
                                </div>
                                <h5 className="step-title">Giáo viên hướng dẫn tận tâm</h5>
                            </Col>

                            {/* Bước 2 - Thụt xuống */}
                            <Col lg={3} md={6} xs={12} className="learn-step-col mb-4 mt-lg-5 pt-lg-5">
                                <div className="step-circle-wrapper">
                                    <div className="step-circle">
                                        <img src="/my-thuat-thieu-nhi-37.jpg" alt="Thời gian" />
                                    </div>
                                </div>
                                <h5 className="step-title">Thời gian học linh động</h5>
                            </Col>

                            {/* Bước 3 */}
                            <Col lg={3} md={6} xs={12} className="learn-step-col mb-4">
                                <div className="step-circle-wrapper">
                                    <div className="step-circle">
                                        <img src="/SonDau.jpg" alt="Phương pháp" />
                                    </div>
                                </div>
                                <h5 className="step-title">Phương pháp dạy thực hành</h5>
                            </Col>

                            {/* Bước 4 - Thụt xuống */}
                            <Col lg={3} md={6} xs={12} className="learn-step-col mb-4 mt-lg-5 pt-lg-5">
                                <div className="step-circle-wrapper">
                                    <div className="step-circle">
                                        <img src="/khoa-hoc-son-dau.jpg" alt="Không gian" />
                                    </div>
                                </div>
                                <h5 className="step-title">Không gian học nghệ thuật</h5>
                            </Col>
                        </Row>
                    </div>
                </Container>
            </section>

            <section style={{ marginTop: '5%' }} id="triet-ly-giang-day">
                <Container>
                    <Row>
                        <Col md={6}>
                            <Row>
                                <h1 className=" text-success  text-start mb-3">
                                    Triết Lý Giảng Dạy
                                </h1>
                            </Row>
                            <Row>
                                {TrietLy.map((paragraph, index) => (
                                    <p key={`triet-ly-${index}`} className="fade-in" style={{ textAlign: 'justify', marginBottom: '1.5rem' }}>
                                        {paragraph}
                                    </p>
                                ))}
                            </Row>
                        </Col>
                        <Col md={6}>
                            <Carousel fade>
                                <Carousel.Item>
                                    <img
                                        className="d-block w-100 rounded"
                                        src="/my-thuat-ppa-1.jpg"
                                        alt="Slide 1"
                                    />

                                </Carousel.Item>

                                <Carousel.Item>
                                    <img
                                        className="d-block w-100 rounded"
                                        src="/my-thuat-ppa-3.jpg"
                                        alt="Slide 2"
                                    />

                                </Carousel.Item>

                                <Carousel.Item>
                                    <img
                                        className="d-block w-100 rounded"
                                        src="/triet-ly-giang-day-ppa.jpg"
                                        alt="Slide 3"
                                    />

                                </Carousel.Item>
                            </Carousel>
                        </Col>
                    </Row>
                    <Row>
                        <Image src="/sec-triet-ly.png" alt="Triết lý giảng dạy" className="img-fluid" />
                    </Row>
                </Container>
            </section>

            <section id="doi-ngu-giao-vien" className="teacher-section">
                <Container>
                    <Row>
                        <Col xs={12} className="text-center">
                            <h2 className="teacher-title">ĐỘI NGŨ GIÁO VIÊN</h2>
                            <div className="title-underline-teacher"></div>
                        </Col>
                    </Row>

                    {loading && (
                        <div className="text-center"><Spinner animation="border" variant="primary" /></div>
                    )}
                    {error && (
                        <Alert variant="danger" className="text-center">{error}</Alert>
                    )}

                    {!loading && !error && giaoVien && giaoVien.length > 0 && (
                        <Carousel
                            activeIndex={activeIndex}
                            onSelect={(selectedIndex) => setActiveIndex(selectedIndex)}
                            indicators={teacherSlides.length > 1}
                            controls={teacherSlides.length > 1}
                            interval={null}
                            className="teacher-carousel"
                        >
                            {teacherSlides.map((slideItems, slideIndex) => (
                                <Carousel.Item key={slideIndex}>
                                    <Row>
                                        {slideItems.map((gv) => (
                                            <Col key={gv.id} lg={3} md={6} className="mb-4">
                                                <Card className="teacher-card">
                                                    <div className="teacher-image-wrapper">
                                                        <Card.Img
                                                            variant="top"
                                                            src={APIRoute.getUrlImage(gv.avatar) || 'https://via.placeholder.com/400x500?text=No+Image'}
                                                            className="teacher-image"
                                                        />
                                                    </div>
                                                    <div className="teacher-info-overlay">
                                                        <h5 className="teacher-name">{gv.tenGV}</h5>
                                                        <p className="teacher-experience mb-0">
                                                            {gv.soNamKinhNghiem} năm kinh nghiệm
                                                        </p>
                                                    </div>
                                                </Card>
                                            </Col>
                                        ))}
                                    </Row>
                                </Carousel.Item>
                            ))}
                        </Carousel>
                    )}
                    {!loading && giaoVien.length === 0 && (
                        <Col className="text-center">
                            <p>Không có thông tin giáo viên để hiển thị.</p>
                        </Col>
                    )}
                </Container>
            </section>
        </Container>
    );
}

export default GioiThieu;