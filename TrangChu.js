
/* =========================================================
   TrangChu.js - Xử lý tương tác trang chủ TunxPet
   1) Dữ liệu thú cưng
   2) Hiển thị thú cưng vào từng khối
   3) Chuyển tab lọc
   4) Tìm kiếm theo tên
   5) Nút lên đầu trang
   ========================================================= */

// ----- 1. Dữ liệu thú cưng nằm ở file DuLieuThuCung.js -----

// ----- 2. Lấy các phần tử trên trang -----
const dsKhoi      = document.querySelectorAll(".khoi-thu-cung");
const formTimKiem = document.getElementById("formTimKiem");
const oTimKiem    = document.getElementById("oTimKiem");
const nutLenDau   = document.getElementById("nutLenDau");

let tuKhoa = "";

// ----- 3. Lọc thú cưng theo tab và từ khóa -----
function locThuCung(loai, loc) {
    const ketQua = danhSachThuCung.filter(function (tc) {
        if (tc.loai !== loai) return false;
        if (!tc.ten.toLowerCase().includes(tuKhoa.toLowerCase())) return false;

        if (loc === "con") return tc.nhom === "Con";
        if (loc === "lon") return tc.nhom === "Lớn";
        if (loc === "duc") return tc.gioiTinh === "Đực";
        if (loc === "cai") return tc.gioiTinh === "Cái";
        return true;
    });

    // Tab Mới nhất: ID lớn hơn xếp trước
    if (loc === "tatca") {
        ketQua.sort(function (a, b) {
            return b.id - a.id;
        });
    }

    return ketQua;
}

// ----- 4. Hiển thị các thẻ thú cưng -----
function veKhoi(khoi) {
    const loai = khoi.dataset.loai;
    const tab  = khoi.querySelector(".tab.active");
    const loc  = tab ? tab.dataset.loc : "tatca";
    const luoi = khoi.querySelector(".luoi-thu-cung");

    const ketQua = locThuCung(loai, loc);

    if (ketQua.length === 0) {
        luoi.innerHTML = '<p class="khong-co">Không tìm thấy thú cưng phù hợp.</p>';
        return;
    }

    let html = "";

    ketQua.forEach(function (tc) {
        const noiDungAnh = tc.anh
            ? '<img src="' + tc.anh + '" alt="' + tc.ten + '" onerror="this.outerHTML=\'' + tc.icon + '\'">'
            : tc.icon;

        html += `
            <div class="the-thu-cung">
                <div class="anh-thu-cung">${noiDungAnh}</div>
                <h3 class="ten-thu-cung">${tc.ten}</h3>
                <p class="thong-tin">${tc.tuoi} · ${tc.gioiTinh}</p>
                <a href="ChiTiet.html?id=${tc.id}" class="btn-chi-tiet">Xem chi tiết</a>
            </div>`;
    });

    luoi.innerHTML = html;
}

// ----- 5. Bấm vào tab trong từng khối -----
dsKhoi.forEach(function (khoi) {
    khoi.querySelector(".tabs").addEventListener("click", function (e) {
        const tab = e.target.closest(".tab");
        if (!tab) return;

        khoi.querySelectorAll(".tab").forEach(function (t) {
            t.classList.remove("active");
        });

        tab.classList.add("active");
        veKhoi(khoi);
    });
});

// ----- 6. Tìm kiếm -----
formTimKiem.addEventListener("submit", function (e) {
    e.preventDefault();
    tuKhoa = oTimKiem.value.trim();

    dsKhoi.forEach(veKhoi);

    // Cuộn tới khối đầu tiên có kết quả
    for (const khoi of dsKhoi) {
        if (khoi.querySelector(".the-thu-cung")) {
            khoi.scrollIntoView({ behavior: "smooth" });
            break;
        }
    }
});

// ----- 7. Nút lên đầu trang -----
window.addEventListener("scroll", function () {
    nutLenDau.style.display = window.scrollY > 300 ? "block" : "none";
});

