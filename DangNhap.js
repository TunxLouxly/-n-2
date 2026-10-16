/* =========================================================
   DangNhap.js - Xử lý trang đăng nhập (cần XacThuc.js nạp trước)
   ========================================================= */
(function () {

    const formDN  = document.getElementById("formDangNhap");
    const formQM  = document.getElementById("formQuenMk");
    const tieuDe  = document.getElementById("dnTieuDe");
    const moTa    = document.getElementById("dnMoTa");
    const thongBao = document.getElementById("dnThongBao");

    // ----- Hàm nhỏ dùng nhiều lần -----
    function baoLoi(id, noiDung) {
        document.getElementById(id).textContent = noiDung;
    }
    function xoaLoi() {
        document.querySelectorAll(".dn-loi").forEach(function (s) { s.textContent = ""; });
    }
    function hienThongBao(noiDung, loai) {
        thongBao.textContent = noiDung;
        thongBao.className = "dn-thong-bao" + (noiDung ? " hien " + loai : "");
    }

    // ----- 1. Đã đăng nhập rồi thì chuyển thẳng đi -----
    const daDangNhap = XacThuc.layNguoiDung();
    if (daDangNhap) {
        window.location.href = XacThuc.trangChuaVaiTro(daDangNhap.vaiTro);
        return;
    }

    // ----- 2. Đọc thông báo từ địa chỉ (vừa đăng ký xong / bị chặn vào trang quản trị) -----
    const thamSo = new URLSearchParams(window.location.search);
    if (thamSo.get("moi")) {
        document.getElementById("dnTaiKhoan").value = thamSo.get("moi");
        hienThongBao("Đăng ký thành công! Hãy nhập mật khẩu để đăng nhập.", "ok");
        document.getElementById("dnMatKhau").focus();
    } else if (thamSo.get("can-dang-nhap")) {
        hienThongBao("Bạn cần đăng nhập bằng tài khoản quản trị hoặc nhân viên để vào trang này.", "loi");
    }

    // ----- 3. Đăng nhập -----
    formDN.addEventListener("submit", function (e) {
        e.preventDefault();
        xoaLoi();
        hienThongBao("", "");

        const taiKhoan = document.getElementById("dnTaiKhoan").value.trim();
        const matKhau  = document.getElementById("dnMatKhau").value;
        let hopLe = true;

        if (taiKhoan === "") { baoLoi("loiTaiKhoan", "Vui lòng nhập tài khoản."); hopLe = false; }
        if (matKhau === "")  { baoLoi("loiMatKhau", "Vui lòng nhập mật khẩu.");   hopLe = false; }
        if (!hopLe) return;

        // Tìm theo tên đăng nhập HOẶC email (không phân biệt hoa thường), mật khẩu phải đúng
        const tk = taiKhoan.toLowerCase();
        const tim = XacThuc.layTatCa().find(function (t) {
            return (t.tenDangNhap.toLowerCase() === tk || t.email.toLowerCase() === tk)
                && t.matKhau === matKhau;
        });

        if (!tim) {
            hienThongBao("Sai tài khoản hoặc mật khẩu.", "loi");
            return;
        }
        if (tim.trangThai !== "hoatdong") {
            hienThongBao("Tài khoản đã bị khóa. Vui lòng liên hệ quản trị viên.", "loi");
            return;
        }

        XacThuc.datNguoiDung(tim, document.getElementById("dnGhiNho").checked);
        window.location.href = XacThuc.trangChuaVaiTro(tim.vaiTro);
    });

    // ----- 4. Nút "Điền" tài khoản dùng thử -----
    document.querySelectorAll(".dn-demo button").forEach(function (nut) {
        nut.addEventListener("click", function () {
            document.getElementById("dnTaiKhoan").value = nut.dataset.tk;
            document.getElementById("dnMatKhau").value = nut.dataset.mk;
            xoaLoi();
        });
    });

    // ----- 5. Chuyển qua lại giữa "Đăng nhập" và "Quên mật khẩu" -----
    function hienQuenMk(hien) {
        formDN.classList.toggle("an", hien);
        formQM.classList.toggle("an", !hien);
        document.querySelector(".dn-hoac").classList.toggle("an", hien);
        document.querySelector(".dn-nut-phu").classList.toggle("an", hien);
        document.querySelector(".dn-demo").classList.toggle("an", hien);
        tieuDe.textContent = hien ? "Quên mật khẩu" : "Đăng nhập";
        moTa.textContent = hien
            ? "Nhập đúng tên đăng nhập, email và số điện thoại đã đăng ký để đặt mật khẩu mới."
            : "Dành cho người dùng, nhân viên và quản trị viên.";
        xoaLoi();
        hienThongBao("", "");
    }
    document.getElementById("linkQuenMk").addEventListener("click", function (e) {
        e.preventDefault();
        hienQuenMk(true);
    });
    document.getElementById("linkQuayLai").addEventListener("click", function (e) {
        e.preventDefault();
        hienQuenMk(false);
    });

    // ----- 6. Đặt lại mật khẩu -----
    formQM.addEventListener("submit", function (e) {
        e.preventDefault();
        xoaLoi();

        const ten   = document.getElementById("qmTen").value.trim().toLowerCase();
        const email = document.getElementById("qmEmail").value.trim().toLowerCase();
        const sdt   = document.getElementById("qmSdt").value.trim();
        const mkMoi = document.getElementById("qmMatKhau").value;
        const nhapLai = document.getElementById("qmNhapLai").value;
        let hopLe = true;

        if (ten === "")   { baoLoi("loiQmTen", "Vui lòng nhập tên đăng nhập.");  hopLe = false; }
        if (email === "") { baoLoi("loiQmEmail", "Vui lòng nhập email.");        hopLe = false; }
        if (sdt === "")   { baoLoi("loiQmSdt", "Vui lòng nhập số điện thoại."); hopLe = false; }
        if (mkMoi.length < 6) { baoLoi("loiQmMatKhau", "Mật khẩu phải từ 6 ký tự trở lên."); hopLe = false; }
        if (nhapLai !== mkMoi) { baoLoi("loiQmNhapLai", "Mật khẩu nhập lại chưa khớp."); hopLe = false; }
        if (!hopLe) return;

        const danhSach = XacThuc.layTatCa();
        const tk = danhSach.find(function (t) {
            return t.tenDangNhap.toLowerCase() === ten
                && t.email.toLowerCase() === email
                && t.sdt === sdt;
        });
        if (!tk) {
            baoLoi("loiQmTen", "Thông tin không khớp với tài khoản nào.");
            return;
        }

        tk.matKhau = mkMoi;
        XacThuc.luuTatCa(danhSach);

        formQM.reset();
        hienQuenMk(false);
        document.getElementById("dnTaiKhoan").value = tk.tenDangNhap;
        hienThongBao("Đặt lại mật khẩu thành công! Hãy đăng nhập bằng mật khẩu mới.", "ok");
    });

})();