import React, { useEffect, useState } from 'react';
import { Navbar, Nav, Container, Button, Dropdown, NavDropdown,Form,InputGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Navbar.css';
import axios from 'axios';
import APIRoute from '../../APIRoute';
import axiosInstance from '../../AxioxInstance';

function CustomNavbar({ navigate, courses = [] }) {
    const [expanded, setExpanded] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userId = localStorage.getItem('UserId');
        console.log(userId);
        console.log("courses in navbar:", courses);
        if (userId !== null) {
            GetThongTinUser(userId);
        }
    }, []);

    const [keyword, setKeyword] = useState(''); // State lưu từ khóa

    // Hàm xử lý khi nhấn Enter hoặc nút Tìm kiếm
    const handleSearch = (e) => {
        e.preventDefault();
        if (keyword.trim()) {
            // Điều hướng sang trang tìm kiếm, truyền từ khóa qua URL param ?q=...
            // Dùng encodeURIComponent để xử lý ký tự đặc biệt
            navigate(`/tim-kiem-khoa-hoc?q=${encodeURIComponent(keyword.trim())}`);
            setExpanded(false); // Đóng menu mobile nếu đang mở
        }
    };

    const handleLogout = async () => {
        const respone = await axios.post(APIRoute.getURL(`XacThuc/Logout`), {}, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        if (respone.status === 200) {
            console.log("dang xuat thanh cong")
            localStorage.removeItem('UserId');
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('status');
            setUser(null);
            navigate && navigate('/');
        }
    };

    const GetThongTinUser = async (userId) => {
        try {
            const respone = await axiosInstance.get(APIRoute.getURL(`TrangChu/GetThongTinUser/${userId}`))
            if (respone.status === 200) {
                console.log(respone.data);
                setUser(respone.data);
            }
        } catch (error) {
            console.error("Error fetching user information:", error);
        }
    }

    const scrollToSection = (sectionId) => {
        // Nếu đang ở trang khác, navigate về trang chủ trước
        if (window.location.pathname !== '/') {
            navigate && navigate('/');
            // Đợi navigate xong rồi scroll
            setTimeout(() => {
                const element = document.getElementById(sectionId);
                if (element) {
                    element.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }, 100);
        } else {
            // Nếu đã ở trang chủ, scroll trực tiếp
            const element = document.getElementById(sectionId);
            if (element) {
                element.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
        setExpanded(false);
    };

    return (
        <>
            {/* Top contact bar */}
            <div className="top-contact-bar">
                <Container>
                    <div className="d-flex justify-content-between align-items-center py-2">
                        <div className="contact-info">
                            <span className="me-3">
                                <i className="fas fa-phone"></i> Hotline: 0907 401 493 - 0905 984 268
                            </span>
                            <span>
                                <i className="fas fa-envelope"></i> mythuatppa@gmail.com
                            </span>
                        </div>

                        {/* Auth buttons for desktop - chỉ hiển thị trên desktop */}
                        <div className="d-none d-lg-flex align-items-center">
                            {user ? (
                                <Dropdown align="end">
                                    <Dropdown.Toggle
                                        variant="outline-light"
                                        size="sm"
                                        id="user-dropdown-top"
                                        className="d-flex align-items-center border-0"
                                    >
                                        {user.avatar ? (
                                            <img
                                                src={user.avatar.startsWith('http://') || user.avatar.startsWith('https://') ? user.avatar : APIRoute.getUrlImage(user.avatar)}
                                                alt={user.tenHv}
                                                className="rounded-circle me-2"
                                                style={{ width: '24px', height: '24px', objectFit: 'cover' }}
                                            />
                                        ) : (
                                            <i className="fas fa-user-circle fa-2x text-black me-2"></i>
                                        )}
                                        <span className="d-none d-xl-inline">{user.tenPh}</span>
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        <Dropdown.Item onClick={() => navigate && navigate('/thong-tin-ca-nhan')}>
                                            <i className="fas fa-user me-2"></i>
                                            Thông tin cá nhân
                                        </Dropdown.Item>
                                        <Dropdown.Item onClick={() => navigate && navigate('/xem-lich-hoc')}>
                                            <i className="fas fa-book me-2"></i>
                                            Xem lịch học
                                        </Dropdown.Item>
                                        <Dropdown.Item onClick={() => navigate && navigate('/lich-su-thanh-toan')}>
                                            <i className="fas fa-cog me-2"></i>
                                            Lịch sử thanh toán
                                        </Dropdown.Item>
                                        <Dropdown.Divider />
                                        <Dropdown.Item onClick={handleLogout} className="text-danger">
                                            <i className="fas fa-sign-out-alt me-2"></i>
                                            Đăng xuất
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            ) : (
                                <div className="d-flex gap-2">
                                    <Button
                                        variant="light"
                                        size="sm"
                                        onClick={() => navigate && navigate('/DangKy')}
                                        className="border-0"
                                    >
                                        Đăng ký
                                    </Button>
                                    <Button
                                        variant="light"
                                        size="sm"
                                        onClick={() => navigate && navigate('/DangNhap')}
                                    >
                                        Đăng nhập
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </Container>
            </div>

            {/* Main navigation */}
            <Navbar
                bg="white"
                expand="lg"
                className="main-navbar shadow-sm"
                expanded={expanded}
                onToggle={setExpanded}
            >
                <Container>
                    <Navbar.Brand
                        href="#"
                        className="brand-logo"
                        onClick={(e) => {
                            e.preventDefault();
                            navigate && navigate('/');
                        }}
                    >
                        <img
                            src="/logo-foo.png"
                            height="70"  // Tăng từ 40 lên 70 hoặc 80 tùy nhu cầu
                            alt="Mỹ Thuật KSL"
                            className="d-inline-block align-middle me-3" // Đổi align-top thành align-middle, tăng margin
                        />
                        <span className="brand-text d-flex flex-column justify-content-center">
                            <strong className="brand-title">MỸ THUẬT PPA</strong>
                            <small className="brand-subtitle text-muted">THE SCHOOL OF FINE ARTS</small>
                        </span>
                    </Navbar.Brand>

                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto align-items-lg-center">

                            {/* Dropdown cho GIỚI THIỆU */}
                            <NavDropdown
                                title="GIỚI THIỆU"
                                id="gioi-thieu-dropdown"
                                className="nav-item-custom"
                                style={{ zIndex: 2 }}
                            >
                                <NavDropdown.Item
                                    onClick={() => {
                                        scrollToSection('gioi-thieu');
                                    }}
                                >
                                    <i className="fas fa-info-circle me-2"></i>
                                    Về chúng tôi
                                </NavDropdown.Item>

                                <NavDropdown.Item
                                    onClick={() => {
                                        scrollToSection('triet-ly-giang-day');
                                    }}
                                >
                                    <i className="fas fa-bullseye me-2"></i>
                                    Triết lý giảng dạy
                                </NavDropdown.Item>

                                <NavDropdown.Item
                                    onClick={() => {
                                        scrollToSection('doi-ngu-giao-vien');
                                    }}
                                >
                                    <i className="fas fa-chalkboard-teacher me-2"></i>
                                    Đội ngũ giáo viên
                                </NavDropdown.Item>


                            </NavDropdown>
                            <NavDropdown
                                title="KHÓA HỌC"
                                id="khoa-hoc-dropdown"
                                className="nav-item-custom nav-hover-dropdown"
                                style={{ zIndex: 2 }}
                            >
                                {/* <NavDropdown.Item onClick={() => navigate('/khoa-hoc/thieu-nhi')}>
                                    <i className="fas fa-child me-2"></i>
                                    Mỹ thuật thiếu nhi
                                </NavDropdown.Item> */}
                                {console.log("courses data: ", courses)}
                                {

                                    courses.length > 0 && courses.map((course) => {
                                        return (
                                            <NavDropdown.Item>
                                                <Button variant="link" className="text-decoration-none p-0" onClick={() => navigate(`/danh-sach-khoa-hoc/${course.id}`)}>
                                                    <i className="fas fa-child me-2"></i>
                                                    {course.tenLoai}
                                                </Button>
                                            </NavDropdown.Item>
                                        );
                                    })
                                }
                            </NavDropdown>

                            <Nav.Link href="#" className="nav-item-custom">
                                LIÊN HỆ
                            </Nav.Link>
                             <Form className="d-flex mx-lg-3 my-2 my-lg-0" onSubmit={handleSearch}>
                                <InputGroup size="sm">
                                    <Form.Control
                                        type="search"
                                        placeholder="Tìm khóa học..."
                                        className="border-end-0"
                                        value={keyword}
                                        onChange={(e) => setKeyword(e.target.value)}
                                        style={{ borderRadius: '20px 0 0 20px' }}
                                    />
                                    <Button 
                                        variant="outline-secondary" 
                                        type="submit"
                                        className="border-start-0"
                                        style={{ borderRadius: '0 20px 20px 0', backgroundColor: 'white' }}
                                    >
                                        <i className="fas fa-search text-muted"></i>
                                    </Button>
                                </InputGroup>
                            </Form>   
                            {/* Auth section for mobile/tablet - chỉ hiển thị khi collapse */}
                            <div className="d-lg-none mt-3 pt-3 border-top">
                                {user ? (
                                    <div className="d-flex flex-column">
                                        <div className="d-flex align-items-center mb-3 p-2 bg-light rounded">
                                            {user.avatar ? (
                                                <img
                                                    src={(user.avatar.startsWith('http://') || user.avatar.startsWith('https://')) ? user.avatar : APIRoute.getUrlImage(user.avatar)}
                                                    alt={user.tenPh}
                                                    className="rounded-circle me-3"
                                                    style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                                    onError={(e) => {
                                                        console.error('Image load error:', e);
                                                        console.log('Failed URL:', user.avatar);
                                                        console.log('User data:', user);
                                                    }}
                                                />
                                            ) : (
                                                <i className="fas fa-user-circle fa-3x text-muted me-3"></i>
                                            )}
                                            <div>
                                                <div className="fw-bold">{user.tenPh}</div>
                                                <small className="text-muted">Thành viên KSL</small>
                                            </div>
                                        </div>

                                        <Nav.Link
                                            className="mobile-nav-item py-2"
                                            onClick={() => {
                                                navigate && navigate('/profile');
                                                setExpanded(false);
                                            }}
                                        >
                                            <i className="fas fa-user me-2"></i>
                                            Thông tin cá nhân
                                        </Nav.Link>
                                        <Nav.Link
                                            className="mobile-nav-item py-2"
                                            onClick={() => {
                                                navigate && navigate('/my-courses');
                                                setExpanded(false);
                                            }}
                                        >
                                            <i className="fas fa-book me-2"></i>
                                            Khóa học của tôi
                                        </Nav.Link>
                                        <Nav.Link
                                            className="mobile-nav-item py-2"
                                            onClick={() => {
                                                navigate && navigate('/lich-su-thanh-toan');
                                                setExpanded(false);
                                            }}
                                        >
                                            <i className="fas fa-cog me-2"></i>
                                            Lịch sử thanh toán
                                        </Nav.Link>
                                        <Nav.Link
                                            className="mobile-nav-item py-2 text-danger"
                                            onClick={() => {
                                                handleLogout();
                                                setExpanded(false);
                                            }}
                                        >
                                            <i className="fas fa-sign-out-alt me-2"></i>
                                            Đăng xuất
                                        </Nav.Link>
                                    </div>
                                ) : (
                                    <div className="d-flex flex-column gap-2">
                                        <Button
                                            variant="outline-primary"
                                            className="w-100"
                                            onClick={() => {
                                                navigate && navigate('/DangKy');
                                                setExpanded(false);
                                            }}
                                        >
                                            <i className="fas fa-user-plus me-2"></i>
                                            Đăng ký
                                        </Button>
                                        <Button
                                            variant="primary"
                                            className="w-100"
                                            onClick={() => {
                                                navigate && navigate('/DangNhap');
                                                setExpanded(false);
                                            }}
                                        >
                                            <i className="fas fa-sign-in-alt me-2"></i>
                                            Đăng nhập
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    );
}

export default CustomNavbar;