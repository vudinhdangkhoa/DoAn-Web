import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Spinner, Alert, Tab, Nav, Accordion, Badge,Image } from "react-bootstrap";
import axios from "axios";
import APIRoute from "../../APIRoute";
import CustomNavbar from "../../components/WellcomePage/Navbar";
import Footer from "../../components/WellcomePage/Footer";
import { useCourses } from "../../Hooks/WellcomPageHook";
import './LichSuThanhToan.css';

function LichSuThanhToan() {
    const navigate = useNavigate();
    const { courses: navCourses } = useCourses();

    const [paymentData, setPaymentData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeStudentKey, setActiveStudentKey] = useState('0');

    useEffect(() => {
        const fetchPaymentHistory = async () => {
            const idPhuHuynh = localStorage.getItem('UserId');
            if (!idPhuHuynh) {
                navigate('/DangNhap');
                return;
            }

            setIsLoading(true);
            setError(null);
            try {
                const response = await axios.get(APIRoute.getURL(`LichSuThanhToan/GetLichSuThanhToan/${idPhuHuynh}`));
                if (response.status === 200 && response.data.length > 0) {
                    // API trả về một mảng chứa 1 object phụ huynh, ta lấy object đó
                    const parentData = response.data[0];
                    setPaymentData(parentData.hocVien); // Lấy danh sách học viên
                    // Nếu có học viên, đặt tab active là ID của học viên đầu tiên
                    if (parentData.hocVien.length > 0) {
                        setActiveStudentKey(parentData.hocVien[0].idHocVien.toString());
                    }
                }
            } catch (err) {
                setError("Không thể tải lịch sử thanh toán.");
                console.error("Lỗi khi fetch lịch sử thanh toán:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPaymentHistory();
    }, [navigate]);

    return (
        <div>
            <CustomNavbar navigate={navigate} courses={navCourses} />
            <Container className="payment-history-page">
                <header className="page-header text-center">
                    <h1>Lịch Sử Thanh Toán</h1>
                    <p className="text-muted">Xem lại tất cả các giao dịch đã thực hiện cho các học viên.</p>
                </header>

                {isLoading ? (
                    <div className="text-center"><Spinner animation="border" /></div>
                ) : error ? (
                    <Alert variant="danger">{error}</Alert>
                ) : paymentData.length > 0 ? (
                    <Tab.Container id="student-payment-tabs" activeKey={activeStudentKey} onSelect={(k) => setActiveStudentKey(k)}>
                        <Row>
                            <Col sm={3}>
                                <Nav variant="pills" className="flex-column student-tabs">
                                    {paymentData.map(student => (
                                        <Nav.Item key={student.idHocVien}>
                                            <Nav.Link eventKey={student.idHocVien.toString()}>
                                                <Image src={student.avatar || 'https://via.placeholder.com/40'} className="student-tab-avatar" />
                                                {student.tenHv}
                                            </Nav.Link>
                                        </Nav.Item>
                                    ))}
                                </Nav>
                            </Col>
                            <Col sm={9}>
                                <Tab.Content>
                                    {paymentData.map(student => (
                                        <Tab.Pane key={student.idHocVien} eventKey={student.idHocVien.toString()}>
                                            <h5>Các giao dịch của {student.tenHv}</h5>
                                            <hr />
                                            {student.hoaDonKhoaHoc.length > 0 ? (
                                                <Accordion defaultActiveKey="0" flush className="invoice-accordion">
                                                    {student.hoaDonKhoaHoc.map((invoice, index) => (
                                                        <Accordion.Item eventKey={index.toString()} key={invoice.idHoaDon}>
                                                            <Accordion.Header>
                                                                <div className="invoice-header-content">
                                                                    <span className="invoice-course-name">{invoice.lopHoc?.tenLopHoc || 'N/A'}</span>
                                                                    <span className="invoice-date text-muted">{new Date(invoice.ngaytao).toLocaleDateString('vi-VN')}</span>
                                                                    <span className="invoice-amount">{new Intl.NumberFormat('vi-VN').format(invoice.tongTien)} VND</span>
                                                                </div>
                                                            </Accordion.Header>
                                                            <Accordion.Body className="invoice-details">
                                                                <p><strong>Mã hóa đơn:</strong> #{invoice.idHoaDon}</p>
                                                                <p><strong>Lớp học:</strong> {invoice.lopHoc?.tenLopHoc}</p>
                                                                <p><strong>Thời gian học:</strong> {invoice.lopHoc?.thoiGianBatDau.substring(0,5)} - {invoice.lopHoc?.thoiGianKetThuc.substring(0,5)}</p>
                                                                {/* Bạn có thể thêm các chi tiết khác ở đây */}
                                                            </Accordion.Body>
                                                        </Accordion.Item>
                                                    ))}
                                                </Accordion>
                                            ) : (
                                                <Alert variant="info">Học viên này chưa có giao dịch nào.</Alert>
                                            )}
                                        </Tab.Pane>
                                    ))}
                                </Tab.Content>
                            </Col>
                        </Row>
                    </Tab.Container>
                ) : (
                    <Alert variant="info">Không có dữ liệu lịch sử thanh toán để hiển thị.</Alert>
                )}
            </Container>
            <Footer />
        </div>
    );
}

export default LichSuThanhToan;