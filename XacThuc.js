/* =========================================================
   XacThuc.js - Quản lý tài khoản & phiên đăng nhập (dùng chung mọi trang)
   ========================================================= */

(function () {

    const KHOA_TAI_KHOAN = "tunxpet_taikhoan";   // danh sách tài khoản
    const KHOA_DANG_NHAP = "tunxpet_dangnhap";   // người đang đăng nhập

    const TEN_VAI_TRO = {
        quantri:   "Quản trị viên",
        nhanvien:  "Nhân viên",
        nguoidung: "Người dùng"
    };

    // ----- 1. Đọc / ghi bộ nhớ trình duyệt -----
    function doc(kho, khoa, macDinh) {
        try {
            const v = kho.getItem(khoa);
            return v ? JSON.parse(v) : macDinh;
        } catch (e) {
            return macDinh;
        }
    }
    function luu(kho, khoa, giaTri) {
        kho.setItem(khoa, JSON.stringify(giaTri));
    }

    // Chống chèn mã HTML khi in dữ liệu người dùng nhập ra trang
    function thoatHtml(chuoi) {
        const div = document.createElement("div");
        div.textContent = chuoi;
        return div.innerHTML;
    }

    // ----- 2. Tài khoản -----
    // 3 tài khoản mẫu, tạo ở lần chạy đầu tiên để thử ngay
    function taiKhoanMau() {
        const bayGio = new Date().toISOString();
        return [
            { id: 1, hoTen: "Quản trị viên", email: "admin@tunxpet.example", sdt: "0900000001",
              tenDangNhap: "admin", matKhau: "admin123", vaiTro: "quantri", trangThai: "hoatdong", ngayTao: bayGio },
            { id: 2, hoTen: "Nhân viên TunxPet", email: "nhanvien@tunxpet.example", sdt: "0900000002",
              tenDangNhap: "nhanvien", matKhau: "nhanvien123", vaiTro: "nhanvien", trangThai: "hoatdong", ngayTao: bayGio },
            { id: 3, hoTen: "Nguyễn Văn An", email: "nguoidung@tunxpet.example", sdt: "0900000003",
              tenDangNhap: "nguoidung", matKhau: "nguoidung123", vaiTro: "nguoidung", trangThai: "hoatdong", ngayTao: bayGio }
        ];
    }

    function layTatCa() {
        return doc(localStorage, KHOA_TAI_KHOAN, []);
    }
    function luuTatCa(danhSach) {
        luu(localStorage, KHOA_TAI_KHOAN, danhSach);
    }
    function taoId(danhSach) {
        // id mới = id lớn nhất hiện có + 1
        return danhSach.reduce(function (max, t) { return Math.max(max, t.id); }, 0) + 1;
    }

    // Lần đầu chưa có dữ liệu thì tạo tài khoản mẫu
    try {
        if (!localStorage.getItem(KHOA_TAI_KHOAN)) luuTatCa(taiKhoanMau());
    } catch (e) { /* trình duyệt chặn localStorage thì bỏ qua */ }

    // ----- 3. Người đang đăng nhập -----
    function layNguoiDung() {
        const nd = doc(localStorage, KHOA_DANG_NHAP, null) || doc(sessionStorage, KHOA_DANG_NHAP, null);
        if (!nd) return null;

        // Kiểm tra lại: tài khoản còn tồn tại và chưa bị khóa
        const tk = layTatCa().find(function (t) { return t.id === nd.id; });
        if (!tk || tk.trangThai !== "hoatdong") {
            dangXuat();
            return null;
        }
        return nd;
    }

    // ghiNho = true: lưu lâu dài; false: chỉ trong phiên hiện tại
    function datNguoiDung(taiKhoan, ghiNho) {
        localStorage.removeItem(KHOA_DANG_NHAP);
        sessionStorage.removeItem(KHOA_DANG_NHAP);
        const kho = ghiNho ? localStorage : sessionStorage;
        luu(kho, KHOA_DANG_NHAP, {
            id: taiKhoan.id,
            hoTen: taiKhoan.hoTen,
            tenDangNhap: taiKhoan.tenDangNhap,
            vaiTro: taiKhoan.vaiTro
        });
    }

    function dangXuat() {
        localStorage.removeItem(KHOA_DANG_NHAP);
        sessionStorage.removeItem(KHOA_DANG_NHAP);
    }

    // Trang người dùng được đưa tới sau khi đăng nhập
    function trangChuaVaiTro(vaiTro) {
        return (vaiTro === "quantri" || vaiTro === "nhanvien") ? "QuanTri.html" : "TrangChu.html";
    }

    // ----- 4. Thông báo nhỏ (toast) -----
    function hienToast(noiDung) {
        let toast = document.getElementById("toast");
        if (!toast) {
            toast = document.createElement("div");
            toast.id = "toast";
            toast.className = "toast";
            document.body.appendChild(toast);
        }
        toast.textContent = noiDung;
        void toast.offsetWidth;
        toast.classList.add("hien");
        setTimeout(function () { toast.classList.remove("hien"); }, 2500);
    }

    // ----- 5. Cập nhật phần tài khoản trên header -----
    function capNhatHeader() {
        const khung = document.querySelector(".tai-khoan");
        if (!khung) return;
        const nd = layNguoiDung();

        if (!nd) {
            khung.innerHTML =
                '<a href="DangNhap.html" class="btn-dang-nhap">👤 Đăng nhập</a>' +
                '<a href="DangKy.html" class="btn-dang-ky">Đăng ký</a>';
            return;
        }

        let html =
            '<span class="xin-chao">👤 Xin chào, <b>' + thoatHtml(nd.hoTen) + '</b></span>' +
            '<span class="vai-tro vt-' + nd.vaiTro + '">' + TEN_VAI_TRO[nd.vaiTro] + '</span>';

        if (nd.vaiTro === "quantri" || nd.vaiTro === "nhanvien") {
            html += '<a href="QuanTri.html" class="btn-quan-tri">Trang quản trị</a>';
        }
        html += '<button type="button" class="btn-dang-xuat" id="nutDangXuat">Đăng xuất</button>';
        khung.innerHTML = html;
    }

    // ----- 6. Chặn người không có quyền -----
    // Trang quản trị khai báo:  <body data-quyen="quantri,nhanvien">
    function kiemTraQuyen() {
        const quyen = document.body.dataset.quyen;
        if (!quyen) return;
        const nd = layNguoiDung();
        if (!nd || quyen.split(",").indexOf(nd.vaiTro) === -1) {
            window.location.href = "DangNhap.html?can-dang-nhap=1";
        }
    }

    // ----- 7. Bấm chuột: Đăng xuất và nút xem mật khẩu -----
    document.addEventListener("click", function (e) {
        if (e.target.closest("#nutDangXuat")) {
            dangXuat();
            if (document.body.dataset.quyen) {
                window.location.href = "TrangChu.html";
            } else {
                capNhatHeader();
                hienToast("Bạn đã đăng xuất.");
            }
            return;
        }

        // Nút con mắt: đổi ô mật khẩu giữa ẩn (••••) và hiện chữ
        const nutMat = e.target.closest(".nut-xem-mk");
        if (nutMat) {
            const o = document.getElementById(nutMat.dataset.muc);
            const dangAn = o.type === "password";
            o.type = dangAn ? "text" : "password";
            nutMat.textContent = dangAn ? "🙈" : "👁";
        }
    });

    // ----- 8. Chạy khi mở trang -----
    kiemTraQuyen();
    capNhatHeader();

    // Cho các file JS khác dùng
    window.XacThuc = {
        TEN_VAI_TRO: TEN_VAI_TRO,
        layTatCa: layTatCa,
        luuTatCa: luuTatCa,
        taoId: taoId,
        layNguoiDung: layNguoiDung,
        datNguoiDung: datNguoiDung,
        dangXuat: dangXuat,
        trangChuaVaiTro: trangChuaVaiTro,
        hienToast: hienToast,
        capNhatHeader: capNhatHeader,
        thoatHtml: thoatHtml
    };

})();