import React from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Container, Row, Col, Card, Button, Spinner, Alert, Tabs, Tab, Table, ProgressBar, Breadcrumb, Image, Modal, Form, FormCheck } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";
import { useEffect, useState } from "react";
import Footer from "../../components/WellcomePage/Footer";
import CustomNavbar from '../../components/WellcomePage/Navbar';
import { useCourses } from "../../Hooks/WellcomPageHook";
import APIRoute from "../../APIRoute";
import './ChiTietKhoaHoc.css'; // <-- Import file CSS mới
import DungChung from "../../DungChung";

function ChiTietKhoaHoc() {
    const { idKhoaHoc } = useParams();
    const { courses: navCourses } = useCourses();
    const navigate = useNavigate();

    // State cho chi tiết khóa học và danh sách lớp học
    const [courseDetail, setCourseDetail] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lopHocList, setLopHocList] = useState([]);
    const [isLopHocLoading, setIsLopHocLoading] = useState(true);
    const [lopHocError, setLopHocError] = useState(null);

    // State cho Modal đăng ký
    const [showModal, setShowModal] = useState(false);
    const [selectedLopHoc, setSelectedLopHoc] = useState(null);
    const [isRegisteringForChild, setIsRegisteringForChild] = useState(false);
    const [hocVienList, setHocVienList] = useState([]);
    const [isHocVienLoading, setIsHocVienLoading] = useState(false);
    const [selectedHocVien, setSelectedHocVien] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('MoMo'); // Mặc định chọn MoMo
    const [isCreatingPayment, setIsCreatingPayment] = useState(false);
    const [paymentError, setPaymentError] = useState(null);
    const buoiTrenTuan = ['', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy', 'Chủ Nhật'];

    useEffect(() => {
        // Cuộn lên đầu trang khi component được render hoặc idKhoaHoc thay đổi
        window.scrollTo(0, 0);

        const fetchCourseDetail = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await axios.get(APIRoute.getURL(`TrangChu/GetDetailKhoaHoc/${idKhoaHoc}`));
                if (response.status === 200) {
                    setCourseDetail(response.data);
                }
            } catch (err) {
                setError("Không thể tải thông tin khóa học.");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        const fetchLopHocList = async () => {
            setIsLopHocLoading(true);
            setLopHocError(null);
            try {
                // Sửa lại endpoint ở đây
                const response = await axios.get(APIRoute.getURL(`TrangChu/GetAllLopHoc/${idKhoaHoc}`));
                if (response.status === 200) {
                    setLopHocList(response.data);
                }
            } catch (error) {
                setLopHocError("Không thể tải danh sách lớp học.");
                console.error(error);
            } finally {
                setIsLopHocLoading(false);
            }
        };

        fetchCourseDetail();
        fetchLopHocList();
    }, [idKhoaHoc]);

    const fetchHocVienCuaPhuHuynh = async () => {
        const idPhuHuynh = localStorage.getItem('UserId');
        if (!idPhuHuynh) return;

        setIsHocVienLoading(true);
        try {
            const response = await axios.get(APIRoute.getURL(`TrangChu/GetAllHocVienCuaPhuHuynh/${idPhuHuynh}`));
            if (response.status === 200) {
                setHocVienList(response.data);
            }
        } catch (error) {
            console.error("Lỗi khi lấy danh sách học viên:", error);
            // Có thể thêm state để báo lỗi cho người dùng
        } finally {
            setIsHocVienLoading(false);
        }
    };

    // Xử lý khi nhấn nút "Đăng ký"
    const handleDangKyClick = (lopHoc) => {
        if (!localStorage.getItem('token')) {
            navigate('/DangNhap'); // Chuyển hướng đến trang đăng nhập nếu chưa có token
            return;
        }
        setSelectedLopHoc(lopHoc);
        setShowModal(true);
    };

    // Xử lý khi checkbox thay đổi
    useEffect(() => {
        if (isRegisteringForChild) {
            fetchHocVienCuaPhuHuynh();
        } else {
            setHocVienList([]); // Xóa danh sách học viên nếu không check
        }
    }, [isRegisteringForChild]);

    // Xử lý đóng Modal
    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedLopHoc(null);
        setIsRegisteringForChild(false);
        setSelectedHocVien('');
        setHocVienList([]);
    };

    // Xử lý xác nhận đăng ký
    const handleConfirmRegistration = async () => {
        if (isRegisteringForChild && !selectedHocVien) {
            setPaymentError("Vui lòng chọn một học viên để đăng ký.");
            return;
        }
        if (!paymentMethod) {
            setPaymentError("Vui lòng chọn một phương thức thanh toán.");
            return;
        }

        setIsCreatingPayment(true);
        setPaymentError(null);

        const registrationData = {
            IdLopHoc: selectedLopHoc.id,
            HocVienId: isRegisteringForChild ? parseInt(selectedHocVien, 10) : parseInt(localStorage.getItem('UserId'), 10),
            PhuHuynhId: parseInt(localStorage.getItem('UserId'), 10),
            Amount: courseDetail?.hocPhi,
            PaymentMethod: paymentMethod, // <-- Gửi phương thức đã chọn
            KhoaHocId: idKhoaHoc
        };

        try {
            // Gọi API chung để tạo thanh toán
            const response = await axios.post(
                APIRoute.getURL('Payment/CreatePayment'), // <-- API Endpoint mới, chung chung hơn
                registrationData
            );

            if (response.status === 200 && response.data.payUrl) {
                window.location.href = response.data.payUrl;
            } else {
                setPaymentError(response.data.message || "Không thể tạo thanh toán.");
            }

        } catch (error) {
            setPaymentError(error.response?.data?.message || "Đã xảy ra lỗi kết nối.");
            console.error("Lỗi khi tạo thanh toán:", error);
        } finally {
            setIsCreatingPayment(false);
        }
    };

    // Hàm định dạng TimeOnly (HH:mm:ss) thành HH:mm
    const formatTime = (timeString) => {
        if (!timeString) return '';
        const parts = timeString.split(':');
        return `${parts[0]}:${parts[1]}`;
    };

    const formatSchedule = (soBuoiTrenTuanString) => {
        if (!soBuoiTrenTuanString || typeof soBuoiTrenTuanString !== 'string') {
            return 'Chưa có lịch';
        }

        return soBuoiTrenTuanString
            .split(',') // Tách chuỗi thành mảng các số dạng string: ['2', '4', '6']
            .map(dayIndex => buoiTrenTuan[parseInt(dayIndex, 10)]) // Chuyển từng phần tử sang số và lấy giá trị từ mảng `buoiTrenTuan`
            .join(', '); // Nối các ngày lại thành một chuỗi: "Thứ Ba, Thứ Năm, Thứ Bảy"
    };



    if (isLoading) {
        return (
            <div>
                <CustomNavbar navigate={navigate} courses={navCourses} />
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
                    <Spinner animation="border" variant="primary" />
                </div>
                <Footer />
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <CustomNavbar navigate={navigate} courses={navCourses} />
                <Container className="mt-5 pt-5 text-center">
                    <Alert variant="danger">{error}</Alert>
                </Container>
                <Footer />
            </div>
        );
    }

    return (
        <div className="course-detail-page">
            <CustomNavbar navigate={navigate} courses={navCourses} />

            {/* PHẦN GIỚI THIỆU KHÓA HỌC */}
            {courseDetail && (
                <div className="course-detail-header">
                    <Container>
                        <Row className="align-items-center">
                            <Col lg={6} className="mb-4 mb-lg-0">
                                <div className="course-image-container">
                                    <Image src={APIRoute.getUrlImage(courseDetail.hinhAnh)} fluid className="course-image" />
                                </div>
                            </Col>
                            <Col lg={6}>
                                <Breadcrumb className="course-breadcrumb">
                                    <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>Trang Chủ</Breadcrumb.Item>
                                    <Breadcrumb.Item linkAs={Link} linkProps={{ to: `/danh-sach-khoa-hoc/${courseDetail.chuyenMon.idChuyenMon}` }}>
                                        {courseDetail.chuyenMon.tenChuyenMon}
                                    </Breadcrumb.Item>
                                    <Breadcrumb.Item active>{courseDetail.tenKhoaHoc}</Breadcrumb.Item>
                                </Breadcrumb>

                                <h1 className="course-title-main">{courseDetail.tenKhoaHoc}</h1>

                                <ul className="course-meta-info">
                                    <li><i className="fas fa-book-open"></i> {courseDetail.soLuongBuoi} buổi</li>
                                    <li><i className="fas fa-layer-group"></i> {courseDetail.chuyenMon.tenChuyenMon}</li>
                                </ul>

                                <div className="course-price-main">
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(courseDetail.hocPhi)}
                                </div>



                                <Tabs defaultActiveKey="description" id="course-details-tabs" className="course-tabs">
                                    <Tab eventKey="description" title="Mô Tả Khóa Học">
                                        <div className="tab-content">{courseDetail.moTa}</div>
                                    </Tab>
                                    <Tab eventKey="objective" title="Mục Tiêu Khóa Học">
                                        <div className="tab-content">{courseDetail.mucTieu}</div>
                                    </Tab>
                                </Tabs>
                            </Col>
                        </Row>
                    </Container>
                </div>
            )}

            {/* PHẦN DANH SÁCH LỚP HỌC */}
            <section className="class-list-section">
                <Container>
                    <h2 className="text-center mb-5">Các Lớp Học Sắp Khai Giảng</h2>
                    {isLopHocLoading ? (
                        <div className="text-center"><Spinner animation="border" /></div>
                    ) : lopHocError ? (
                        <Alert variant="danger">{lopHocError}</Alert>
                    ) : (
                        <Card className="class-list-table">
                            <Table responsive hover className="mb-0">
                                <thead>
                                    <tr>
                                        <th>Tên Lớp</th>
                                        <th>Giáo Viên</th>
                                        <th>Số buổi</th>
                                        <th>Thời Gian Học</th>
                                        <th>Sĩ Số</th>
                                        <th>Ngày Khai Giảng</th>
                                        <th>Trạng Thái</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {lopHocList.length > 0 ? lopHocList.map(lop => (
                                        <tr key={lop.id}>
                                            <td className="fw-bold">{lop.tenLop}</td>
                                            <td>{lop.giaoVien}</td>
                                            <td>{formatSchedule(lop.soBuoiTrenTuan)}</td>
                                            <td>{`${formatTime(lop.thoiGianBatDau)} - ${formatTime(lop.thoiGianKetThuc)}`}</td>
                                            <td>
                                                {`${lop.soLuongHocVien} / ${lop.soLuongToiDa}`}
                                            </td>
                                            <td>{new Date(lop.ngayKhaiGiang).toLocaleDateString('vi-VN')}</td>
                                            <td>
                                                <span className={lop.soLuongHocVien >= lop.soLuongToiDa ? 'class-status-full' : 'class-status-available'}>
                                                    {lop.soLuongHocVien >= lop.soLuongToiDa ? 'Đã Đầy' : 'Còn Chỗ'}
                                                </span>
                                            </td>
                                            <td>
                                                <Button
                                                    size="sm"
                                                    disabled={lop.soLuongHocVien >= lop.soLuongToiDa}
                                                    onClick={() => handleDangKyClick(lop)}
                                                >
                                                    Đăng ký
                                                </Button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="6" className="text-center p-4">Hiện chưa có lớp học nào cho khóa học này.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </Card>
                    )}
                </Container>
            </section>

            <Footer />

            {/* ========= MODAL ĐĂNG KÝ HỌC ========= */}
            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Xác Nhận Đăng Ký</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedLopHoc && (
                        <div className="mb-4">
                            <h5>Thông Tin Lớp Học</h5>
                            <p><strong>Lớp:</strong> {selectedLopHoc.tenLop}</p>
                            <p><strong>Khóa học:</strong> {courseDetail?.tenKhoaHoc}</p>
                            <p><strong>Học phí:</strong> <span className="text-danger fw-bold">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(courseDetail?.hocPhi)}</span></p>
                        </div>
                    )}

                    <hr />

                    <Form>
                        <Form.Group controlId="registrationForm">
                            {/* Cảnh báo nếu thông tin chưa đầy đủ */}
                            {localStorage.getItem('status') === DungChung.new && (
                                <Alert variant="warning">
                                    Tài khoản của bạn chưa cập nhật đầy đủ thông tin (Ngày sinh, SĐT). Vui lòng cập nhật để tiếp tục.
                                    <Button variant="link" size="sm" onClick={() => navigate('/thong-tin-ca-nhan')}>Cập nhật ngay</Button>
                                </Alert>
                            )}

                            {/* Checkbox đăng ký cho con */}
                            <Form.Check
                                type="switch"
                                id="register-for-child-switch"
                                label="Đăng ký cho con"
                                checked={isRegisteringForChild}
                                onChange={(e) => setIsRegisteringForChild(e.target.checked)}
                            />

                            {/* Hiển thị dropdown nếu check */}
                            {isRegisteringForChild && (
                                <div className="mt-3">
                                    {isHocVienLoading ? (
                                        <div className="text-center"><Spinner animation="border" size="sm" /></div>
                                    ) : hocVienList.length > 0 ? (
                                        <Form.Group controlId="selectStudent">
                                            <Form.Label>Chọn học viên</Form.Label>
                                            <Form.Select value={selectedHocVien} onChange={(e) => setSelectedHocVien(e.target.value)}>
                                                <option value="">-- Chọn một học viên --</option>
                                                {hocVienList.map(hv => (
                                                    <option key={hv.id} value={hv.id}>{hv.tenHV} (Ngày sinh: {new Date(hv.ngaySinh).toLocaleDateString('vi-VN')})</option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                    ) : (
                                        <Alert variant="info" className="d-flex justify-content-between align-items-center">
                                            <span>Bạn chưa thêm thông tin học viên.</span>
                                            <Button variant="primary" size="sm" onClick={() => navigate('/them-hoc-vien')}>
                                                Thêm ngay
                                            </Button>
                                        </Alert>
                                    )}
                                </div>
                            )}
                        </Form.Group>

                        <hr />

                        {/* === PHẦN CHỌN PHƯƠNG THỨC THANH TOÁN === */}
                        <Form.Group>
                            <Form.Label as="h5">Chọn phương thức thanh toán</Form.Label>
                            <div className="payment-method-options">
                                <Form.Check
                                    type="radio"
                                    id="payment-momo"
                                    name="paymentMethod"
                                    value={DungChung.PaymentMomo}
                                    label={
                                        <span>
                                            <Image src="/MoMo_Logo.png" width={28} className="me-2" />
                                            Thanh toán qua Ví MoMo
                                        </span>
                                    }
                                    checked={paymentMethod === DungChung.PaymentMomo}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                />
                                <Form.Check
                                    type="radio"
                                    id="payment-vnpay"
                                    name="paymentMethod"
                                    value={DungChung.PaymentVnPay}
                                    label={
                                        <span>
                                            <Image src="/vnpay.png" width={28} className="me-2" />
                                            Thanh toán qua VNPay
                                        </span>
                                    }
                                    checked={paymentMethod === DungChung.PaymentVnPay}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                />
                            </div>
                        </Form.Group>

                        {paymentError && <Alert variant="danger" className="mt-3">{paymentError}</Alert>}
                    </Form>


                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Hủy
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleConfirmRegistration}
                        disabled={localStorage.getItem('status') === DungChung.new || (isRegisteringForChild && !selectedHocVien) || isCreatingPayment}
                    >
                        {isCreatingPayment
                            ? <><Spinner as="span" animation="border" size="sm" /> Đang xử lý...</>
                            : 'Tiến hành thanh toán'
                        }
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default ChiTietKhoaHoc;