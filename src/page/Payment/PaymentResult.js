import React, { useEffect, useState } from 'react';
import { useSearchParams, Link,useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Spinner, Alert, Button } from 'react-bootstrap';
import axios from 'axios';
import APIRoute from '../../APIRoute';
import CustomNavbar from '../../components/WellcomePage/Navbar';
import Footer from '../../components/WellcomePage/Footer';
import './PaymentResult.css';
import { useCourses } from "../../Hooks/WellcomPageHook";
function PaymentResult() {
    const [searchParams] = useSearchParams();
    const [isLoading, setIsLoading] = useState(true);
    const [paymentStatus, setPaymentStatus] = useState(null); // 'success', 'fail', 'pending'
    const [error, setError] = useState('');
    const [invoiceDetails, setInvoiceDetails] = useState(null);

    const navigate = useNavigate();
    const { courses: navCourses } = useCourses();

    useEffect(() => {
        const verifyPayment = async () => {
            // Lấy các tham số từ URL
            const params = Object.fromEntries([...searchParams]);
            console.log('Payment URL parameters:', params);
            

            try {
                // Gọi API backend để xác thực và lấy trạng thái cuối cùng của hóa đơn
                const response = await axios.post(APIRoute.getURL('Payment/VerifyPayment'), params);

                if (response.status === 200 && response.data) {
                    setPaymentStatus(response.data.status);
                    setInvoiceDetails(response.data.invoiceDetails);
                    console.log(response.data);
                    setIsLoading(false);
                }
            } catch (err) {
                console.error("Lỗi khi xác thực thanh toán:", err);
                setError(err.response?.data?.message || 'Lỗi khi xác thực thanh toán.');
                setPaymentStatus('fail');
                setIsLoading(false);


            } finally {
                setIsLoading(false);
            }
        };

        verifyPayment();
    }, [searchParams]);

    const renderResult = () => {
        if (isLoading) {
            return <div className="text-center"><Spinner animation="border" /> <p>Đang xác thực giao dịch...</p></div>;
        }

        if (paymentStatus === 'success') {
            return (
                <div className="payment-result success">
                    <i className="fas fa-check-circle result-icon"></i>
                    <h2>Thanh Toán Thành Công!</h2>
                    <p>Cảm ơn bạn đã đăng ký khóa học. Thông tin chi tiết đã được ghi nhận.</p>
                    {invoiceDetails && (
                        <Card className="mt-4 text-start">
                            <Card.Header as="h5">Chi Tiết Hóa Đơn</Card.Header>
                            <Card.Body>
                                <p><strong>Mã hóa đơn:</strong> {invoiceDetails.idHoaDon}</p>
                                <p><strong>Khóa học:</strong> {invoiceDetails.tenKhoaHoc}</p>
                                <p><strong>Lớp học:</strong> {invoiceDetails.tenLopHoc}</p>
                                <p><strong>Tổng tiền:</strong> <span className="fw-bold text-danger">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(invoiceDetails.tongTien)}</span></p>
                            </Card.Body>
                        </Card>
                    )}
                </div>
            );
        }

        return (
            <div className="payment-result fail">
                <i className="fas fa-times-circle result-icon"></i>
                <h2>Thanh Toán Thất Bại</h2>
                <p>{error || 'Giao dịch không thể hoàn tất. Vui lòng thử lại.'}</p>
                {invoiceDetails && <p>Mã hóa đơn của bạn là: <strong>{invoiceDetails.idHoaDon}</strong></p>}
            </div>
        );
    };

    return (
        <>
            <CustomNavbar navigate={navigate} courses={navCourses}/>
            <Container className="payment-result-container">
                <Row className="justify-content-center">
                    <Col md={8} lg={6}>
                        <Card className="p-4 shadow-sm">
                            <Card.Body>
                                {renderResult()}
                                <div className="text-center mt-4">
                                    <Button as={Link} to="/" variant="primary">Quay Về Trang Chủ</Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
            <Footer />
        </>
    );
}

export default PaymentResult;