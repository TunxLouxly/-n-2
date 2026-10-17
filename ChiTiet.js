/* =========================================================
   ChiTiet.js - Trang chi tiết thú cưng
   Địa chỉ dạng:  ChiTiet.html?id=1
   Cần nạp trước: DuLieuThuCung.js, Chung.js, XacThuc.js
   ========================================================= */
(function () {

    const KHOA_YEU_CAU = "tunxpet_yeucau";          // danh sách yêu cầu nhận nuôi (localStorage)
    const khung = document.getElementById("chiTiet");
    const thoat = XacThuc.thoatHtml;                // chống chèn mã HTML

    // ----- 1. Tìm bé theo id trên địa chỉ -----
    const id = Number(new URLSearchParams(window.location.search).get("id"));
    const tc = danhSachThuCung.find(function (t) { return t.id === id; });

    if (!tc) {
        khung.innerHTML =
            '<div class="ct-khong-co"><h1>Không tìm thấy bé thú cưng này</h1>' +
            '<p>Bé có thể đã tìm được chủ hoặc đường dẫn chưa đúng.</p>' +
            '<a href="TrangChu.html" class="ct-nut ct-nut-chinh">← Về trang chủ</a></div>';
        return;
    }
    document.title = tc.ten + " - TunxPet";

    // ----- 2. Chuẩn bị dữ liệu hiển thị (thiếu thì ghi "Đang cập nhật") -----
    const CAP_NHAT = "Đang cập nhật";
    function lay(giaTri) { return giaTri ? thoat(giaTri) : CAP_NHAT; }

    const idKhoiTrangChu = { "Chó": "cho", "Mèo": "meo", "Khác": "khac" }[tc.loai];
    const tenLoai = { "Chó": "Chó", "Mèo": "Mèo", "Khác": "Thú cưng khác" }[tc.loai];
    const dsAnh = (tc.anhPhu && tc.anhPhu.length) ? tc.anhPhu : (tc.anh ? [tc.anh] : []);

    function ngayVN(chuoi) {
        if (!chuoi) return CAP_NHAT;
        const p = chuoi.split("-");                  // "2026-08-10" -> "10/08/2026"
        return p[2] + "/" + p[1] + "/" + p[0];
    }
    function danhSachLi(mang, macDinh) {
        if (!mang || !mang.length) return "<p>" + macDinh + "</p>";
        return "<ul>" + mang.map(function (m) { return "<li>" + thoat(m) + "</li>"; }).join("") + "</ul>";
    }

    // ----- 3. Khung ảnh: ảnh lớn + ảnh nhỏ bên dưới -----
    let htmlAnh;
    if (dsAnh.length === 0) {
        htmlAnh = '<div class="ct-anh-lon" id="ctAnhLon">' + tc.icon + '</div>';
    } else {
        htmlAnh =
            '<div class="ct-anh-lon" id="ctAnhLon"><img src="' + dsAnh[0] + '" alt="' + thoat(tc.ten) + '"></div>';
        if (dsAnh.length > 1) {
            htmlAnh += '<div class="ct-anh-nho">' +
                dsAnh.map(function (src, i) {
                    return '<button type="button" class="ct-nho' + (i === 0 ? " chon" : "") +
                           '" data-src="' + src + '"><img src="' + src + '" alt="Ảnh ' + (i + 1) + '"></button>';
                }).join("") + '</div>';
        }
    }

    // ----- 4. Các bé cùng loại (tối đa 4) -----
    const lienQuan = danhSachThuCung.filter(function (t) {
        return t.loai === tc.loai && t.id !== tc.id;
    }).slice(0, 4);
    const htmlLienQuan = lienQuan.map(function (t) {
        const noiDungAnh = t.anh ? '<img src="' + t.anh + '" alt="' + thoat(t.ten) + '">' : t.icon;
        return '<div class="the-thu-cung">' +
               '<div class="anh-thu-cung">' + noiDungAnh + '</div>' +
               '<h3 class="ten-thu-cung">' + thoat(t.ten) + '</h3>' +
               '<p class="thong-tin">' + t.tuoi + ' · ' + t.gioiTinh + '</p>' +
               '<a href="ChiTiet.html?id=' + t.id + '" class="btn-chi-tiet">Xem chi tiết</a></div>';
    }).join("");
    // ----- 4b. Quyền lợi + hồ sơ (chung cho mọi bé; sửa chữ theo chính sách thật của bạn) -----
    const quaTang = {
        "Chó":  "Vòng cổ và dây dắt cho bé",
        "Mèo":  "Lồng vận chuyển và khay vệ sinh cho bé",
        "Khác": "Lồng vận chuyển nhỏ cho bé"
    }[tc.loai];
    const huongDan = {
        "Chó":  "Hướng dẫn huấn luyện cơ bản (đi vệ sinh đúng chỗ, ngồi, chờ)",
        "Mèo":  "Hướng dẫn bé làm quen nhà mới và dùng khay vệ sinh",
        "Khác": "Hướng dẫn làm chuồng, chọn thức ăn và vệ sinh cho bé"
    }[tc.loai];

    const htmlQuyenLoi =
        '<section class="ct-hop-luoi">' +
            '<div class="ct-hop ct-hop-do"><h3>CAM KẾT CHỈ CÓ TẠI TUNXPET</h3><ul>' +
                '<li><b>Nhận nuôi miễn phí</b>, không mua bán thú cưng</li>' +
                '<li>Nhân viên <b>hỏi thăm bé</b> sau 1 tháng và 3 tháng</li>' +
                '<li>Hỗ trợ y tế <b>30 ngày</b> đầu sau khi nhận nuôi</li>' +
                '<li>Nhận lại bé nếu hoàn cảnh của bạn thay đổi, <b>không bỏ rơi bé</b></li>' +
                '<li>Tư vấn qua Zalo <b>8:00 – 20:00</b> mỗi ngày</li>' +
            '</ul></div>' +
            '<div class="ct-hop"><h3>Quà tặng đi kèm</h3><ul>' +
                '<li>Thức ăn dùng thử 1 tuần cho bé</li>' +
                '<li>' + quaTang + '</li>' +
                '<li>Khám sức khỏe tổng quát lần đầu miễn phí</li>' +
                '<li>Cẩm nang chăm sóc bản giấy</li>' +
            '</ul></div>' +
            '<div class="ct-hop"><h3>Hỗ trợ thêm cho bạn</h3><ul>' +
                '<li>' + huongDan + '</li>' +
                '<li>Tư vấn dinh dưỡng theo độ tuổi của bé</li>' +
                '<li>Nhắc lịch tiêm phòng và tẩy giun định kỳ</li>' +
                '<li>Kết nối cộng đồng người nhận nuôi TunxPet</li>' +
            '</ul></div>' +
        '</section>';

    const htmlHoSo =
        '<section class="ct-ho-so">' +
            '<h2>HỒ SƠ ĐI KÈM</h2><div class="ct-chan">🐾</div>' +
            '<div class="ct-ho-so-luoi">' +
                '<div><span>📄</span>Giấy cam kết nhận nuôi</div>' +
                '<div><span>💉</span>Sổ theo dõi tiêm phòng</div>' +
                '<div><span>🩺</span>Phiếu thông tin sức khỏe</div>' +
                '<div><span>📘</span>Cẩm nang chăm sóc</div>' +
            '</div>' +
        '</section>';
    // ----- 5. Vẽ trang -----
    khung.innerHTML =
        '<p class="duong-dan"><a href="TrangChu.html">Trang chủ</a> › ' +
        '<a href="TrangChu.html#' + idKhoiTrangChu + '">' + tenLoai + '</a> › ' + thoat(tc.ten) + '</p>' +

        '<section class="ct-khung">' +
            '<div class="ct-cot-anh">' + htmlAnh + '</div>' +

            '<div class="ct-cot-tin">' +
                '<span class="ct-trang-thai">● Đang tìm chủ</span>' +
                '<h1>' + thoat(tc.ten) + '</h1>' +
                '<p class="ct-giong">' + tenLoai + ' · ' + lay(tc.giong) + '</p>' +

                '<dl class="ct-bang">' +
                    '<div><dt>Tuổi</dt><dd>' + thoat(tc.tuoi) + '</dd></div>' +
                    '<div><dt>Giới tính</dt><dd>' + thoat(tc.gioiTinh) + '</dd></div>' +
                    '<div><dt>Cân nặng</dt><dd>' + lay(tc.canNang) + '</dd></div>' +
                    '<div><dt>Màu lông</dt><dd>' + lay(tc.mauLong) + '</dd></div>' +
                    '<div class="ct-rong"><dt>Tiêm phòng</dt><dd>' + lay(tc.tiemPhong) + '</dd></div>' +
                    '<div><dt>Triệt sản</dt><dd>' + lay(tc.trietSan) + '</dd></div>' +
                    '<div><dt>Vị trí</dt><dd>' + lay(tc.viTri) + '</dd></div>' +
                    '<div><dt>Ngày tiếp nhận</dt><dd>' + ngayVN(tc.ngayTiepNhan) + '</dd></div>' +
                '</dl>' +

                (tc.tinhCach && tc.tinhCach.length
                    ? '<div class="ct-the">' + tc.tinhCach.map(function (t) {
                          return '<span>' + thoat(t) + '</span>'; }).join("") + '</div>'
                    : '') +

                '<div class="ct-nut-hang">' +
                    '<button type="button" class="ct-nut ct-nut-chinh" id="nutNhanNuoi">❤ Gửi yêu cầu nhận nuôi</button>' +
                    '<a href="LienHe.html" class="ct-nut ct-nut-phu">💬 Liên hệ tư vấn</a>' +
                '</div>' +
                '<p class="ct-ghi-chu">TunxPet không mua bán thú cưng. Mọi yêu cầu đều được nhân viên liên hệ và xét duyệt.</p>' +
            '</div>' +
        '</section>' +

        '<section class="ct-muc"><h2>Câu chuyện của ' + thoat(tc.ten) + '</h2><p>' +
            (tc.cauChuyen ? thoat(tc.cauChuyen)
                : 'Bé đang được TunxPet chăm sóc và chờ tìm một mái ấm mới. Thông tin chi tiết về bé đang được cập nhật, bạn có thể liên hệ tư vấn để biết thêm.') +
        '</p></section>' +

        '<section class="ct-muc ct-hai-cot">' +
            '<div><h2>Tình trạng sức khỏe</h2><p>' + lay(tc.suKhoa) + '</p></div>' +
            '<div><h2>Điều kiện người nhận nuôi</h2>' +
                danhSachLi(tc.yeuCau, "Từ 18 tuổi trở lên, cam kết chăm sóc bé lâu dài và đồng ý cho TunxPet hỏi thăm định kỳ.") +
            '</div>' +
        '</section>' +
        htmlQuyenLoi + htmlHoSo +
        '<section class="ct-muc ct-danh-gia" id="khuDanhGia"></section>' +
        (lienQuan.length
            ? '<section class="ct-muc"><h2>Các bé ' + tenLoai.toLowerCase() + ' khác đang tìm chủ</h2>' +
              '<div class="ct-lien-quan">' + htmlLienQuan + '</div></section>'
            : '');

    // ----- 6. Ảnh lỗi (chưa có file) -> bỏ ảnh nhỏ, ảnh lớn thì hiện emoji -----
    khung.addEventListener("error", function (e) {
        const anh = e.target;
        if (anh.tagName !== "IMG") return;
        const nho = anh.closest(".ct-nho");
        if (nho) { nho.remove(); return; }                      // ảnh nhỏ lỗi: bỏ đi
        if (anh.closest("#ctAnhLon")) {                          // ảnh lớn lỗi: hiện emoji
            document.getElementById("ctAnhLon").textContent = tc.icon;
            return;
        }
        if (anh.closest(".anh-thu-cung")) {                      // ảnh bé liên quan lỗi
            anh.parentElement.textContent = "🐾";
        }
    }, true);                                                    // true: bắt được sự kiện lỗi của ảnh

    // ----- 7. Bấm ảnh nhỏ -> đổi ảnh lớn -----
    khung.addEventListener("click", function (e) {
        const nho = e.target.closest(".ct-nho");
        if (!nho) return;
        const lon = document.getElementById("ctAnhLon");
        lon.innerHTML = '<img src="' + nho.dataset.src + '" alt="' + thoat(tc.ten) + '">';
        khung.querySelectorAll(".ct-nho").forEach(function (n) { n.classList.remove("chon"); });
        nho.classList.add("chon");
    });

    // ----- 8. Gửi yêu cầu nhận nuôi -----
    const nutNhanNuoi = document.getElementById("nutNhanNuoi");

    function docYeuCau() {
        try { return JSON.parse(localStorage.getItem(KHOA_YEU_CAU)) || []; } catch (e) { return []; }
    }
    function daGui(nd) {
        return docYeuCau().some(function (y) { return y.thuCungId === tc.id && y.nguoiDungId === nd.id; });
    }
    function capNhatNut() {
        const nd = XacThuc.layNguoiDung();
        if (nd && nd.vaiTro === "nguoidung" && daGui(nd)) {
            nutNhanNuoi.textContent = "✔ Đã gửi yêu cầu";
            nutNhanNuoi.disabled = true;
        }
    }
    capNhatNut();

    nutNhanNuoi.addEventListener("click", function () {
        const nd = XacThuc.layNguoiDung();

        if (!nd) {                                               // chưa đăng nhập -> sang trang đăng nhập
            XacThuc.hienToast("Vui lòng đăng nhập để gửi yêu cầu nhận nuôi.");
            setTimeout(function () { window.location.href = "DangNhap.html"; }, 1500);
            return;
        }
        if (nd.vaiTro !== "nguoidung") {                         // quản trị / nhân viên không nhận nuôi
            XacThuc.hienToast("Tài khoản quản trị / nhân viên không thể gửi yêu cầu nhận nuôi.");
            return;
        }
        if (daGui(nd)) return;

        const ds = docYeuCau();
        ds.push({
            id: ds.reduce(function (max, y) { return Math.max(max, y.id); }, 0) + 1,
            thuCungId: tc.id,
            nguoiDungId: nd.id,
            ngayGui: new Date().toISOString(),
            trangThai: "Chờ xử lý"        // Chờ xử lý › Đang liên hệ › Đã chấp nhận › Hoàn tất
        });
        localStorage.setItem(KHOA_YEU_CAU, JSON.stringify(ds));
        capNhatNut();
        XacThuc.hienToast("Đã gửi yêu cầu nhận nuôi " + tc.ten + "! Nhân viên sẽ sớm liên hệ bạn.");
    });
    // ----- 9. Đánh giá của người nhận nuôi (lưu trong localStorage) -----
    const KHOA_DANH_GIA = "tunxpet_danhgia";
    const khuDanhGia = document.getElementById("khuDanhGia");
    let xemTatCa = false;       // false: chỉ hiện 3 đánh giá mới nhất
    let dangViet = false;       // true: đang mở form viết đánh giá
    let saoChon = 5;            // số sao đang chọn trong form
    let dangTraLoi = null;      // id đánh giá đang được nhân viên trả lời

    function docDanhGia() {
        try { return JSON.parse(localStorage.getItem(KHOA_DANH_GIA)) || []; } catch (e) { return []; }
    }
    function luuDanhGia(ds) { localStorage.setItem(KHOA_DANH_GIA, JSON.stringify(ds)); }
    function chuoiSao(n) {
        return '<span class="ct-sao">' + "★".repeat(n) + '<span class="trong">' + "★".repeat(5 - n) + '</span></span>';
    }
    function laNhanVien(nd) { return nd && (nd.vaiTro === "quantri" || nd.vaiTro === "nhanvien"); }

    function veDanhGia() {
        const nd = XacThuc.layNguoiDung();
        const ds = docDanhGia()
            .filter(function (d) { return d.thuCungId === tc.id; })
            .sort(function (a, b) { return b.id - a.id; });                  // mới nhất lên trước
        const tong = ds.length;
        const diemTB = tong ? ds.reduce(function (s, d) { return s + d.sao; }, 0) / tong : 0;

        // Thanh phần trăm từng mức sao (5 -> 1)
        let thanh = "";
        for (let sao = 5; sao >= 1; sao--) {
            const soLuong = ds.filter(function (d) { return d.sao === sao; }).length;
            const phanTram = tong ? Math.round(soLuong / tong * 1000) / 10 : 0;
            thanh += '<div class="ct-dg-hang"><span>' + sao + '★</span>' +
                     '<div class="ct-dg-thanh"><i style="width:' + phanTram + '%"></i></div>' +
                     '<b>' + phanTram + '%</b></div>';
        }

        let html =
            '<h2 class="ct-tieu-de">CẢM NHẬN TỪ NGƯỜI NHẬN NUÔI</h2><div class="ct-chan">🐾</div>' +
            '<div class="ct-dg-tong">' +
                '<div class="ct-dg-diem"><strong>' + diemTB.toFixed(1) + '</strong>' + chuoiSao(Math.round(diemTB)) +
                    '<small>' + tong + ' đánh giá</small></div>' +
                '<div class="ct-dg-cot">' + thanh + '</div>' +
            '</div>';

        // Danh sách đánh giá
        if (tong === 0) {
            html += '<p class="ct-dg-trong">Chưa có đánh giá nào cho ' + thoat(tc.ten) + '. Hãy là người đầu tiên chia sẻ cảm nhận!</p>';
        } else {
            const hien = xemTatCa ? ds : ds.slice(0, 3);
            html += '<div class="ct-dg-ds">' + hien.map(function (d) {
                const traLoi = (d.traLoi || []).map(function (t) {
                    return '<div class="ct-tra-loi"><b>' + thoat(t.hoTen) + ' <em>(' + XacThuc.TEN_VAI_TRO[t.vaiTro] + ')</em></b>' +
                           '<p>' + thoat(t.noiDung) + '</p></div>';
                }).join("");

                let khungTraLoi = "";
                if (laNhanVien(nd)) {
                    khungTraLoi = (dangTraLoi === d.id)
                        ? '<form class="ct-form-tl" data-id="' + d.id + '"><textarea maxlength="500" placeholder="Nhập câu trả lời..."></textarea>' +
                          '<span class="ct-loi"></span>' +
                          '<button type="submit" class="ct-nut-nho ct-nut-do">Gửi</button> ' +
                          '<button type="button" class="ct-nut-nho ct-huy-tl">Hủy</button></form>'
                        : '<button type="button" class="ct-nut-nho ct-tra-loi-nut" data-id="' + d.id + '">+ Trả lời</button>';
                }

                return '<div class="ct-dg"><b>' + thoat(d.hoTen) + '</b> ' + chuoiSao(d.sao) +
                       ' <small>' + new Date(d.ngay).toLocaleDateString("vi-VN") + '</small>' +
                       '<p class="ct-dg-nd">' + thoat(d.noiDung) + '</p>' + traLoi + khungTraLoi + '</div>';
            }).join("") + '</div>';
        }

        // Nút dưới cùng
        html += '<div class="ct-dg-nut">';
        if (tong > 3) html += '<button type="button" class="ct-nut ct-nut-chinh" id="nutXemTatCa">' + (xemTatCa ? "Thu gọn" : "Xem tất cả") + '</button>';
        html += '<button type="button" class="ct-nut ct-nut-den" id="nutVietDanhGia">Viết đánh giá</button></div>';

        // Form viết đánh giá
        if (dangViet) {
            let saoForm = "";
            for (let i = 1; i <= 5; i++) {
                saoForm += '<button type="button" class="ct-sao-chon' + (i <= saoChon ? " bat" : "") + '" data-sao="' + i + '">★</button>';
            }
            html += '<form class="ct-dg-form" id="formDanhGia"><label>Bạn chấm mấy sao?</label>' +
                    '<div class="ct-chon-sao">' + saoForm + '</div>' +
                    '<textarea id="dgNoiDung" maxlength="500" placeholder="Chia sẻ cảm nhận của bạn về ' + thoat(tc.ten) + ' hoặc quá trình nhận nuôi (tối thiểu 10 ký tự)"></textarea>' +
                    '<span class="ct-loi" id="loiDanhGia"></span>' +
                    '<button type="submit" class="ct-nut ct-nut-chinh">Gửi đánh giá</button></form>';
        }
        khuDanhGia.innerHTML = html;
    }

    khuDanhGia.addEventListener("click", function (e) {
        const nd = XacThuc.layNguoiDung();

        if (e.target.closest("#nutXemTatCa")) { xemTatCa = !xemTatCa; veDanhGia(); return; }

        if (e.target.closest("#nutVietDanhGia")) {
            if (!nd) {
                XacThuc.hienToast("Vui lòng đăng nhập để viết đánh giá.");
                setTimeout(function () { window.location.href = "DangNhap.html"; }, 1500);
                return;
            }
            if (nd.vaiTro !== "nguoidung") { XacThuc.hienToast("Chỉ tài khoản người dùng mới viết được đánh giá."); return; }
            const daDanhGia = docDanhGia().some(function (d) { return d.thuCungId === tc.id && d.nguoiDungId === nd.id; });
            if (daDanhGia) { XacThuc.hienToast("Bạn đã đánh giá bé này rồi."); return; }
            dangViet = !dangViet;
            veDanhGia();
            return;
        }

        const chonSao = e.target.closest(".ct-sao-chon");
        if (chonSao) {                                   // chỉ đổi màu sao, không vẽ lại để giữ chữ đang gõ
            saoChon = Number(chonSao.dataset.sao);
            khuDanhGia.querySelectorAll(".ct-sao-chon").forEach(function (n) {
                n.classList.toggle("bat", Number(n.dataset.sao) <= saoChon);
            });
            return;
        }

        const nutTL = e.target.closest(".ct-tra-loi-nut");
        if (nutTL) { dangTraLoi = Number(nutTL.dataset.id); veDanhGia(); return; }
        if (e.target.closest(".ct-huy-tl")) { dangTraLoi = null; veDanhGia(); }
    });

    khuDanhGia.addEventListener("submit", function (e) {
        e.preventDefault();
        const nd = XacThuc.layNguoiDung();
        if (!nd) return;
        const ds = docDanhGia();

        // Gửi đánh giá mới
        if (e.target.id === "formDanhGia") {
            const noiDung = document.getElementById("dgNoiDung").value.trim();
            if (noiDung.length < 10) {
                document.getElementById("loiDanhGia").textContent = "Vui lòng viết ít nhất 10 ký tự.";
                return;
            }
            ds.push({
                id: ds.reduce(function (max, d) { return Math.max(max, d.id); }, 0) + 1,
                thuCungId: tc.id,
                nguoiDungId: nd.id,
                hoTen: nd.hoTen,
                sao: saoChon,
                noiDung: noiDung,
                ngay: new Date().toISOString(),
                traLoi: []
            });
            luuDanhGia(ds);
            dangViet = false;
            veDanhGia();
            XacThuc.hienToast("Cảm ơn bạn đã đánh giá!");
            return;
        }

        // Nhân viên / quản trị trả lời
        if (e.target.classList.contains("ct-form-tl") && laNhanVien(nd)) {
            const noiDung = e.target.querySelector("textarea").value.trim();
            if (noiDung.length < 2) { e.target.querySelector(".ct-loi").textContent = "Vui lòng nhập nội dung."; return; }
            const dg = ds.find(function (d) { return d.id === Number(e.target.dataset.id); });
            if (!dg) return;
            dg.traLoi = dg.traLoi || [];
            dg.traLoi.push({ hoTen: nd.hoTen, vaiTro: nd.vaiTro, noiDung: noiDung, ngay: new Date().toISOString() });
            luuDanhGia(ds);
            dangTraLoi = null;
            veDanhGia();
        }
    });

    veDanhGia();
})();