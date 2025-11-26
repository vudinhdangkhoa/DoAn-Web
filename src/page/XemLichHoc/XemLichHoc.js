// import React, { useEffect, useState ,useRef} from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Container, Row, Col, Card, Spinner, Alert, Button, Form, Table, Image,ListGroup,Tooltip,OverlayTrigger } from 'react-bootstrap';
// import axios from 'axios';
// import APIRoute from '../../APIRoute';
// import CustomNavbar from '../../components/WellcomePage/Navbar';
// import Footer from '../../components/WellcomePage/Footer';
// import { useCourses } from "../../Hooks/WellcomPageHook";
// import './XemLichHoc.css'; // Import file CSS mới

// function XemLichHoc() {
//     const { courses: navCourses } = useCourses();
//     const navigate = useNavigate();

//     // State cho dữ liệu và giao diện
//     const [scheduleData, setScheduleData] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [selectedStudentId, setSelectedStudentId] = useState('');
    
//     // State mới cho việc quản lý tuần
//    const [currentDate, setCurrentDate] = useState(new Date());


//     // Hàm fetch dữ liệu lịch học
//     useEffect(() => {
//         const fetchScheduleData = async () => {
//             const idPhuHuynh = localStorage.getItem('UserId');
//             if (!idPhuHuynh) {
//                 navigate('/DangNhap');
//                 return;
//             }

//             setIsLoading(true);
//             setError(null);
//             try {
//                 // Sửa lại đúng API endpoint bạn đã cung cấp
//                 const response = await axios.get(APIRoute.getURL(`LichHoc/GetAllLopHocTaiKhoanLienKet/${idPhuHuynh}`));
//                 if (response.status === 200) {
//                     setScheduleData(response.data);
//                     // Tự động chọn học viên đầu tiên trong danh sách (nếu có)
//                     if (response.data.length > 0) {
//                         setSelectedStudentId(response.data[0].idHocVien);
//                     }
//                 }
//             } catch (err) {
//                 setError("Không thể tải dữ liệu lịch học.");
//                 console.error("Lỗi khi lấy dữ liệu lịch học:", err);
//             } finally {
//                 setIsLoading(false);
//             }
//         };

//         fetchScheduleData();
//     }, [navigate]);

//     // === THÊM REF VÀ CÁC HÀM XỬ LÝ SLIDER ===
//     const timetableScrollRef = useRef(null);

//     const handleScroll = (scrollOffset) => {
//         if (timetableScrollRef.current) {
//             timetableScrollRef.current.scrollLeft += scrollOffset;
//         }
//     };

//     // Tìm thông tin của học viên đang được chọn
//     const selectedStudent = scheduleData.find(student => student.idHocVien === parseInt(selectedStudentId));

//     // === CÁC HÀM TIỆN ÍCH XỬ LÝ NGÀY THÁNG ===
//     const getStartOfWeek = (date) => {
//         const d = new Date(date);
//         const day = d.getDay();
//         const diff = d.getDate() - day + (day === 0 ? -6 : 1);
//         d.setHours(0, 0, 0, 0); // Đặt về đầu ngày
//         return new Date(d.setDate(diff));
//     };

//     const startOfWeek = getStartOfWeek(currentDate);

//     const goToPreviousWeek = () => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 7)));
//     const goToNextWeek = () => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 7)));
//     const goToCurrentWeek = () => setCurrentDate(new Date());

//     // === HÀM RENDER THỜI KHÓA BIỂU DẠNG LIST THEO NGÀY ===
//     const renderTimetable = () => {
//        if (!selectedStudent) return null;

//         const weekDays = Array.from({ length: 7 }).map((_, i) => {
//             const day = new Date(startOfWeek);
//             day.setDate(startOfWeek.getDate() + i);
//             return day;
//         });

//         // Nhóm các buổi học theo ngày
//         const eventsByDay = {};
//         selectedStudent.hoaDon.forEach(hd => {
//             hd.lichHoc.forEach(lh => {
//                 const eventDate = new Date(lh.ngayHoc);
//                 const eventDateString = eventDate.toDateString(); // Dùng chuỗi để làm key
                
