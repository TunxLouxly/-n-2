/* =========================================================
   QuanTri.js - Khung trang quản trị: chuyển mục, hộp thoại, tổng quan
   Cần nạp trước: DuLieuThuCung.js, DuLieuYeuCau.js, XacThuc.js
   Nạp sau file này: QuanTriYeuCau.js, QuanTriThuCung.js, QuanTriDanhGia.js, QuanTriTaiKhoan.js
   ========================================================= */
(function () {

    const nd = XacThuc.layNguoiDung();
    if (!nd) return;                                    // XacThuc.js đang chuyển về trang đăng nhập
    const thoat = XacThuc.thoatHtml;
    const laQuanTri = nd.vaiTro === "quantri";

    // Nhân viên không thấy mục "Tài khoản"
    if (!laQuanTri) {
        document.querySelectorAll(".chi-quantri").forEach(function (e) { e.style.display = "none"; });
    }

    // ----- Hộp thoại dùng chung (cửa sổ nổi) -----
    const nen = document.createElement("div");
    nen.className = "qt-nen";
    document.body.appendChild(nen);

    function moHop(html, rong) {
        nen.innerHTML = '<div class="qt-hop' + (rong ? ' rong' : '') + '">' +
            '<button type="button" class="qt-hop-dong" data-dong="1" title="Đóng">×</button>' + html + '</div>';
        nen.classList.add("mo");
    }
    function dongHop() { nen.classList.remove("mo"); nen.innerHTML = ""; }
    nen.addEventListener("click", function (e) {
        if (e.target === nen || e.target.closest("[data-dong]")) dongHop();
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") dongHop(); });

    // Hỏi xác nhận trước khi làm việc nguy hiểm (xóa...)
    function xacNhan(cauHoi, khiDongY, nhanNut) {
        moHop('<h2>Xác nhận</h2><p class="qt-hoi">' + cauHoi + '</p>' +
            '<div class="qt-nut-hang"><button type="button" class="qt-nut do" id="qtDongY">' + (nhanNut || "Đồng ý") + '</button>' +
            '<button type="button" class="qt-nut vien" data-dong="1">Hủy</button></div>');
        document.getElementById("qtDongY").addEventListener("click", function () { dongHop(); khiDongY(); });
    }

    // ----- Các hàm nhỏ dùng chung -----
    function layBe(id) {
        return ThuCungDL.docTatCa().find(function (t) { return t.id === id; });
    }
    function tenBe(id) { const b = layBe(id); return b ? b.ten : "(bé đã bị xóa)"; }

    // ----- Chuyển mục -----
    const veTheoMuc = {};                               // tên mục -> hàm vẽ lại
    function dangKy(ten, hamVe) { veTheoMuc[ten] = hamVe; }

    function chuyenMuc(ten) {
        if (ten === "taikhoan" && !laQuanTri) ten = "tongquan";
        document.querySelectorAll(".qt-tab").forEach(function (b) { b.classList.toggle("hien", b.dataset.tab === ten); });
        document.querySelectorAll(".qt-muc").forEach(function (m) { m.classList.toggle("hien", m.id === "muc-" + ten); });
        if (veTheoMuc[ten]) veTheoMuc[ten]();
        capNhatChip();
        try { history.replaceState(null, "", "#" + ten); } catch (e) { }
    }
    document.querySelector(".qt-menu").addEventListener("click", function (e) {
        const b = e.target.closest(".qt-tab");
        if (b) chuyenMuc(b.dataset.tab);
    });

    // Số đơn đang chờ xử lý hiện cạnh menu
    function capNhatChip() {
        const dem = YeuCauDL.docTatCa().filter(function (y) { return y.trangThai === "guidi"; }).length;
        const chip = document.getElementById("chipYeuCau");
        chip.textContent = dem;
        chip.style.display = dem ? "inline-block" : "none";
    }

    // ----- Mục Tổng quan -----
    function veTongQuan() {
        const yc = YeuCauDL.docTatCa();
        const dem = function (tt) { return yc.filter(function (y) { return y.trangThai === tt; }).length; };
        const be = ThuCungDL.docTatCa();
        const tk = XacThuc.layTatCa();
        let danhGia = [];
        try { danhGia = JSON.parse(localStorage.getItem("tunxpet_danhgia")) || []; } catch (e) { }

        function the(so, nhan, mau, mucDen) {
            return '<button type="button" class="qt-the ' + mau + '" data-di="' + mucDen + '"><b>' + so + '</b><span>' + nhan + '</span></button>';
        }
        const moiNhat = yc.slice().sort(function (a, b) { return b.id - a.id; }).slice(0, 5);

        document.getElementById("muc-tongquan").innerHTML =
            '<h1>Tổng quan</h1>' +
            '<p class="qt-chao">Xin chào <b>' + thoat(nd.hoTen) + '</b> (' + XacThuc.TEN_VAI_TRO[nd.vaiTro] + '). ' +
                (dem("guidi") ? 'Có <b>' + dem("guidi") + '</b> đơn mới đang chờ bạn xử lý.' : 'Hiện không có đơn mới nào.') + '</p>' +
            '<div class="qt-luoi-the">' +
                the(dem("guidi"), "Đơn mới (Đã gửi)", "xanh", "yeucau") +
                the(dem("xemxet"), "Đang xem xét", "vang", "yeucau") +
                the(dem("daduyet"), "Đã duyệt", "luc", "yeucau") +
                the(dem("tuchoi"), "Chưa được duyệt", "do", "yeucau") +
                the(be.filter(function (t) { return t.trangThai !== "daco"; }).length, "Bé đang tìm chủ", "xanh", "thucung") +
                the(be.filter(function (t) { return t.trangThai === "daco"; }).length, "Bé đã có chủ", "luc", "thucung") +
                the(tk.filter(function (t) { return t.vaiTro === "nguoidung"; }).length, "Người dùng", "xam", laQuanTri ? "taikhoan" : "tongquan") +
                the(danhGia.length, "Đánh giá", "vang", "danhgia") +
            '</div>' +
            '<h2 class="qt-tieude-nho">Đơn nhận nuôi mới nhất</h2>' +
            (moiNhat.length
                ? '<table class="qt-bang"><thead><tr><th>Mã</th><th>Người gửi</th><th>Bé</th><th>Trạng thái</th></tr></thead><tbody>' +
                    moiNhat.map(function (y) {
                        return '<tr><td>#' + y.id + '</td><td>' + thoat(y.hoTen) + '</td><td>' + thoat(tenBe(y.thuCungId)) + '</td>' +
                               '<td><span class="yc-nhan yc-' + y.trangThai + '">' + YeuCauDL.TRANG_THAI[y.trangThai] + '</span></td></tr>';
                    }).join("") + '</tbody></table>'
                : '<p class="qt-trong">Chưa có đơn nhận nuôi nào.</p>');
    }
    document.getElementById("muc-tongquan").addEventListener("click", function (e) {
        const t = e.target.closest("[data-di]");
        if (t) chuyenMuc(t.dataset.di);
    });
    dangKy("tongquan", veTongQuan);

    // Cho các file QuanTri*.js khác dùng
    window.QT = {
        nguoiDung: nd, laQuanTri: laQuanTri, thoat: thoat,
        moHop: moHop, dongHop: dongHop, xacNhan: xacNhan,
        layBe: layBe, tenBe: tenBe, dangKy: dangKy, capNhatChip: capNhatChip,
        ngay: YeuCauDL.dinhDangNgay
    };

    // Mở trang: các file mục khác nạp xong rồi mới vẽ mục đầu tiên
    document.addEventListener("DOMContentLoaded", function () {
        const tuUrl = location.hash.replace("#", "");
        chuyenMuc(document.getElementById("muc-" + tuUrl) ? tuUrl : "tongquan");
    });

})();