nutLenDau.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

// ----- 8. Chạy lần đầu -----
dsKhoi.forEach(veKhoi);


/* =========================================================
   PHẦN DƯỚI TRANG CHỦ
   A) Câu chuyện nhận nuôi
   B) Kiến thức chăm sóc thú cưng
   ========================================================= */

// ----- A. Câu chuyện nhận nuôi -----

const danhSachCauChuyen = [
    {
        ten: "Chị Lan",
        anh: "ẢNH/Chi-Lan.jpg", // Thêm đường dẫn ảnh tại đây
        noiDung: "Mình nhận bé Mít về được 2 tháng, bé rất ngoan và quấn người. Cảm ơn TunxPet đã hướng dẫn mình cách chăm sóc bé từ những ngày đầu."
    },
    {
        ten: "Anh Đức",
        anh: "ẢNH/Anh-Duc.jpg",
        noiDung: "Thủ tục nhận nuôi rõ ràng, nhân viên liên hệ và hỏi kỹ điều kiện nhà mình. Bé mèo đã tiêm phòng đầy đủ nên mình rất yên tâm."
    },
    {
        ten: "Bạn Minh",
        anh: "ẢNH/Ban-Minh.jpg",
        noiDung: "Mình là sinh viên nên ban đầu hơi lo, nhưng TunxPet tư vấn rất nhiệt tình. Giờ bé Vàng là thành viên không thể thiếu trong phòng trọ."
    },
    {
        ten: "Cô Hà",
        anh: "ẢNH/Co-Ha.jpg",
        noiDung: "Nhà chỉ có hai vợ chồng già, nhận một bé mèo lớn tuổi về nuôi cho vui cửa vui nhà. Bé hiền lắm, cảm ơn các bạn tình nguyện viên."
    },
    {
        ten: "Anh Tuấn",
        anh: "ẢNH/Anh-Tuan.jpg",
        noiDung: "Mình theo dõi được trạng thái yêu cầu ngay trên website nên không phải hỏi đi hỏi lại. Rất tiện và minh bạch."
    },
    {
        ten: "Chị Thu",
        anh: "ẢNH/Chi-Thu.jpg",
        noiDung: "Con gái mình mê mèo từ lâu. Sau khi nhận bé Kem, cháu có trách nhiệm hơn hẳn, tự giờ cho bé ăn mỗi ngày."
    },
    {
        ten: "Bạn Hoàng",
        anh: "ẢNH/Ban-Hoang.jpg",
        noiDung: "Mình nhận bé thỏ về làm bạn cho con trai. Website có đủ ảnh và thông tin của bé nên mình chọn rất nhanh."
    },
    {
        ten: "Chị Mai",
        anh: "ẢNH/Chi-Mai.jpg",
        noiDung: "Nhận nuôi thay vì mua là quyết định mình thấy ý nghĩa nhất. Chúc TunxPet tìm được nhiều mái ấm hơn nữa."
    }
];

const SO_CAU_CHUYEN_MOI_TRANG = 4;
const luoiCauChuyen = document.getElementById("luoiCauChuyen");
const chamTrang     = document.getElementById("chamTrang");

// ----- Hiển thị câu chuyện -----
function veCauChuyen(trang) {
    const batDau = trang * SO_CAU_CHUYEN_MOI_TRANG;

    const cacThe = danhSachCauChuyen.slice(
        batDau,
        batDau + SO_CAU_CHUYEN_MOI_TRANG
    );

    let html = "";

    cacThe.forEach(function (cc) {

        // Có đường dẫn ảnh thì hiển thị ảnh
        // Chưa có đường dẫn thì để trống
        const hinhCauChuyen = cc.anh
            ? `<img src="${cc.anh}" alt="Ảnh của ${cc.ten}" class="story-avatar">`
            : "";

        html += `
            <div class="the-cau-chuyen">
                <div class="cc-anh">${hinhCauChuyen}</div>
                <p class="cc-noi-dung">${cc.noiDung}</p>
                <div class="cc-ten">${cc.ten} <span>”</span></div>
            </div>`;
    });

    luoiCauChuyen.innerHTML = html;

    // Tô đỏ chấm của trang đang xem
    chamTrang.querySelectorAll(".cham").forEach(function (cham, i) {
        cham.classList.toggle("active", i === trang);
    });
}