//                 if (!eventsByDay[eventDateString]) {
//                     eventsByDay[eventDateString] = [];
//                 }
                
//                 eventsByDay[eventDateString].push({
//                     ...lh,
//                     tenLopHoc: hd.tenLopHoc,
//                     thoiGianBatDau: hd.thoiGianBatDau,
//                     thoiGianKetThuc: hd.thoiGianKetThuc,
//                 });
//             });
//         });

//         const isToday = (date) => new Date().toDateString() === date.toDateString();

//         return (
//             <div className="timetable-container">
//                 <div className="timetable-header-controls">
//                     <Button variant="outline-secondary" onClick={goToPreviousWeek}>&lt; Tuần trước</Button>
//                     <h4>
//                         {`Tuần từ ${weekDays[0].toLocaleDateString('vi-VN')} - ${weekDays[6].toLocaleDateString('vi-VN')}`}
//                     </h4>
//                     <Button variant="primary" onClick={goToCurrentWeek} className="mx-2">Tuần này</Button>
//                     <Button variant="outline-secondary" onClick={goToNextWeek}>Tuần sau &gt;</Button>
//                 </div>
                
//                 <div className="timetable-slider-wrapper">
//                     {/* Nút lùi */}
//                     <Button className="slider-control prev" onClick={() => handleScroll(-320)}>
//                         &lt;
//                     </Button>
                    
//                     <div className="timetable-scroll-container" ref={timetableScrollRef}>
//                         {/* Thay thế <Row> bằng <div> này */}
//                         {weekDays.map((day, index) => {
//                             const dayString = day.toDateString();
//                             const events = (eventsByDay[dayString] || []).sort((a, b) => a.thoiGianBatDau.localeCompare(b.thoiGianBatDau));

//                             return (
//                                 <div key={index} className="daily-schedule-col">
//                                     <Card className="daily-card">
//                                         <Card.Header className={`daily-card-header ${isToday(day) ? 'is-today' : ''}`}>
//                                             <div className="d-flex justify-content-between align-items-center">
//                                                 <span className="day-name">{['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'][day.getDay()]}</span>
//                                                 <span className="date-number">{day.toLocaleDateString('vi-VN')}</span>
//                                             </div>
//                                         </Card.Header>
//                                         <Card.Body className="daily-card-body">
//                                             {events.length > 0 ? (
//                                                 events.map(event => (
//                                                     <div key={event.idLichHoc} className="schedule-event">
//                                                         <span className="event-time">
//                                                             {event.thoiGianBatDau.substring(0, 5)} - {event.thoiGianKetThuc.substring(0, 5)}
//                                                         </span>
//                                                         <div className="event-title">{event.tenLopHoc}</div>
//                                                         <div className="event-details">
//                                                             <i className="fas fa-map-marker-alt me-2"></i>
//                                                             Phòng: {event.tenPhong}
//                                                         </div>
//                                                     </div>
//                                                 ))
//                                             ) : (
//                                                 <div className="no-events-placeholder">
//                                                     <span>Không có lịch học</span>
//                                                 </div>
//                                             )}
//                                         </Card.Body>
//                                     </Card>
//                                 </div>
//                             );
//                         })}
//                     </div>
                    
//                     {/* Nút tiến */}
//                     <Button className="slider-control next" onClick={() => handleScroll(320)}>
//                         &gt;
//                     </Button>
//                 </div>
//             </div>
//         );
//     };

//     return (
//         <div>
//             <CustomNavbar navigate={navigate} courses={navCourses} />
//             <Container className="schedule-page-container">
//                 {isLoading ? (
//                     <div className="text-center"><Spinner animation="border" /></div>
//                 ) : error ? (
//                     <Alert variant="danger">{error}</Alert>
//                 ) : scheduleData.length>0 ? (
//                     <>
//                         <Row className="justify-content-center">
//                             <Col md={8}>
//                                 <Card className="student-selector-card">
//                                     <Card.Body>
//                                         <h3 className="text-center mb-4">Xem Lịch Học</h3>
//                                         <Form.Group controlId="studentSelector">
//                                             <Form.Label>Chọn tài khoản học viên:</Form.Label>
//                                             <Form.Select value={selectedStudentId} onChange={e => setSelectedStudentId(e.target.value)}>
//                                                 {scheduleData.map(student => (
//                                                     <option key={student.idHocVien} value={student.idHocVien}>
//                                                         {student.tenHv}
//                                                     </option>
//                                                 ))}
//                                             </Form.Select>
//                                         </Form.Group>
//                                     </Card.Body>
//                                 </Card>
//                             </Col>
//                         </Row>

