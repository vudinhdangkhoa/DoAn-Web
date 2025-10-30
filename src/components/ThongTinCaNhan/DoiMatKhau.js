import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { Container, Row, Col, Card, Button, Spinner, Alert, Form, Image, ListGroup, Tab, Nav, Modal,Table } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";
import { useEffect, useState,useRef } from "react";
import APIRoute from "../../APIRoute";

function DoiMatKhau({idPhuHuynh}) {

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (newPassword !== confirmPassword) {
            setError("Mật khẩu mới và xác nhận mật khẩu không khớp");
            return;
        }
        setLoading(true);
        try {
            const response = await axios.post(APIRoute.getURL(`ThongTinCaNhan/DoiMatKhau/${idPhuHuynh}`), {
                MatKhauCu: oldPassword,
                MatKhauMoi: newPassword
            });
            if (response.status === 200) {
                alert("Đổi mật khẩu thành công");
            }
        } catch (error) {
            console.error("Error changing password:", error);
            setError("Đã xảy ra lỗi. Vui lòng thử lại sau.");
        } finally {
            setLoading(false);
        }
    };

    return(
        <div>
            <Card>
                <Card.Header>Đổi Mật Khẩu</Card.Header>
                <Card.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="oldPassword">
                            <Form.Label>Mật khẩu cũ(nếu đăng nhập bằng tài khoản google thì nhập mật khẩu cũ là 123456)</Form.Label>
                            <Form.Control
                                type="password"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="newPassword">
                            <Form.Label>Mật khẩu mới</Form.Label>
                            <Form.Control
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="confirmPassword">
                            <Form.Label>Xác nhận mật khẩu mới</Form.Label>
                            <Form.Control
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" disabled={loading}>
                            {loading ? <Spinner animation="border" size="sm" /> : "Đổi Mật Khẩu"}
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );

}
export default DoiMatKhau;