// ----- Tạo các chấm chuyển trang -----
const soTrang = Math.ceil(
    danhSachCauChuyen.length / SO_CAU_CHUYEN_MOI_TRANG
);

for (let i = 0; i < soTrang; i++) {
    const cham = document.createElement("button");

    cham.className = "cham";
    cham.title = "Trang " + (i + 1);

    cham.addEventListener("click", function () {
        veCauChuyen(i);
    });

    chamTrang.appendChild(cham);
}

veCauChuyen(0);


// ----- B. Kiến thức chăm sóc thú cưng (video YouTube) -----
// "video": dán link YouTube hoặc chỉ mã 11 ký tự. Để trống thì hiện biểu tượng như cũ.
const danhSachKienThuc = [
    { tieu_de: "Những điều cần biết trước khi nhận nuôi thú cưng", icon: "📋",
      video: "https://youtu.be/cyw3KBzn8Cw?si=Xn1pHDU-YUQx01CU",   
      mo_ta: "Nhận nuôi là cam kết lâu dài. Hãy cân nhắc thời gian, chi phí, không gian sống và sự đồng thuận của cả gia đình trước khi đón một bé về nhà." },
    { tieu_de: "Cách làm quen với thú cưng mới trong tuần đầu", icon: "🏠",
      video: "https://youtu.be/INXw54A66UI?si=lvfURMVsoRIFV1M4",
      mo_ta: "Hãy cho bé một góc riêng yên tĩnh, không ép bé tiếp xúc quá nhiều. Kiên nhẫn cho bé thời gian để làm quen với mùi hương và âm thanh trong nhà." },
    { tieu_de: "Chế độ ăn phù hợp cho chó con và mèo con", icon: "🍖",
      video: "https://youtu.be/hpCPylljres?si=JXe7WdnVIVplS5ew",
      mo_ta: "Bé nhỏ cần ăn chia nhiều bữa với thức ăn phù hợp độ tuổi. Luôn có nước sạch và tránh các thực phẩm độc hại như sô-cô-la, hành, tỏi." },
    { tieu_de: "Lịch tiêm phòng và tẩy giun định kỳ", icon: "💉",
      video: "https://youtu.be/H3Li-_ZbbIk?si=xFWXsdGcmZva8pRY",
      mo_ta: "Tiêm phòng đầy đủ giúp bé tránh các bệnh nguy hiểm. Hãy lưu sổ tiêm và tái khám theo hẹn của bác sĩ thú y." },
    { tieu_de: "Dấu hiệu cho thấy thú cưng đang không khỏe", icon: "🩺",
      video: "https://youtu.be/XPT-Pp5TJzQ?si=TtnrtUvgZRbNcfST",
      mo_ta: "Bỏ ăn, ủ rũ, nôn mửa hoặc tiêu chảy kéo dài là những dấu hiệu cần đưa bé đi khám sớm thay vì tự điều trị tại nhà." }
];

const ktLon = document.getElementById("ktLon");
const ktDs  = document.getElementById("ktDs");

// Lấy mã video 11 ký tự từ link YouTube (hoặc từ chính mã)
function layIdYoutube(s) {
    if (!s) return "";
    const m = s.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([A-Za-z0-9_-]{11})/);
    if (m) return m[1];
    return /^[A-Za-z0-9_-]{11}$/.test(s.trim()) ? s.trim() : "";
}