//                         {selectedStudent && (
//                             <Row className="mt-4">
//                                 <Col>
//                                     <Card className="class-list-card">
//                                         <Card.Header as="h5">Các Lớp Đã Đăng Ký</Card.Header>
//                                         <Card.Body>
//                                             <Table striped bordered hover responsive>
//                                                 <thead>
//                                                     <tr>
//                                                         <th>#</th>
//                                                         <th>Tên Lớp Học</th>
//                                                         <th>Thời Gian</th>
//                                                     </tr>
//                                                 </thead>
//                                                 <tbody>
//                                                     {selectedStudent.hoaDon.map((hoaDon, index) => (
//                                                         <tr key={hoaDon.idHoaDon}>
//                                                             <td>{index + 1}</td>
//                                                             <td>{hoaDon.tenLopHoc}</td>
//                                                             <td>{`${hoaDon.thoiGianBatDau.substring(0, 5)} - ${hoaDon.thoiGianKetThuc.substring(0, 5)}`}</td>
//                                                         </tr>
//                                                     ))}
//                                                 </tbody>
//                                             </Table>
//                                         </Card.Body>
//                                     </Card>

//                                     {/* Phần Thời khóa biểu */}
//                                     {renderTimetable()}
//                                 </Col>
//                             </Row>
//                         )}
//                     </>
//                 ):
//                 (
//                     <Alert variant="info">Chưa có lịch học để hiển thị.</Alert>
//                 )}
//             </Container>
//             <Footer />
//         </div>
//     );
// }

// export default XemLichHoc;

import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Spinner, Alert, Button, Form, Table, Image } from 'react-bootstrap';
import axios from 'axios';
import APIRoute from '../../APIRoute';
import CustomNavbar from '../../components/WellcomePage/Navbar';
import Footer from '../../components/WellcomePage/Footer';
import { useCourses } from "../../Hooks/WellcomPageHook";
import './XemLichHoc.css';

