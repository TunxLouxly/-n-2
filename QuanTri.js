/* =========================================================
   QuanTri.js - Trang quản trị (XacThuc.js đã chặn người không có quyền)
   ========================================================= */
(function () {

    const nd = XacThuc.layNguoiDung();
    if (!nd) return;                       // XacThuc.js đang chuyển trang đi rồi

    // Lời chào
    document.getElementById("qtChao").innerHTML =
        "Xin chào <b>" + XacThuc.thoatHtml(nd.hoTen) + "</b> (" + XacThuc.TEN_VAI_TRO[nd.vaiTro] + ").";

    // Đếm số tài khoản theo vai trò
    const danhSach = XacThuc.layTatCa();
    function dem(vaiTro) {
        return danhSach.filter(function (t) { return t.vaiTro === vaiTro; }).length;
    }
    document.getElementById("soQuanTri").textContent  = dem("quantri");
    document.getElementById("soNhanVien").textContent = dem("nhanvien");
    document.getElementById("soNguoiDung").textContent = dem("nguoidung");

})();