// Hiện bài số "chiSo": khung lớn tự phát video (tắt tiếng, lặp lại), bấm mục bên phải thì đổi video
function hienBaiKienThuc(chiSo) {
    const bai = danhSachKienThuc[chiSo];
    const id = layIdYoutube(bai.video);
    const khungAnh = id
        ? `<div class="kt-anh co-video">
               <iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=1&rel=0&modestbranding=1&playsinline=1"
                       title="${bai.tieu_de}" loading="lazy"
                       allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>
           </div>`
        : `<div class="kt-anh">${bai.icon}</div>`;

    ktLon.innerHTML = khungAnh + `
        <div class="kt-noi-dung">
            <h3>${bai.tieu_de}</h3>
            <p>${bai.mo_ta}</p>
        </div>`;
    ktDs.querySelectorAll("li").forEach(function (li, i) {
        li.classList.toggle("active", i === chiSo);
    });
}

// Vẽ danh sách bên phải, bấm vào bài nào thì hiện bài đó ở khung lớn
danhSachKienThuc.forEach(function (bai, i) {
    const li = document.createElement("li");
    li.innerHTML = `<div class="kt-icon">${bai.icon}</div><h4>${bai.tieu_de}</h4>`;
    li.addEventListener("click", function () { hienBaiKienThuc(i); });
    ktDs.appendChild(li);
});
hienBaiKienThuc(0);


/* =========================================================
   MENU THẢ XUỐNG DANH MỤC THÚ CƯNG
   ========================================================= */

const nutDanhMuc   = document.getElementById("nutDanhMuc");
const menuDanhMuc  = document.getElementById("menuDanhMuc");
const khungDanhMuc = nutDanhMuc.parentElement;

// Bấm nút danh mục để mở hoặc đóng
nutDanhMuc.addEventListener("click", function (e) {
    e.stopPropagation();
    khungDanhMuc.classList.toggle("mo");
});

// Bấm vào một mục thì đóng menu
menuDanhMuc.addEventListener("click", function () {
    khungDanhMuc.classList.remove("mo");
});

// Bấm ra ngoài thì đóng menu
document.addEventListener("click", function (e) {
    if (!khungDanhMuc.contains(e.target)) {
        khungDanhMuc.classList.remove("mo");
    }
});

// Nhấn Esc thì đóng menu
document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
        khungDanhMuc.classList.remove("mo");
    }
});


// ----- Tìm kiếm nếu được chuyển từ trang khác sang -----
const tuKhoaTuUrl = new URLSearchParams(window.location.search).get("q");

if (tuKhoaTuUrl) {
    tuKhoa = tuKhoaTuUrl.trim();
    oTimKiem.value = tuKhoa;
}

// Chạy lại danh sách thú cưng
dsKhoi.forEach(veKhoi);


// ----- Tự động chuyển câu chuyện sau 5 giây -----
(function () {
    const GIAY = 5;

    const cham = document.getElementById("chamTrang");
    const luoi = document.getElementById("luoiCauChuyen");

    if (!cham || !luoi) return;

    let vt = 0;
    let tamDung = false;

    // Khi người dùng bấm chấm chuyển trang
    cham.addEventListener("click", function (e) {
        const nut = e.target.closest("button, span, a, li");

        if (!nut || nut.parentNode !== cham) return;

        vt = Array.prototype.indexOf.call(cham.children, nut);
    });

    // Dừng chuyển tự động khi rê chuột vào
    [cham, luoi].forEach(function (el) {
        el.addEventListener("mouseenter", function () {
            tamDung = true;
        });

        el.addEventListener("mouseleave", function () {
            tamDung = false;
        });
    });

    // Tự động chuyển trang
    setInterval(function () {
        if (tamDung || document.hidden) return;

        const dots = cham.children;

        if (dots.length < 2) return;

        vt = (vt + 1) % dots.length;
        dots[vt].click();

    }, GIAY * 1000);

})();
/* =========================================================
   Khối bài viết / tin tức:
   - Bài nổi bật tự đổi, có chấm chuyển
   - Đếm ngược tới ngày hội
   - Số liệu đếm từ 0 lên
   - Hiện dần khi cuộn tới
   ========================================================= */