function XemLichHoc() {
    const { courses: navCourses } = useCourses();
    const navigate = useNavigate();

    const [scheduleData, setScheduleData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedStudentId, setSelectedStudentId] = useState('');
    
    // State quản lý ngày hiện tại (để tính tuần)
    const [currentDate, setCurrentDate] = useState(new Date());

    // Ref cho scroll trên mobile
    const timetableScrollRef = useRef(null);

    // Fetch dữ liệu
    useEffect(() => {
        const fetchScheduleData = async () => {
            const idPhuHuynh = localStorage.getItem('UserId');
            if (!idPhuHuynh) {
                navigate('/DangNhap');
                return;
            }

            setIsLoading(true);
            setError(null);
            try {
                const response = await axios.get(APIRoute.getURL(`LichHoc/GetAllLopHocTaiKhoanLienKet/${idPhuHuynh}`));
                if (response.status === 200) {
                    setScheduleData(response.data);
                    if (response.data.length > 0) {
                        setSelectedStudentId(response.data[0].idHocVien);
                    }
                }
            } catch (err) {
                setError("Không thể tải dữ liệu lịch học.");
                console.error("Lỗi:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchScheduleData();
    }, [navigate]);

    // Xử lý scroll trên mobile
    const handleScroll = (scrollOffset) => {
        if (timetableScrollRef.current) {
            timetableScrollRef.current.scrollLeft += scrollOffset;
        }
    };

    const selectedStudent = scheduleData.find(student => student.idHocVien === parseInt(selectedStudentId));

    // Tính toán ngày đầu tuần
    const getStartOfWeek = (date) => {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Điều chỉnh để Thứ 2 là đầu tuần
        d.setHours(0, 0, 0, 0);
        return new Date(d.setDate(diff));
    };

    const startOfWeek = getStartOfWeek(currentDate);

    // Các hàm điều hướng tuần
    const goToPreviousWeek = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() - 7);
        setCurrentDate(newDate);
    };
    
    const goToNextWeek = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() + 7);
        setCurrentDate(newDate);
    };
    
    const goToCurrentWeek = () => setCurrentDate(new Date());

    // Hàm xử lý khi chọn ngày từ Date Picker
    const handleDateChange = (e) => {
        if(e.target.value){
            setCurrentDate(new Date(e.target.value));
        }
    };

    // Format date cho input value (YYYY-MM-DD)
    const formatDateForInput = (date) => {
        const d = new Date(date);
        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();
        const year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    }

    const renderTimetable = () => {
       if (!selectedStudent) return null;

        const weekDays = Array.from({ length: 7 }).map((_, i) => {
            const day = new Date(startOfWeek);
            day.setDate(startOfWeek.getDate() + i);
            return day;
        });

        const eventsByDay = {};
        selectedStudent.hoaDon.forEach(hd => {
            hd.lichHoc.forEach(lh => {
                const eventDate = new Date(lh.ngayHoc);
                const eventDateString = eventDate.toDateString();
                
                if (!eventsByDay[eventDateString]) {
                    eventsByDay[eventDateString] = [];
                }
                
                // Spread operator (...lh) sẽ tự động lấy luôn thuộc tính trangThai từ API
                eventsByDay[eventDateString].push({
                    ...lh, 
                    tenLopHoc: hd.tenLopHoc,
                    thoiGianBatDau: hd.thoiGianBatDau,
                    thoiGianKetThuc: hd.thoiGianKetThuc,
                });
            });
        });

        const isToday = (date) => new Date().toDateString() === date.toDateString();

        return (
            <div className="timetable-container">
                {/* Header Controls */}
                <div className="timetable-header-controls">
                    <Button variant="outline-secondary" size="sm" onClick={goToPreviousWeek}>
                        <i className="fas fa-chevron-left"></i> Tuần trước
                    </Button>

                    <div className="timetable-title-group">
                        <h4>
                            {`Từ ${weekDays[0].toLocaleDateString('vi-VN')} - ${weekDays[6].toLocaleDateString('vi-VN')}`}
                        </h4>
                        <div className="mt-2 d-flex justify-content-center align-items-center">
                             <Button variant="primary" size="sm" onClick={goToCurrentWeek} className="me-2">
                                Hôm nay
                            </Button>
                            <span>Đến ngày: </span>
                            <Form.Control 
                                type="date" 
                                className="date-search-input form-control-sm"
                                value={formatDateForInput(currentDate)}
                                onChange={handleDateChange}
                            />
                        </div>
                    </div>

                    <Button variant="outline-secondary" size="sm" onClick={goToNextWeek}>
                        Tuần sau <i className="fas fa-chevron-right"></i>
                    </Button>
                </div>
                
                <div style={{ position: 'relative' }}>
                    <Button className="slider-control-btn prev" onClick={() => handleScroll(-300)}>
                        <i className="fas fa-chevron-left"></i>
                    </Button>
                    
                    <div className="timetable-body-wrapper" ref={timetableScrollRef}>
                        {weekDays.map((day, index) => {
                            const dayString = day.toDateString();
                            const events = (eventsByDay[dayString] || []).sort((a, b) => a.thoiGianBatDau.localeCompare(b.thoiGianBatDau));

                            return (
                                <div key={index} className="daily-schedule-col">
                                    <Card className="daily-card">
                                        <Card.Header className={`daily-card-header ${isToday(day) ? 'is-today' : ''}`}>
                                            <span className="day-name">
                                                {['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'][day.getDay()]}
                                            </span>
                                            <div className="date-number">{day.toLocaleDateString('vi-VN')}</div>
                                        </Card.Header>
                                        <Card.Body className="daily-card-body">
                                            {events.length > 0 ? (
                                                events.map(event => {
                                                    // Kiểm tra trạng thái: false là nghỉ
                                                    const isCancelled = event.trangThai === false;

                                                    return (
                                                        <div 
                                                            key={event.idLichHoc} 
                                                            className={`schedule-event ${isCancelled ? 'cancelled' : ''}`}
                                                        >
                                                            <div className="d-flex justify-content-between align-items-start">
                                                                <span className="event-time">
                                                                    <i className={`far ${isCancelled ? 'fa-times-circle' : 'fa-clock'} me-1`}></i>
                                                                    {event.thoiGianBatDau.substring(0, 5)} - {event.thoiGianKetThuc.substring(0, 5)}
                                                                </span>
                                                                {isCancelled && (
                                                                    <span className="badge-cancelled">Nghỉ</span>
                                                                )}
                                                            </div>
                                                            
                                                            <div className="event-title">
                                                                {event.tenLopHoc}
                                                            </div>
                                                            <div className="event-details">
                                                                <small>
                                                                    <i className="fas fa-map-marker-alt me-1"></i>
                                                                    {event.tenPhong}
                                                                </small>
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                            ) : (
                                                <div className="no-events-placeholder">
                                                    -
                                                </div>
                                            )}
                                        </Card.Body>
                                    </Card>
                                </div>
                            );
                        })}
                    </div>
                    
                    <Button className="slider-control-btn next" onClick={() => handleScroll(300)}>
                        <i className="fas fa-chevron-right"></i>
                    </Button>
                </div>
            </div>
        );
    };

    return (
        <div>
            <CustomNavbar navigate={navigate} courses={navCourses} />
            <Container className="schedule-page-container">
                {isLoading ? (
                    <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>
                ) : error ? (
                    <Alert variant="danger">{error}</Alert>
                ) : scheduleData.length > 0 ? (
                    <>
                        <Row className="justify-content-center mb-4">
                            <Col md={6}>
                                <Card className="student-selector-card border-0">
                                    <Card.Body className="p-3">
                                        <Form.Group as={Row} controlId="studentSelector" className="align-items-center">
                                            <Form.Label column sm="4" className="fw-bold text-end">
                                                Xem lịch của:
                                            </Form.Label>
                                            <Col sm="8">
                                                <Form.Select 
                                                    value={selectedStudentId} 
                                                    onChange={e => setSelectedStudentId(e.target.value)}
                                                    className="shadow-sm"
                                                >
                                                    {scheduleData.map(student => (
                                                        <option key={student.idHocVien} value={student.idHocVien}>
                                                            {student.tenHv}
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                            </Col>
                                        </Form.Group>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>

                        {selectedStudent && (
                            <Row>
                                <Col>
                                    {renderTimetable()}
                                    
                                    {/* Danh sách lớp học bên dưới nếu cần */}
                                    <Card className="mt-4 class-list-card border-0">
                                        <Card.Header className="bg-white fw-bold border-bottom">
                                            <i className="fas fa-list-ul me-2 text-primary"></i>
                                            Danh Sách Lớp Đã Đăng Ký
                                        </Card.Header>
                                        <Card.Body className="p-0">
                                            <Table hover responsive className="mb-0">
                                                <thead className="bg-light">
                                                    <tr>
                                                        <th className="text-center" style={{width: '50px'}}>#</th>
                                                        <th>Tên Lớp Học</th>
                                                        <th>Giờ Học</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {selectedStudent.hoaDon.map((hoaDon, index) => (
                                                        <tr key={hoaDon.idHoaDon}>
                                                            <td className="text-center">{index + 1}</td>
                                                            <td className="fw-500">{hoaDon.tenLopHoc}</td>
                                                            <td>{`${hoaDon.thoiGianBatDau.substring(0, 5)} - ${hoaDon.thoiGianKetThuc.substring(0, 5)}`}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </Table>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        )}
                    </>
                ) : (
                    <Alert variant="info" className="text-center">
                        Chưa có dữ liệu lịch học.
                    </Alert>
                )}
            </Container>
            <Footer />
        </div>
    );
}

export default XemLichHoc;