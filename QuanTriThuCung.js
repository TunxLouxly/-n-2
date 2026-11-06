/* =========================================================
   QuanTriThuCung.js - Thêm / sửa / xóa thú cưng
   Dữ liệu lưu qua ThuCungDL (DuLieuThuCung.js)
   ========================================================= */
(function () {

    if (!window.QT) return;
    const thoat = QT.thoat;
    const muc = document.getElementById("muc-thucung");
    let tuKhoa = "";
    let locLoai = "tatca";
    const ICON = { "Chó": "🐕", "Mèo": "🐈", "Khác": "🐇" };

    muc.innerHTML =
        '<h1>Thú cưng</h1>' +
        '<div class="qt-thanh-loc">' +
            '<select id="tcLoc"><option value="tatca">Tất cả loài</option><option>Chó</option><option>Mèo</option><option>Khác</option></select>' +
            '<input type="text" id="tcTim" placeholder="Tìm theo tên bé...">' +
            '<button type="button" class="qt-nut do" id="tcThem">+ Thêm thú cưng</button>' +
        '</div>' +
        '<div id="tcBang"></div>' +
        (QT.laQuanTri ? '<p class="qt-nho">Cần quay về danh sách mẫu ban đầu? <button type="button" class="qt-link" id="tcDatLai">Đặt lại dữ liệu thú cưng</button></p>' : '');

    function ve() {
        const ds = ThuCungDL.docTatCa().filter(function (t) {
            if (locLoai !== "tatca" && t.loai !== locLoai) return false;
            return !tuKhoa || t.ten.toLowerCase().indexOf(tuKhoa) !== -1;
        });
        document.getElementById("tcBang").innerHTML = ds.length === 0
            ? '<p class="qt-trong">Không có bé nào phù hợp.</p>'
            : '<div class="qt-cuon"><table class="qt-bang"><thead><tr><th>Mã</th><th>Bé</th><th>Loài</th><th>Tuổi</th><th>Giới tính</th><th>Vị trí</th><th>Trạng thái</th><th></th></tr></thead><tbody>' +
              ds.map(function (t) {
                  const daCo = t.trangThai === "daco";
                  return '<tr><td>' + t.id + '</td><td>' + (t.icon || "🐾") + ' ' + thoat(t.ten) + '</td><td>' + thoat(t.loai) + '</td>' +
                      '<td>' + thoat(t.tuoi) + '</td><td>' + thoat(t.gioiTinh) + '</td><td>' + thoat(t.viTri || "—") + '</td>' +
                      '<td><span class="qt-nhan ' + (daCo ? "luc" : "xanh") + '">' + (daCo ? "Đã có chủ" : "Đang tìm chủ") + '</span></td>' +
                      '<td class="qt-hanh-dong"><button type="button" class="qt-nut nho vien" data-sua="' + t.id + '">Sửa</button> ' +
                      '<button type="button" class="qt-nut nho do" data-xoa="' + t.id + '">Xóa</button></td></tr>';
              }).join("") + '</tbody></table></div>';
    }
    QT.dangKy("thucung", ve);

    document.getElementById("tcLoc").addEventListener("change", function (e) { locLoai = e.target.value; ve(); });
    document.getElementById("tcTim").addEventListener("input", function (e) { tuKhoa = e.target.value.trim().toLowerCase(); ve(); });
    document.getElementById("tcThem").addEventListener("click", function () { moForm(null); });
    const nutDatLai = document.getElementById("tcDatLai");
    if (nutDatLai) nutDatLai.addEventListener("click", function () {
        QT.xacNhan("Đặt lại danh sách thú cưng về dữ liệu mẫu ban đầu? Các bé bạn đã thêm / sửa sẽ mất.", function () {
            ThuCungDL.datLai(); ve(); XacThuc.hienToast("Đã đặt lại dữ liệu thú cưng.");
        }, "Đặt lại");
    });

    muc.addEventListener("click", function (e) {
        const sua = e.target.closest("[data-sua]");
        const xoa = e.target.closest("[data-xoa]");
        if (sua) moForm(parseInt(sua.dataset.sua, 10));
        if (xoa) xoaBe(parseInt(xoa.dataset.xoa, 10));
    });

    // ----- Xóa -----
    function xoaBe(id) {
        const be = QT.layBe(id);
        if (!be) return;
        const dangCho = YeuCauDL.docTatCa().filter(function (y) {
            return y.thuCungId === id && (y.trangThai === "guidi" || y.trangThai === "xemxet");
        }).length;
        if (dangCho > 0) {
            QT.moHop('<h2>Chưa thể xóa</h2><p>Bé <b>' + thoat(be.ten) + '</b> đang có ' + dangCho + ' đơn nhận nuôi chưa xử lý xong. Hãy xử lý các đơn đó trước.</p>');
            return;
        }
        QT.xacNhan('Xóa bé <b>' + thoat(be.ten) + '</b> khỏi hệ thống?', function () {
            ThuCungDL.luuTatCa(ThuCungDL.docTatCa().filter(function (t) { return t.id !== id; }));
            ve(); XacThuc.hienToast("Đã xóa bé " + be.ten + ".");
        }, "Xóa");
    }
    // ----- Nút "Chọn ảnh" trong form -----
    function capNhatXemAnh() {
        const inp = document.getElementById("tcAnh"), img = document.getElementById("tcXemAnh");
        if (!inp || !img) return;
        const v = inp.value.trim();
        if (v) { img.src = v; img.hidden = false; } else { img.removeAttribute("src"); img.hidden = true; }
    }
    document.addEventListener("click", function (e) {
        if (e.target.id === "tcChonAnh") document.getElementById("tcFileAnh").click();
        if (e.target.id === "tcXoaAnh") { document.getElementById("tcAnh").value = ""; capNhatXemAnh(); }
    });
    document.addEventListener("input", function (e) { if (e.target.id === "tcAnh") capNhatXemAnh(); });
    document.addEventListener("change", function (e) {
        if (e.target.id !== "tcFileAnh") return;
        const f = e.target.files[0];
        if (!f) return;
        if (!/^image\//.test(f.type)) { alert("Vui lòng chọn file ảnh (jpg, png...)."); return; }
        const doc = new FileReader();
        doc.onload = function () {
            const hinh = new Image();
            hinh.onload = function () {
                const MAX = 800, tl = Math.min(1, MAX / Math.max(hinh.width, hinh.height));   // thu nhỏ để nhẹ dữ liệu
                const cv = document.createElement("canvas");
                cv.width = Math.round(hinh.width * tl); cv.height = Math.round(hinh.height * tl);
                cv.getContext("2d").drawImage(hinh, 0, 0, cv.width, cv.height);
                document.getElementById("tcAnh").value = cv.toDataURL("image/jpeg", 0.82);
                capNhatXemAnh();
            };
            hinh.src = doc.result;
        };
        doc.readAsDataURL(f);
        e.target.value = "";
    });
    // ----- Form thêm / sửa -----
    function chon(id, giaTri, cacLuaChon) {
        return '<select id="' + id + '">' + cacLuaChon.map(function (c) {
            return '<option' + (c === giaTri ? ' selected' : '') + '>' + c + '</option>';
        }).join("") + '</select>';
    }
    function o(nhan, id, giaTri, ghiChu) {
        return '<div class="qt-o"><label for="' + id + '">' + nhan + '</label>' +
               '<input type="text" id="' + id + '" value="' + thoat(giaTri || "") + '"' + (ghiChu ? ' placeholder="' + ghiChu + '"' : '') + '>' +
               '<span class="qt-loi" id="loi_' + id + '"></span></div>';
    }

    function moForm(id) {
        const be = id ? QT.layBe(id) : {};
        QT.moHop(
            '<h2>' + (id ? 'Sửa thông tin bé ' + thoat(be.ten) : 'Thêm thú cưng mới') + '</h2>' +
            '<form id="tcForm" novalidate data-id="' + (id || "") + '">' +
                '<div class="qt-hang">' + o("Tên bé *", "tcTen", be.ten) +
                    '<div class="qt-o"><label>Loài *</label>' + chon("tcLoai", be.loai, ["Chó", "Mèo", "Khác"]) + '</div></div>' +
                '<div class="qt-hang">' + o("Tuổi *", "tcTuoi", be.tuoi, "VD: 2 tuổi, 4 tháng") +
                    '<div class="qt-o"><label>Giới tính *</label>' + chon("tcGioiTinh", be.gioiTinh, ["Đực", "Cái"]) + '</div></div>' +
                '<div class="qt-hang">' +
                    '<div class="qt-o"><label>Nhóm tuổi</label>' + chon("tcNhom", be.nhom, ["Con", "Lớn"]) + '</div>' +
                    o("Giống", "tcGiong", be.giong) + '</div>' +
                '<div class="qt-hang">' + o("Cân nặng", "tcCan", be.canNang, "VD: 6 kg") + o("Màu lông", "tcMau", be.mauLong) + '</div>' +
                '<div class="qt-hang">' +
                    '<div class="qt-o"><label>Tiêm phòng</label>' + chon("tcTiem", be.tiemPhong, ["Đã tiêm phòng", "Chưa tiêm phòng"]) + '</div>' +
                    '<div class="qt-o"><label>Triệt sản</label>' + chon("tcTriet", be.trietSan, ["Đã triệt sản", "Chưa triệt sản"]) + '</div></div>' +
                '<div class="qt-hang">' + o("Vị trí", "tcViTri", be.viTri, "VD: Hà Nội") +
                    '<div class="qt-o"><label for="tcNgay">Ngày tiếp nhận</label><input type="date" id="tcNgay" value="' + (be.ngayTiepNhan || "") + '"></div></div>' +
                                '<div class="qt-o"><label for="tcAnh">Đường dẫn ảnh</label>' +
                    '<div class="qt-anh-hang">' +
                        '<input type="text" id="tcAnh" value="' + thoat(be.anh || "") + '" placeholder="VD: ẢNH/meo-1.jpg (để trống sẽ hiện biểu tượng)">' +
                        '<button type="button" class="qt-nut vien" id="tcChonAnh">Chọn ảnh</button>' +
                        '<button type="button" class="qt-nut vien" id="tcXoaAnh">Xóa</button>' +
                        '<input type="file" id="tcFileAnh" accept="image/*" hidden>' +
                    '</div>' +
                    '<img id="tcXemAnh" class="qt-xem-anh" alt="Xem trước ảnh"' + (be.anh ? ' src="' + thoat(be.anh) + '"' : ' hidden') + '>' +
                    '<span class="qt-loi" id="loi_tcAnh"></span></div>' +
                '<div class="qt-o"><label for="tcCau">Câu chuyện / giới thiệu</label><textarea id="tcCau">' + thoat(be.cauChuyen || "") + '</textarea></div>' +
                '<div class="qt-o"><label>Trạng thái</label>' + chon("tcTrangThai", be.trangThai === "daco" ? "Đã có chủ" : "Đang tìm chủ", ["Đang tìm chủ", "Đã có chủ"]) + '</div>' +
                '<div class="qt-nut-hang"><button type="submit" class="qt-nut do">Lưu</button>' +
                '<button type="button" class="qt-nut vien" data-dong="1">Hủy</button></div>' +
            '</form>', true);
    }

    document.addEventListener("submit", function (e) {
        if (e.target.id !== "tcForm") return;
        e.preventDefault();
        const lay = function (id) { return document.getElementById(id).value.trim(); };
        document.querySelectorAll("#tcForm .qt-loi").forEach(function (s) { s.textContent = ""; });
        let hopLe = true;
        function loi(id, nd) { document.getElementById("loi_" + id).textContent = nd; hopLe = false; }

        if (lay("tcTen").length < 1) loi("tcTen", "Vui lòng nhập tên bé.");
        if (lay("tcTuoi").length < 1) loi("tcTuoi", "Vui lòng nhập tuổi.");
        if (!hopLe) return;

        const ds = ThuCungDL.docTatCa();
        const id = parseInt(e.target.dataset.id, 10);
        let be = id ? ds.find(function (t) { return t.id === id; }) : null;
        if (!be) {                                              // thêm mới
            be = { id: ds.reduce(function (m, t) { return Math.max(m, t.id); }, 0) + 1 };
            ds.push(be);
        }
        be.ten = lay("tcTen"); be.loai = lay("tcLoai"); be.tuoi = lay("tcTuoi"); be.gioiTinh = lay("tcGioiTinh");
        be.nhom = lay("tcNhom"); be.giong = lay("tcGiong"); be.canNang = lay("tcCan"); be.mauLong = lay("tcMau");
        be.tiemPhong = lay("tcTiem"); be.trietSan = lay("tcTriet"); be.viTri = lay("tcViTri");
        be.ngayTiepNhan = lay("tcNgay"); be.anh = lay("tcAnh"); be.cauChuyen = lay("tcCau");
        if (!be.icon) be.icon = ICON[be.loai] || "🐾";        // giữ biểu tượng cũ nếu đã có
        be.trangThai = lay("tcTrangThai") === "Đã có chủ" ? "daco" : "con";

        ThuCungDL.luuTatCa(ds);
        QT.dongHop();
        ve();
        XacThuc.hienToast(id ? "Đã lưu thông tin bé " + be.ten + "." : "Đã thêm bé " + be.ten + ".");
    });

})();