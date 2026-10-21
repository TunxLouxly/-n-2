/* =========================================================
   QuanTriTaiKhoan.js - Quản lý tài khoản (CHỈ quản trị viên)
   Thêm nhân viên, khóa / mở khóa, đặt lại mật khẩu, xóa
   ========================================================= */
(function () {

    if (!window.QT || !QT.laQuanTri) return;
    const thoat = QT.thoat;
    const muc = document.getElementById("muc-taikhoan");
    let locVT = "tatca";
    let tuKhoa = "";

    muc.innerHTML =
        '<h1>Quản lý tài khoản</h1>' +
        '<div class="qt-thanh-loc">' +
            '<select id="tkLoc"><option value="tatca">Tất cả vai trò</option><option value="quantri">Quản trị</option><option value="nhanvien">Nhân viên</option><option value="nguoidung">Người dùng</option></select>' +
            '<input type="text" id="tkTim" placeholder="Tìm theo tên, tài khoản, email...">' +
            '<button type="button" class="qt-nut do" id="tkThem">+ Thêm nhân viên</button>' +
        '</div>' +
        '<div id="tkBang"></div>';

    function ve() {
        const ds = XacThuc.layTatCa().filter(function (t) {
            if (locVT !== "tatca" && t.vaiTro !== locVT) return false;
            if (!tuKhoa) return true;
            return (t.hoTen + " " + t.tenDangNhap + " " + t.email).toLowerCase().indexOf(tuKhoa) !== -1;
        });
        document.getElementById("tkBang").innerHTML =
            '<div class="qt-cuon"><table class="qt-bang"><thead><tr><th>Họ tên</th><th>Tài khoản</th><th>Email</th><th>SĐT</th><th>Vai trò</th><th>Trạng thái</th><th></th></tr></thead><tbody>' +
            ds.map(function (t) {
                const laToi = t.id === QT.nguoiDung.id;
                const khoa = t.trangThai !== "hoatdong";
                const choPhep = t.vaiTro !== "quantri" && !laToi;           // không thao tác trên quản trị viên / chính mình
                return '<tr><td>' + thoat(t.hoTen) + (laToi ? ' <small>(bạn)</small>' : '') + '</td><td>' + thoat(t.tenDangNhap) + '</td>' +
                    '<td>' + thoat(t.email) + '</td><td>' + thoat(t.sdt || "—") + '</td>' +
                    '<td>' + XacThuc.TEN_VAI_TRO[t.vaiTro] + '</td>' +
                    '<td><span class="qt-nhan ' + (khoa ? "do" : "luc") + '">' + (khoa ? "Đã khóa" : "Hoạt động") + '</span></td>' +
                    '<td class="qt-hanh-dong">' + (choPhep
                        ? '<button type="button" class="qt-nut nho vien" data-khoa="' + t.id + '">' + (khoa ? "Mở khóa" : "Khóa") + '</button> ' +
                          '<button type="button" class="qt-nut nho vien" data-mk="' + t.id + '">Đặt lại MK</button> ' +
                          '<button type="button" class="qt-nut nho do" data-xoa="' + t.id + '">Xóa</button>'
                        : '') + '</td></tr>';
            }).join("") + '</tbody></table></div>';
    }
    QT.dangKy("taikhoan", ve);

    document.getElementById("tkLoc").addEventListener("change", function (e) { locVT = e.target.value; ve(); });
    document.getElementById("tkTim").addEventListener("input", function (e) { tuKhoa = e.target.value.trim().toLowerCase(); ve(); });
    document.getElementById("tkThem").addEventListener("click", moFormThem);

    function sua(id, hamSua) {
        const ds = XacThuc.layTatCa();
        const t = ds.find(function (x) { return x.id === id; });
        if (t) { hamSua(t); XacThuc.luuTatCa(ds); }
        return t;
    }

    muc.addEventListener("click", function (e) {
        const khoa = e.target.closest("[data-khoa]");
        const mk = e.target.closest("[data-mk]");
        const xoa = e.target.closest("[data-xoa]");

        if (khoa) {
            const t = sua(parseInt(khoa.dataset.khoa, 10), function (x) { x.trangThai = x.trangThai === "hoatdong" ? "khoa" : "hoatdong"; });
            ve(); XacThuc.hienToast((t.trangThai === "hoatdong" ? "Đã mở khóa " : "Đã khóa ") + t.tenDangNhap);
        }
        if (mk) {
            const id = parseInt(mk.dataset.mk, 10);
            QT.xacNhan('Đặt lại mật khẩu của tài khoản này về <b>123456</b>? Hãy báo họ đổi lại sau khi đăng nhập.', function () {
                const t = sua(id, function (x) { x.matKhau = "123456"; });
                XacThuc.hienToast("Đã đặt lại mật khẩu của " + t.tenDangNhap + " thành 123456");
            }, "Đặt lại");
        }
        if (xoa) {
            const id = parseInt(xoa.dataset.xoa, 10);
            const t = XacThuc.layTatCa().find(function (x) { return x.id === id; });
            QT.xacNhan('Xóa tài khoản <b>' + thoat(t.tenDangNhap) + '</b>? Không thể hoàn tác.', function () {
                XacThuc.luuTatCa(XacThuc.layTatCa().filter(function (x) { return x.id !== id; }));
                ve(); XacThuc.hienToast("Đã xóa tài khoản.");
            }, "Xóa");
        }
    });

    // ----- Thêm nhân viên -----
    function o(nhan, id, kieu) {
        return '<div class="qt-o"><label for="' + id + '">' + nhan + '</label><input type="' + (kieu || "text") + '" id="' + id + '"><span class="qt-loi" id="loi_' + id + '"></span></div>';
    }
    function moFormThem() {
        QT.moHop('<h2>Thêm nhân viên</h2>' +
            '<form id="tkForm" novalidate>' +
                '<div class="qt-hang">' + o("Họ và tên *", "tkHoTen") + o("Số điện thoại", "tkSdt") + '</div>' +
                o("Email *", "tkEmail") +
                '<div class="qt-hang">' + o("Tên đăng nhập *", "tkTenDN") + o("Mật khẩu *", "tkMatKhau", "password") + '</div>' +
                '<div class="qt-nut-hang"><button type="submit" class="qt-nut do">Tạo tài khoản</button>' +
                '<button type="button" class="qt-nut vien" data-dong="1">Hủy</button></div>' +
            '</form>');
    }

    document.addEventListener("submit", function (e) {
        if (e.target.id !== "tkForm") return;
        e.preventDefault();
        const lay = function (id) { return document.getElementById(id).value.trim(); };
        document.querySelectorAll("#tkForm .qt-loi").forEach(function (s) { s.textContent = ""; });
        let hopLe = true;
        function loi(id, nd) { document.getElementById("loi_" + id).textContent = nd; hopLe = false; }

        const ds = XacThuc.layTatCa();
        const hoTen = lay("tkHoTen"), sdt = lay("tkSdt"), email = lay("tkEmail"), tenDN = lay("tkTenDN"), mk = document.getElementById("tkMatKhau").value;

        if (hoTen.length < 2) loi("tkHoTen", "Vui lòng nhập họ tên.");
        if (sdt && !/^0\d{9}$/.test(sdt)) loi("tkSdt", "SĐT gồm 10 số, bắt đầu bằng 0.");
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) loi("tkEmail", "Email chưa đúng định dạng.");
        else if (ds.some(function (t) { return t.email.toLowerCase() === email.toLowerCase(); })) loi("tkEmail", "Email này đã được dùng.");
        if (tenDN.length < 4) loi("tkTenDN", "Tên đăng nhập tối thiểu 4 ký tự.");
        else if (ds.some(function (t) { return t.tenDangNhap.toLowerCase() === tenDN.toLowerCase(); })) loi("tkTenDN", "Tên đăng nhập đã tồn tại.");
        if (mk.length < 6) loi("tkMatKhau", "Mật khẩu tối thiểu 6 ký tự.");
        if (!hopLe) return;

        ds.push({
            id: ds.reduce(function (m, t) { return Math.max(m, t.id); }, 0) + 1,
            hoTen: hoTen, email: email, sdt: sdt, tenDangNhap: tenDN, matKhau: mk,
            vaiTro: "nhanvien", trangThai: "hoatdong", ngayTao: new Date().toISOString()
        });
        XacThuc.luuTatCa(ds);
        QT.dongHop(); ve();
        XacThuc.hienToast("Đã tạo tài khoản nhân viên " + tenDN + ".");
    });

})();