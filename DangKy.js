/* =========================================================
   DangKy.js - Xử lý trang đăng ký (cần XacThuc.js nạp trước)
   Tài khoản đăng ký mới luôn có vai trò "Người dùng".
   ========================================================= */
(function () {

    const form = document.getElementById("formDangKy");

    // Nếu đã đăng nhập thì không cần đăng ký nữa
    const dangDangNhap = XacThuc.layNguoiDung();
    if (dangDangNhap) {
        window.location.href = XacThuc.trangChuaVaiTro(dangDangNhap.vaiTro);
        return;
    }

    function baoLoi(id, noiDung) {
        document.getElementById(id).textContent = noiDung;
    }
    function xoaLoi() {
        document.querySelectorAll(".dn-loi").forEach(function (s) { s.textContent = ""; });
    }

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        xoaLoi();

        const hoTen   = document.getElementById("dkHoTen").value.trim();
        const email   = document.getElementById("dkEmail").value.trim();
        const sdt     = document.getElementById("dkSdt").value.trim();
        const ten     = document.getElementById("dkTen").value.trim();
        const matKhau = document.getElementById("dkMatKhau").value;
        const nhapLai = document.getElementById("dkNhapLai").value;
        const dongY   = document.getElementById("dkDongY").checked;

        const danhSach = XacThuc.layTatCa();
        let hopLe = true;

        // Họ tên
        if (hoTen.length < 2) { baoLoi("loiHoTen", "Vui lòng nhập họ và tên."); hopLe = false; }

        // Email: đúng dạng và chưa ai dùng
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            baoLoi("loiEmail", "Email chưa đúng định dạng."); hopLe = false;
        } else if (danhSach.some(function (t) { return t.email.toLowerCase() === email.toLowerCase(); })) {
            baoLoi("loiEmail", "Email này đã được đăng ký."); hopLe = false;
        }

        // Số điện thoại: 10 số, bắt đầu bằng 0
        if (!/^0\d{9}$/.test(sdt)) {
            baoLoi("loiSdt", "Số điện thoại gồm 10 số, bắt đầu bằng 0."); hopLe = false;
        }

        // Tên đăng nhập: 4-20 ký tự chữ không dấu, số, gạch dưới; chưa ai dùng
        if (!/^[A-Za-z0-9_]{4,20}$/.test(ten)) {
            baoLoi("loiTen", "Gồm 4-20 ký tự: chữ không dấu, số hoặc dấu _."); hopLe = false;
        } else if (danhSach.some(function (t) { return t.tenDangNhap.toLowerCase() === ten.toLowerCase(); })) {
            baoLoi("loiTen", "Tên đăng nhập đã tồn tại."); hopLe = false;
        }

        // Mật khẩu
        if (matKhau.length < 6) { baoLoi("loiMatKhau", "Mật khẩu phải từ 6 ký tự trở lên."); hopLe = false; }
        if (nhapLai !== matKhau) { baoLoi("loiNhapLai", "Mật khẩu nhập lại chưa khớp."); hopLe = false; }

        // Đồng ý điều khoản
        if (!dongY) { baoLoi("loiDongY", "Bạn cần đồng ý điều khoản để tiếp tục."); hopLe = false; }

        if (!hopLe) return;

        // Tạo tài khoản mới và lưu lại
        danhSach.push({
            id: XacThuc.taoId(danhSach),
            hoTen: hoTen,
            email: email,
            sdt: sdt,
            tenDangNhap: ten,
            matKhau: matKhau,
            vaiTro: "nguoidung",
            trangThai: "hoatdong",
            ngayTao: new Date().toISOString()
        });
        XacThuc.luuTatCa(danhSach);

        // Chuyển sang trang đăng nhập, điền sẵn tên đăng nhập
        window.location.href = "DangNhap.html?moi=" + encodeURIComponent(ten);
    });

})();