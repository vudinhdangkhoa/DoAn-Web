import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { Container, Row, Col, Card, Button, Spinner, Alert, Form, Image, ListGroup, Tab, Nav, Modal,Table } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";
import { useEffect, useState,useRef } from "react";
import Footer from "../../components/WellcomePage/Footer";
import CustomNavbar from '../../components/WellcomePage/Navbar';
import DoiMatKhau from "../../components/ThongTinCaNhan/DoiMatKhau";
import { useCourses } from "../../Hooks/WellcomPageHook";
import APIRoute from "../../APIRoute";
import DungChung from "../../DungChung";
import './ThongTinCaNhan.css';

function ThongTinCaNhan() {
    const navigate = useNavigate();
    const { courses: navCourses } = useCourses();

    const [phuHuynhInfo, setPhuHuynhInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    //State hiển thị UI đổi mật khẩu
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    // State cho việc cập nhật
    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
    const [updateError, setUpdateError] = useState(null);
    const [updateSuccess, setUpdateSuccess] = useState('');

    // State quản lý chế độ chỉnh sửa form
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});

    // === STATE MỚI CHO AVATAR ===
    const [avatarFile, setAvatarFile] = useState(null); // Lưu file ảnh người dùng chọn
    const [avatarPreview, setAvatarPreview] = useState(''); // Lưu URL xem trước của ảnh
    const fileInputRef = useRef(null); // Tham chiếu đến input file ẩn

   // === STATE MỚI CHO MODAL THÊM HỌC VIÊN ===
    const [showAddStudentModal, setShowAddStudentModal] = useState(false);
    // Lưu thông tin của học viên đang được nhập trong form
    const [newStudentData, setNewStudentData] = useState({ TenHv: '', NgaySinh: '', GioiTinh: 'Nam' }); 
    const [studentAvatarFile, setStudentAvatarFile] = useState(null);
    const [studentAvatarPreview, setStudentAvatarPreview] = useState('');
    // Lưu danh sách các học viên đã được "thêm" vào bảng tạm
    const [stagedStudents, setStagedStudents] = useState([]); 
    const [isLoadingAddStudent, setIsLoadingAddStudent] = useState(false);
    const [addStudentError, setAddStudentError] = useState(null);

    // Hàm fetch dữ liệu ban đầu
    const fetchPhuHuynhInformation = async () => {
        const phuHuynhId = localStorage.getItem('UserId');
        if (!phuHuynhId) {
            navigate('/DangNhap');
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get(APIRoute.getURL(`ThongTinCaNhan/GetThongTinCaNhan/${phuHuynhId}`));
            if (response.status === 200) {
                setPhuHuynhInfo(response.data);
                setFormData({
                    tenPh: response.data.tenPh,
                    ngaySinh: response.data.ngaySinh ? new Date(response.data.ngaySinh).toISOString().split('T')[0] : '',
                    sdt: response.data.sdt,
                });
                setAvatarPreview(response.data.avatar); // Set avatar ban đầu
            }
        } catch (err) {
            setError("Không thể tải thông tin cá nhân.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPhuHuynhInformation();
    }, [navigate]);

    // Xử lý thay đổi input của form
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    // === CÁC HÀM XỬ LÝ AVATAR ===
    // Kích hoạt input file khi nhấn nút
    const handleAvatarButtonClick = () => {
        fileInputRef.current.click();
    };

    // Khi người dùng chọn một file ảnh
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file); // Lưu file vào state
            setAvatarPreview(URL.createObjectURL(file)); // Tạo URL xem trước
        }
    };

    // Hủy thay đổi avatar
    const handleCancelAvatarChange = () => {
        setAvatarFile(null);
        setAvatarPreview(phuHuynhInfo.avatar); // Quay lại ảnh cũ
        fileInputRef.current.value = null; // Reset input file
    };

    // === KẾT HỢP CẬP NHẬT THÔNG TIN VÀ AVATAR ===
    const handleUpdateInfo = async (e) => {
        e.preventDefault();
        setIsLoadingUpdate(true);
        setUpdateError(null);
        setUpdateSuccess('');

        const updateData = new FormData();
        updateData.append('TenPh', formData.tenPh);
        updateData.append('NgaySinh', formData.ngaySinh);
        updateData.append('Sdt', formData.sdt);
        if (avatarFile) {
            updateData.append('avatar', avatarFile);
        }

        try {
            const phuHuynhId = localStorage.getItem('UserId');
            const response = await axios.put(
                APIRoute.getURL(`ThongTinCaNhan/UpdateThongTinCaNhan/${phuHuynhId}`), 
                updateData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            if (response.status === 200) {
                setUpdateSuccess("Cập nhật thông tin thành công!");
                setIsEditing(false); // Tắt chế độ chỉnh sửa
                setAvatarFile(null); // Reset file avatar
                // Tải lại dữ liệu để hiển thị thông tin mới nhất
                await fetchPhuHuynhInformation();
                localStorage.setItem('status', DungChung.old);
            }
        } catch (error) {
            setUpdateError("Cập nhật thất bại. Vui lòng thử lại.");
            console.error("Lỗi khi cập nhật:", error);
        } finally {
            setIsLoadingUpdate(false);
        }
    };

    // === CÁC HÀM XỬ LÝ CHO MODAL THÊM HỌC VIÊN ===

    // Reset state khi mở modal
    const handleOpenAddStudentModal = () => {
        setNewStudentData({ TenHv: '', NgaySinh: '', GioiTinh: 'Nam' });
        setStudentAvatarFile(null);
        setStudentAvatarPreview('');
        setStagedStudents([]);
        setAddStudentError(null);
        setShowAddStudentModal(true);
    };

    // Cập nhật state khi người dùng nhập form
    const handleNewStudentInputChange = (e) => {
        const { name, value } = e.target;
        setNewStudentData(prev => ({ ...prev, [name]: value }));
    };

    // Xử lý khi chọn file avatar cho học viên mới
    const handleStudentAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setStudentAvatarFile(file);
            setStudentAvatarPreview(URL.createObjectURL(file));
        }
    };
    
    // Thêm học viên từ form vào bảng tạm (stagedStudents)
    const handleStageStudent = () => {
        // Validate dữ liệu cơ bản
        if (!newStudentData.TenHv || !newStudentData.NgaySinh) {
            setAddStudentError("Vui lòng nhập đầy đủ Tên và Ngày sinh của học viên.");
            return;
        }
        
        // Thêm học viên mới vào danh sách tạm
        setStagedStudents(prev => [...prev, { ...newStudentData, AvatarFile: studentAvatarFile, AvatarPreview: studentAvatarPreview }]);

        // Reset form để chuẩn bị cho lần nhập tiếp theo
        setNewStudentData({ TenHv: '', NgaySinh: '', GioiTinh: 'Nam' });
        setStudentAvatarFile(null);
        setStudentAvatarPreview('');
        setAddStudentError(null);
        document.getElementById('formStudentAvatar').value = null; // Clear file input
    };

    // Xóa học viên khỏi bảng tạm
    const handleRemoveStagedStudent = (indexToRemove) => {
        setStagedStudents(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    // Gửi toàn bộ danh sách học viên lên API
    const handleConfirmAddStudents = async () => {
        if (stagedStudents.length === 0) {
            setAddStudentError("Bạn chưa thêm học viên nào vào danh sách.");
            return;
        }

        setIsLoadingAddStudent(true);
        setAddStudentError(null);

        const addStudentFormData = new FormData();
        stagedStudents.forEach((student, index) => {
            addStudentFormData.append(`LsthocVien[${index}].TenHv`, student.TenHv);
            addStudentFormData.append(`LsthocVien[${index}].NgaySinh`, student.NgaySinh);
            addStudentFormData.append(`LsthocVien[${index}].GioiTinh`, student.GioiTinh);
            if (student.AvatarFile) {
                addStudentFormData.append(`LsthocVien[${index}].Avatar`, student.AvatarFile);
            }
        });

        try {
            const phuHuynhId = localStorage.getItem('UserId');
            const response = await axios.post(
                APIRoute.getURL(`ThongTinCaNhan/AddTaiKhoanHocVien/${phuHuynhId}`),
                addStudentFormData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );

            if (response.status === 200) {
                setShowAddStudentModal(false);
                await fetchPhuHuynhInformation(); // Tải lại danh sách để cập nhật UI
            }
        } catch (error) {
            setAddStudentError("Đã xảy ra lỗi khi thêm học viên. Vui lòng thử lại.");
            console.error("Lỗi khi thêm học viên:", error);
        } finally {
            setIsLoadingAddStudent(false);
        }
    };

    if (isLoading) {
        return (
            <div>
                <CustomNavbar navigate={navigate} courses={navCourses} />
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
                    <Spinner animation="border" />
                </div>
                <Footer />
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <CustomNavbar navigate={navigate} courses={navCourses} />
                <Container className="profile-page-container"><Alert variant="danger">{error}</Alert></Container>
                <Footer />
            </div>
        );
    }
    
    return (
        <div>
            <CustomNavbar navigate={navigate} courses={navCourses} />
            <Container className="profile-page-container">
                <Row>
                    {/* Sidebar thông tin */}
                    <Col lg={4} className="profile-sidebar mb-4 mb-lg-0">
                        <Card>
                            <Card.Body className="text-center">
                                {/* === Input file ẩn === */}
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    onChange={handleFileChange}
                                    style={{ display: 'none' }}
                                    accept="image/png, image/jpeg, image/jpg"
                                />
                                <Image src={avatarPreview || 'https://via.placeholder.com/150'} roundedCircle className="profile-avatar mb-3" />
                                <h4 className="profile-name">{phuHuynhInfo?.tenPh}</h4>
                                <p className="profile-usertype text-muted">Phụ Huynh</p>
                                
                                {/* Nút thay đổi avatar chỉ hiển thị khi đang chỉnh sửa */}
                                {isEditing && (
                                    <div className="mb-3">
                                        <Button variant="outline-primary" size="sm" onClick={handleAvatarButtonClick}>
                                            <i className="fas fa-camera me-2"></i>Chọn ảnh mới
                                        </Button>
                                        {/* Nút hủy chỉ hiển thị nếu có ảnh mới được chọn */}
                                        {avatarFile && (
                                            <Button variant="outline-secondary" size="sm" className="ms-2" onClick={handleCancelAvatarChange}>Hủy</Button>
                                        )}
                                    </div>
                                )}
                            </Card.Body>
                            <ListGroup variant="flush" className="sidebar-nav">
                                <ListGroup.Item action active={!isChangingPassword} onClick={() => setIsChangingPassword(false)}>
                                 
                                     <i className="fas fa-user-edit me-2"></i> Thông Tin Chung
                                  
                                </ListGroup.Item>
                                <ListGroup.Item action active={isChangingPassword} onClick={() => setIsChangingPassword(true)}>
                                    <i className="fas fa-key me-2"></i> Đổi Mật Khẩu
                                </ListGroup.Item>
                               
                            </ListGroup>
                        </Card>
                    </Col>

                    {/* Nội dung chính */}
                    {isChangingPassword ? (
                       <Col  lg={8}>
                         <DoiMatKhau idPhuHuynh={localStorage.getItem('UserId')} />
                       </Col>
                    ) : (
                        <Col lg={8} className="profile-content">
                            <Tab.Container defaultActiveKey="personal-info">
                                <Card>
                                    <Card.Header>
                                        <Nav variant="tabs">
                                        <Nav.Item>
                                            <Nav.Link eventKey="personal-info">Thông Tin Cá Nhân</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="student-list">Danh Sách Học Viên</Nav.Link>
                                        </Nav.Item>
                                    </Nav>
                                </Card.Header>
                                <Card.Body>
                                    <Tab.Content>
                                        <Tab.Pane eventKey="personal-info">
                                            <Form onSubmit={handleUpdateInfo}>
                                                <h5>Thông Tin Phụ Huynh</h5>
                                                {updateError && <Alert variant="danger">{updateError}</Alert>}
                                                {updateSuccess && <Alert variant="success">{updateSuccess}</Alert>}
                                                <Row className="mt-3">
                                                    <Col md={6}>
                                                        <Form.Group className="mb-3" controlId="formTenPh">
                                                            <Form.Label>Họ và Tên</Form.Label>
                                                            <Form.Control type="text" name="tenPh" value={formData.tenPh || ''} onChange={handleInputChange} readOnly={!isEditing} />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={6}>
                                                        <Form.Group className="mb-3" controlId="formNgaySinh">
                                                            <Form.Label>Ngày Sinh</Form.Label>
                                                            <Form.Control type="date" name="ngaySinh" value={formData.ngaySinh || ''} onChange={handleInputChange} readOnly={!isEditing} />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={6}>
                                                        <Form.Group className="mb-3" controlId="formSdt">
                                                            <Form.Label>Số Điện Thoại</Form.Label>
                                                            <Form.Control type="text" name="sdt" value={formData.sdt || ''} onChange={handleInputChange} readOnly={!isEditing} />
                                                        </Form.Group>
                                                    </Col>
                                                </Row>
                                                <div className="d-flex justify-content-end">
                                                    {isEditing ? (
                                                        <>
                                                            <Button variant="secondary" onClick={() => { setIsEditing(false); handleCancelAvatarChange(); }} className="me-2" disabled={isLoadingUpdate}>
                                                                Hủy
                                                            </Button>
                                                            <Button variant="primary" type="submit" disabled={isLoadingUpdate}>
                                                                {isLoadingUpdate ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Lưu Thay Đổi'}
                                                            </Button>
                                                        </>
                                                    ) : (
                                                        <Button variant="outline-primary" onClick={() => { setIsEditing(true); setUpdateSuccess(''); setUpdateError(''); }}>
                                                            Chỉnh Sửa Thông Tin
                                                        </Button>
                                                    )}
                                                </div>
                                            </Form>
                                        </Tab.Pane>
                                        <Tab.Pane eventKey="student-list">
                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                <h5>Học Viên Liên Kết</h5>
                                                <Button variant="success" size="sm" onClick={handleOpenAddStudentModal}>
                                                    <i className="fas fa-plus me-2"></i>Thêm Học Viên
                                                </Button>
                                            </div>
                                            <ListGroup className="student-list">
                                                {phuHuynhInfo?.hocVien.length > 0 ? (
                                                    phuHuynhInfo.hocVien.map(hv => (
                                                        <ListGroup.Item key={hv.idHocVien}>
                                                            <div className="d-flex align-items-center">
                                                                <Image src={APIRoute.getUrlImage(hv.avatar) || 'https://via.placeholder.com/50'} className="student-avatar" />
                                                                <div className="student-info">
                                                                    <h6>{hv.tenHv}</h6>
                                                                    <small className="text-muted">Ngày sinh: {new Date(hv.ngaySinh).toLocaleDateString('vi-VN')}</small>
                                                                </div>
                                                            </div>
                                                            <Button variant="outline-secondary" size="sm">Xem chi tiết</Button>
                                                        </ListGroup.Item>
                                                    ))
                                                ) : (
                                                    <p className="text-center text-muted">Chưa có thông tin học viên nào.</p>
                                                )}
                                            </ListGroup>
                                        </Tab.Pane>
                                    </Tab.Content>
                                </Card.Body>
                            </Card>
                        </Tab.Container>
                    </Col>)}
                </Row>
            </Container>
            <Footer />
            {/* ========= MODAL THÊM HỌC VIÊN MỚI ========= */}
            <Modal show={showAddStudentModal} onHide={() => setShowAddStudentModal(false)} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Thêm Học Viên Mới</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {addStudentError && <Alert variant="danger">{addStudentError}</Alert>}
                    <Card>
                        <Card.Header as="h6">Nhập thông tin học viên</Card.Header>
                        <Card.Body>
                            <Form>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="formStudentName">
                                            <Form.Label>Họ và Tên</Form.Label>
                                            <Form.Control type="text" name="TenHv" placeholder="Nhập tên học viên" value={newStudentData.TenHv} onChange={handleNewStudentInputChange} />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="formStudentDob">
                                            <Form.Label>Ngày Sinh</Form.Label>
                                            <Form.Control type="date" name="NgaySinh" value={newStudentData.NgaySinh} onChange={handleNewStudentInputChange} />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="formStudentGender">
                                            <Form.Label>Giới Tính</Form.Label>
                                            <Form.Select name="GioiTinh" value={newStudentData.GioiTinh} onChange={handleNewStudentInputChange}>
                                                <option value="Nam">Nam</option>
                                                <option value="Nữ">Nữ</option>
                                                <option value="Khác">Khác</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="formStudentAvatar">
                                            <Form.Label>Ảnh đại diện (Tùy chọn)</Form.Label>
                                            <Form.Control type="file" accept="image/*" onChange={handleStudentAvatarChange} />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <div className="text-end">
                                    <Button variant="info" onClick={handleStageStudent}>
                                        <i className="fas fa-plus-circle me-2"></i>Thêm vào danh sách
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                    
                    {stagedStudents.length > 0 && (
                        <div className="mt-4">
                            <h6>Danh sách học viên sẽ được thêm</h6>
                            <Table striped bordered hover responsive size="sm">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Ảnh</th>
                                        <th>Tên Học Viên</th>
                                        <th>Ngày Sinh</th>
                                        <th>Giới Tính</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stagedStudents.map((student, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td><Image src={student.AvatarPreview || 'https://via.placeholder.com/40'} roundedCircle width={40} height={40} /></td>
                                            <td>{student.TenHv}</td>
                                            <td>{new Date(student.NgaySinh).toLocaleDateString('vi-VN')}</td>
                                            <td>{student.GioiTinh}</td>
                                            <td>
                                                <Button variant="outline-danger" size="sm" onClick={() => handleRemoveStagedStudent(index)}>
                                                    <i className="fas fa-trash-alt"></i>
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowAddStudentModal(false)}>Hủy</Button>
                    <Button variant="primary" onClick={handleConfirmAddStudents} disabled={isLoadingAddStudent || stagedStudents.length === 0}>
                        {isLoadingAddStudent ? <Spinner as="span" animation="border" size="sm" /> : `Xác Nhận Thêm ${stagedStudents.length} Học Viên`}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default ThongTinCaNhan;