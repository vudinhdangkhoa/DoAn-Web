import React, { useState, useEffect } from 'react';
import { Carousel, Container, Row, Col, Button } from 'react-bootstrap';
import './Slideshow.css';

function Slideshow({ navigate }) {
  const [index, setIndex] = useState(0);

  const slides = [
    {
      id: 1,
      image: '/bannerGT.jpg', // Sẽ thay thế bằng hình ảnh thật
      title: 'Trung Tâm Mỹ Thuật Sáng Tạo',
      subtitle: 'Không gian nghệ thuật dành cho mọi lứa tuổi',
      description: 'Chúng tôi tạo ra môi trường học tập truyền cảm hứng, nơi bạn có thể khám phá và phát triển tài năng nghệ thuật của mình.'
    },
    {
      id: 2,
      image: '/bannerHS.jpg',
      title: 'Sáng Tạo Không Giới Hạn',
      subtitle: 'Học sinh tự do thể hiện cá tính qua nghệ thuật',
      description: 'Từ những nét vẽ đầu tiên đến những ý tưởng táo bạo, học sinh được khuyến khích sáng tạo và thể hiện bản thân một cách tự nhiên.'
    },
    {
      id: 3,
      image: '/bannerKH.png',
      title: 'Các Khóa Học Mỹ Thuật',
      subtitle: 'Phù hợp từ cơ bản đến nâng cao',
      description: 'Khám phá các khóa học đa dạng: vẽ cơ bản, màu nước, chân dung… giúp bạn nâng cao kỹ năng và hoàn thiện tác phẩm nghệ thuật.'
    }
  ];

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  // Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="slideshow-container" style={{ zIndex: 0 }}>
      <Carousel
        activeIndex={index}
        onSelect={handleSelect}
        fade
        controls={true}
        indicators={true}
        interval={null} // Disable auto slide, we handle it manually
      >
        {slides.map((slide) => (
          <Carousel.Item key={slide.id}>
            <div className="slide-wrapper">
              <div className="slide-background">
                <img
                  className="slide-image"
                  src={slide.image}
                  alt={slide.title}
                />
                <div className="slide-overlay"></div>
              </div>

              <Container className="slide-content-container">
                <Row className="align-items-center min-vh-50">
                  <Col lg={10} md={12} className="slide-content text-center">
                    <div className="slide-text">
                      <h2 className="slide-title">
                        {slide.title}
                      </h2>
                      <h4 className="slide-subtitle">
                        {slide.subtitle}
                      </h4>
                      <p className="slide-description">
                        {slide.description}
                      </p>
                     
                    </div>
                  </Col>
                </Row>
              </Container>
            </div>
          </Carousel.Item>
        ))}
      </Carousel>

      {/* Custom indicators */}
      <div className="custom-indicators">
        {slides.map((_, idx) => (
          <button
            key={idx}
            className={`custom-indicator ${idx === index ? 'active' : ''}`}
            onClick={() => setIndex(idx)}
          />
        ))}
      </div>
    </div>
  );
}

export default Slideshow;