(function () {
    // ----- 1. Bài nổi bật tự đổi -----
    const slider = document.getElementById("ttSlider");
    if (slider) {
        const cacBai = Array.prototype.slice.call(slider.querySelectorAll(".tt-lon"));
        const cham = document.getElementById("ttCham");
        let vt = 0, tamDung = false, dem = null;
        const dots = cacBai.map(function (_, i) {
            const b = document.createElement("button");
            b.type = "button"; b.setAttribute("aria-label", "Bài " + (i + 1));
            b.addEventListener("click", function () { hien(i); datLai(); });
            cham.appendChild(b);
            return b;
        });
        function hien(i) {
            vt = (i + cacBai.length) % cacBai.length;
            cacBai.forEach(function (b, k) { b.classList.toggle("dang-hien", k === vt); });
            dots.forEach(function (d, k) { d.classList.toggle("bat", k === vt); });
        }
        function datLai() {
            clearInterval(dem);
            dem = setInterval(function () { if (!tamDung && !document.hidden) hien(vt + 1); }, 5000);
        }
        slider.addEventListener("mouseenter", function () { tamDung = true; });
        slider.addEventListener("mouseleave", function () { tamDung = false; });
        hien(0); datLai();
    }

    // ----- 2. Đếm ngược tới ngày hội -----
    const suKien = document.getElementById("ttSuKien");
    if (suKien) {
        const dich = new Date(suKien.dataset.ngay).getTime();
        const hai = function (n) { return String(n).padStart(2, "0"); };
        function capNhat() {
            let con = Math.max(0, dich - Date.now());
            const ngay = Math.floor(con / 86400000); con %= 86400000;
            const gio = Math.floor(con / 3600000);   con %= 3600000;
            const phut = Math.floor(con / 60000);
            const giay = Math.floor((con % 60000) / 1000);
            document.getElementById("dNgay").textContent = hai(ngay);
            document.getElementById("dGio").textContent = hai(gio);
            document.getElementById("dPhut").textContent = hai(phut);
            document.getElementById("dGiay").textContent = hai(giay);
        }
        capNhat();
        setInterval(capNhat, 1000);
    }

    // ----- 3. Số liệu đếm từ 0 lên -----
    function demSo(el) {
        const dich = parseInt(el.dataset.dich, 10) || 0;
        const batDau = performance.now(), thoiGian = 1400;
        function buoc(t) {
            const p = Math.min(1, (t - batDau) / thoiGian);
            el.textContent = Math.round(dich * (1 - Math.pow(1 - p, 3)));
            if (p < 1) requestAnimationFrame(buoc);
        }
        requestAnimationFrame(buoc);
    }

    // ----- 4. Hiện dần khi cuộn tới -----
    const cacAn = document.querySelectorAll("#tinTuc .tt-an");
    function hienTatCa() {
        cacAn.forEach(function (el) { el.classList.add("hien"); });
        document.querySelectorAll("#tinTuc .tt-so b").forEach(function (b) { b.textContent = b.dataset.dich; });
    }
    if (!("IntersectionObserver" in window)) { hienTatCa(); return; }
    const quanSat = new IntersectionObserver(function (ds) {
        ds.forEach(function (d) {
            if (!d.isIntersecting) return;
            d.target.classList.add("hien");
            d.target.querySelectorAll("b[data-dich]").forEach(demSo);
            quanSat.unobserve(d.target);
        });
    }, { threshold: 0.15 });
    cacAn.forEach(function (el, i) {
        el.style.transitionDelay = (i % 4) * 0.08 + "s";   // hiện lần lượt
        quanSat.observe(el);
    });
})();
