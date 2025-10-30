import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import WelcomePage from "./page/WelcomePage";
import DangNhap from "./page/XacThuc/DangNhap";
import DangKy from "./page/XacThuc/DangKy";
import QuenMatKhau from "./page/XacThuc/QuenMatKhau";
import DanhSachKhoaHoc from "./page/GioiThieuVaDKKhoaHoc/DanhSachKhoaHoc";
import ChiTietKhoaHoc from "./page/ChiTietKhoaHoc/ChietTietKhoaHoc";
import ThongTinCaNhan from "./page/ThongTinCaNhan/ThongTinCaNhan";
import PaymentResult from "./page/Payment/PaymentResult";
import XemLichHoc from "./page/XemLichHoc/XemLichHoc";
import LichSuThanhToan from "./page/LichSuThanhToan/LichSuThanhToan";
function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/DangNhap" element={<DangNhap />} />
        <Route path="/DangKy" element={<DangKy />} />
        <Route path="/QuenMatKhau" element={<QuenMatKhau />} />
        <Route path="/khoa-hoc/:idKhoaHoc" element={<ChiTietKhoaHoc />} />
        <Route path="/lien-he" element={<div style={{padding: '100px', textAlign: 'center'}}><h2>Trang Liên Hệ</h2><p>Đang phát triển...</p></div>} />
        <Route path="/danh-sach-khoa-hoc/:idLoaiKhoaHoc" element={<DanhSachKhoaHoc />} />
        <Route path="/thong-tin-ca-nhan" element={<ThongTinCaNhan />} />
        <Route path="/payment-result" element={<PaymentResult />} />
        <Route path="/xem-lich-hoc" element={<XemLichHoc />} />
        <Route path="/lich-su-thanh-toan" element={<LichSuThanhToan />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;