/* =========================================================
   QuanTriYeuCau.js - Quản trị / nhân viên duyệt đơn nhận nuôi
   Luồng: Đã gửi yêu cầu › Đang xem xét › Đã duyệt yêu cầu (hoặc Chưa được duyệt)
   ========================================================= */
(function () {

    if (!window.QT) return;
    const TT = YeuCauDL.TRANG_THAI;
    const thoat = QT.thoat;
    const muc = document.getElementById("muc-yeucau");
    let locTT = "tatca";
    let tuKhoa = "";

    muc.innerHTML =
        '<h1>Đơn nhận nuôi</h1>' +
        '<div class="qt-thanh-loc">' +
            '<select id="ycLoc"><option value="tatca">Tất cả trạng thái</option>' +
                Object.keys(TT).map(function (k) { return '<option value="' + k + '">' + TT[k] + '</option>'; }).join("") + '</select>' +
            '<input type="text" id="ycTim" placeholder="Tìm theo tên người gửi, SĐT, tên bé...">' +
        '</div>' +
        '<div id="ycBang"></div>';

    const ORDER = { guidi: 0, xemxet: 1, tuchoi: 2, daduyet: 3 };       // đơn cần xử lý lên trước

    function ve() {
        const ds = YeuCauDL.docTatCa().filter(function (y) {
            if (locTT !== "tatca" && y.trangThai !== locTT) return false;
            if (!tuKhoa) return true;
            const chuoi = (y.hoTen + " " + y.sdt + " " + QT.tenBe(y.thuCungId)).toLowerCase();
            return chuoi.indexOf(tuKhoa) !== -1;
        }).sort(function (a, b) {
            return (ORDER[a.trangThai] - ORDER[b.trangThai]) || (b.id - a.id);
        });

        document.getElementById("ycBang").innerHTML = ds.length === 0
            ? '<p class="qt-trong">Không có đơn nào phù hợp.</p>'
            : '<div class="qt-cuon"><table class="qt-bang"><thead><tr><th>Mã</th><th>Người gửi</th><th>Bé</th><th>Ngày gửi</th><th>Trạng thái</th><th></th></tr></thead><tbody>' +
              ds.map(function (y) {
                  return '<tr><td>#' + y.id + '</td>' +
                      '<td>' + thoat(y.hoTen) + '<br><small>' + thoat(y.sdt) + '</small></td>' +
                      '<td>' + thoat(QT.tenBe(y.thuCungId)) + '</td>' +
                      '<td>' + QT.ngay(y.ngayGui) + '</td>' +
                      '<td><span class="yc-nhan yc-' + y.trangThai + '">' + TT[y.trangThai] + '</span></td>' +
                      '<td><button type="button" class="qt-nut nho do" data-xem="' + y.id + '">Xem / xử lý</button></td></tr>';
              }).join("") + '</tbody></table></div>';
        QT.capNhatChip();
    }
    QT.dangKy("yeucau", ve);

    document.getElementById("ycLoc").addEventListener("change", function (e) { locTT = e.target.value; ve(); });
    document.getElementById("ycTim").addEventListener("input", function (e) { tuKhoa = e.target.value.trim().toLowerCase(); ve(); });
    muc.addEventListener("click", function (e) {
        const b = e.target.closest("[data-xem]");
        if (b) moChiTiet(parseInt(b.dataset.xem, 10));
    });

    // ----- Cửa sổ chi tiết một đơn -----
    function dong(nhan, giaTri) {
        return '<div><dt>' + nhan + '</dt><dd>' + (giaTri ? thoat(giaTri) : "—") + '</dd></div>';
    }

    function moChiTiet(id) {
        const y = YeuCauDL.docTatCa().find(function (t) { return t.id === id; });
        if (!y) return;
        const be = QT.layBe(y.thuCungId);
        const cacDon = YeuCauDL.docTatCa().filter(function (t) { return t.nguoiDungId === y.nguoiDungId && t.id !== y.id; });

        // Nút hành động theo trạng thái hiện tại
        let nut = "";
        if (y.trangThai === "guidi") {
            nut = '<button type="button" class="qt-nut vang" data-hd="xemxet">Bắt đầu xem xét</button>';
        } else if (y.trangThai === "xemxet") {
            nut = '<button type="button" class="qt-nut luc" data-hd="daduyet">✔ Duyệt đơn</button>' +
                  '<button type="button" class="qt-nut do" data-hd="tuchoi">✕ Không duyệt</button>';
        } else if (y.trangThai === "tuchoi") {
            nut = '<button type="button" class="qt-nut vang" data-hd="xemxet">Mở lại để xem xét</button>';
        }

        QT.moHop(
            '<h2>Đơn #' + y.id + ' · ' + thoat(be ? be.ten : "(bé đã bị xóa)") + '</h2>' +
            '<p><span class="yc-nhan yc-' + y.trangThai + '">' + TT[y.trangThai] + '</span>' +
              (be && be.trangThai === "daco" ? ' <span class="qt-the-nho">Bé này đã có chủ</span>' : '') + '</p>' +
            '<h3 class="qt-muc-nho">Thông tin người nhận nuôi</h3>' +
            '<dl class="qt-dl">' +
                dong("Họ và tên", y.hoTen) + dong("Số điện thoại", y.sdt) + dong("Email", y.email) +
                dong("Địa chỉ", y.diaChi) + dong("Nghề nghiệp", y.ngheNghiep) + dong("Nơi ở", y.nhaO) +
                dong("Kinh nghiệm nuôi", y.kinhNghiem) + dong("Ngày gửi", QT.ngay(y.ngayGui)) +
            '</dl>' +
            '<div class="qt-khung-lydo"><b>Lý do nhận nuôi:</b><br>' + thoat(y.lyDo).replace(/\n/g, "<br>") + '</div>' +
            '<p class="qt-nho">Người này có <b>' + cacDon.length + '</b> đơn khác (đã duyệt: ' +
                cacDon.filter(function (t) { return t.trangThai === "daduyet"; }).length + ').</p>' +
            '<h3 class="qt-muc-nho">Lịch sử xử lý</h3>' +
            '<ul class="qt-lich-su">' + y.lichSu.map(function (l) {
                return '<li>' + QT.ngay(l.ngay) + ' – <b>' + TT[l.trangThai] + '</b>' + (l.nguoiXuLy ? ' (' + thoat(l.nguoiXuLy) + ')' : '') + '</li>';
            }).join("") + '</ul>' +
            (y.ghiChu ? '<p><b>Ghi chú hiện tại:</b> ' + thoat(y.ghiChu) + '</p>' : '') +
            (nut
                ? '<div class="qt-o"><label for="ycGhiChu">Ghi chú gửi cho người nhận nuôi (bắt buộc khi không duyệt)</label>' +
                  '<textarea id="ycGhiChu" maxlength="300" placeholder="VD: Hẹn gặp trực tiếp ngày..., hoặc lý do chưa duyệt"></textarea>' +
                  '<span class="qt-loi" id="ycLoiGhiChu"></span></div>' +
                  '<div class="qt-nut-hang" id="ycNut" data-id="' + y.id + '">' + nut + '</div>'
                : '<p class="qt-nho">Đơn đã hoàn tất, không cần xử lý thêm.</p>'),
            true);
    }

    // Bấm nút hành động trong cửa sổ chi tiết
    document.addEventListener("click", function (e) {
        const hd = e.target.closest("#ycNut [data-hd]");
        if (!hd) return;
        const id = parseInt(document.getElementById("ycNut").dataset.id, 10);
        const hanhDong = hd.dataset.hd;
        const ghiChu = document.getElementById("ycGhiChu").value.trim();

        if (hanhDong === "tuchoi" && ghiChu.length < 5) {
            document.getElementById("ycLoiGhiChu").textContent = "Vui lòng ghi lý do không duyệt (ít nhất 5 ký tự).";
            return;
        }
        const y = YeuCauDL.docTatCa().find(function (t) { return t.id === id; });

        if (hanhDong === "daduyet") {
            const be = QT.layBe(y.thuCungId);
            if (!be) { QT.moHop('<h2>Không thể duyệt</h2><p>Bé này đã bị xóa khỏi hệ thống.</p>'); return; }
            if (be.trangThai === "daco") { QT.moHop('<h2>Không thể duyệt</h2><p>Bé này đã được người khác nhận nuôi.</p>'); return; }
            YeuCauDL.doiTrangThai(id, "daduyet", QT.nguoiDung.hoTen, ghiChu);

            // Bé đã có chủ -> ẩn khỏi trang công khai
            const dsBe = ThuCungDL.docTatCa();
            dsBe.find(function (t) { return t.id === y.thuCungId; }).trangThai = "daco";
            ThuCungDL.luuTatCa(dsBe);

            // Các đơn khác còn đang chờ cho bé này -> tự động chưa duyệt
            YeuCauDL.docTatCa().forEach(function (o) {
                if (o.id !== id && o.thuCungId === y.thuCungId && (o.trangThai === "guidi" || o.trangThai === "xemxet")) {
                    YeuCauDL.doiTrangThai(o.id, "tuchoi", QT.nguoiDung.hoTen, "Bé đã tìm được gia đình khác. Cảm ơn bạn đã quan tâm!");
                }
            });
            XacThuc.hienToast("Đã duyệt đơn #" + id + ". Bé " + be.ten + " được đánh dấu đã có chủ.");
        } else {
            YeuCauDL.doiTrangThai(id, hanhDong, QT.nguoiDung.hoTen, ghiChu);
            XacThuc.hienToast("Đã chuyển đơn #" + id + " sang: " + TT[hanhDong]);
        }
        QT.dongHop();
        ve();
    });

})();