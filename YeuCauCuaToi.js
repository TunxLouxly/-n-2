/* =========================================================
   YeuCauCuaToi.js - Người dùng theo dõi trạng thái yêu cầu nhận nuôi
   Cần nạp trước: DuLieuThuCung.js, DuLieuYeuCau.js, XacThuc.js
   ========================================================= */
(function () {

    const nd = XacThuc.layNguoiDung();
    if (!nd) return;                                   // XacThuc.js đang chuyển sang trang đăng nhập
    const thoat = XacThuc.thoatHtml;
    const TT = YeuCauDL.TRANG_THAI;
    const khung = document.getElementById("dsYeuCau");

    const dsCuaToi = YeuCauDL.docTatCa()
        .filter(function (y) { return y.nguoiDungId === nd.id; })
        .sort(function (a, b) { return b.id - a.id; });          // mới nhất lên trước

    if (dsCuaToi.length === 0) {
        khung.innerHTML =
            '<div class="yc-trong"><p>Bạn chưa gửi yêu cầu nhận nuôi nào.</p>' +
            '<a href="TrangChu.html" class="yc-nut yc-nut-do">Xem các bé đang tìm chủ</a></div>';
        return;
    }

    // Ngày của một bước (lần gần nhất yêu cầu chuyển sang trạng thái đó)
    function ngayBuoc(y, tt) {
        const m = y.lichSu.filter(function (l) { return l.trangThai === tt; }).pop();
        return m ? YeuCauDL.dinhDangNgay(m.ngay) : "";
    }

    // Thanh tiến trình 3 bước
    function veBuoc(y) {
        const viTri = YeuCauDL.CAC_BUOC.indexOf(y.trangThai);    // -1 nếu bị từ chối
        let html = '<ol class="yc-buoc">';
        YeuCauDL.CAC_BUOC.forEach(function (tt, i) {
            let lop = "";
            let ten = TT[tt];
            let ngay = ngayBuoc(y, tt);
            if (y.trangThai === "tuchoi") {
                if (i < 2) lop = "xong";
                else { lop = "tu-choi"; ten = TT.tuchoi; ngay = ngayBuoc(y, "tuchoi"); }
            } else if (i < viTri) {
                lop = "xong";
            } else if (i === viTri) {
                lop = (y.trangThai === "daduyet") ? "xong" : "hien-tai";
            }
            html += '<li class="' + lop + '"><span>' + (lop === "tu-choi" ? "✕" : (lop === "xong" ? "✓" : i + 1)) + '</span>' +
                    '<b>' + ten + '</b><small>' + ngay + '</small></li>';
        });
        return html + '</ol>';
    }

    const LOI_NHAN = {
        guidi:   "TunxPet đã nhận được yêu cầu của bạn và sẽ sớm xem xét.",
        xemxet:  "Nhân viên đang kiểm tra thông tin và điều kiện nhận nuôi của bạn.",
        daduyet: "Chúc mừng bạn! Yêu cầu đã được duyệt. TunxPet sẽ liên hệ để hẹn lịch gặp và đón bé.",
        tuchoi:  "Rất tiếc, yêu cầu của bạn chưa được duyệt."
    };

    function dong(nhan, giaTri) {
        return '<div><dt>' + nhan + '</dt><dd>' + (giaTri ? thoat(giaTri) : "—") + '</dd></div>';
    }

    khung.innerHTML = dsCuaToi.map(function (y) {
        const be = danhSachThuCung.find(function (t) { return t.id === y.thuCungId; });
        const ten = be ? be.ten : "Bé không còn trong danh sách";
        const anh = be && be.anh ? '<img src="' + be.anh + '" alt="' + thoat(ten) + '">' : (be ? be.icon : "🐾");
        return '<article class="yc-the">' +
            '<div class="yc-the-dau">' +
                '<div class="yc-anh">' + anh + '</div>' +
                '<div><h2>' + (be ? '<a href="ChiTiet.html?id=' + be.id + '">' + thoat(ten) + '</a>' : thoat(ten)) + '</h2>' +
                '<p>Mã yêu cầu #' + y.id + ' · Gửi lúc ' + YeuCauDL.dinhDangNgay(y.ngayGui) + '</p></div>' +
                '<span class="yc-nhan yc-' + y.trangThai + '">' + TT[y.trangThai] + '</span>' +
            '</div>' +
            veBuoc(y) +
            '<p class="yc-loi-nhan yc-' + y.trangThai + '">' + LOI_NHAN[y.trangThai] + '</p>' +
            (y.ghiChu ? '<p class="yc-ghi-chu"><b>Ghi chú từ TunxPet:</b> ' + thoat(y.ghiChu) + '</p>' : '') +
            '<details class="yc-chi-tiet"><summary>Thông tin bạn đã gửi</summary><dl>' +
                dong("Họ và tên", y.hoTen) + dong("Số điện thoại", y.sdt) + dong("Email", y.email) +
                dong("Địa chỉ", y.diaChi) + dong("Nghề nghiệp", y.ngheNghiep) + dong("Nơi ở", y.nhaO) +
                dong("Kinh nghiệm nuôi", y.kinhNghiem) + dong("Lý do nhận nuôi", y.lyDo) +
            '</dl></details>' +
        '</article>';
    }).join("");

})();