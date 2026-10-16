/* =========================================================
   TrangChu.js - Xử lý tương tác trang chủ TunxPet
   1) Dữ liệu thú cưng (mẫu)
   2) Hiển thị thú cưng vào từng khối (Chó / Mèo / Khác)
   3) Chuyển tab lọc trong từng khối
   4) Tìm kiếm theo tên
   5) Nút lên đầu trang
   ========================================================= */

// ----- 1. Dữ liệu mẫu (sau này sẽ lấy từ SQL Server) -----
// loai    : "Chó" | "Mèo" | "Khác"   (khớp với data-loai của từng khối trong HTML)
// nhom    : "Con" (dưới 1 tuổi) | "Lớn" (trưởng thành)
// anh     : để trống thì hiện emoji; có ảnh thật thì ghi đường dẫn, ví dụ "images/mit.jpg"
const danhSachThuCung = [
    // ----- Chó -----
    { id: 1,  ten: "Mít",     loai: "Chó", tuoi: "6 tháng", nhom: "Con", gioiTinh: "Đực", icon: "🐶", anh: "" },
    { id: 2,  ten: "Lu",      loai: "Chó", tuoi: "1 tuổi",  nhom: "Lớn", gioiTinh: "Cái", icon: "🐕", anh: "" },
    { id: 3,  ten: "Bông",    loai: "Chó", tuoi: "3 tháng", nhom: "Con", gioiTinh: "Cái", icon: "🐩", anh: "" },
    { id: 4,  ten: "Vàng",    loai: "Chó", tuoi: "2 tuổi",  nhom: "Lớn", gioiTinh: "Đực", icon: "🦮", anh: "" },
    { id: 5,  ten: "Bin",     loai: "Chó", tuoi: "4 tháng", nhom: "Con", gioiTinh: "Đực", icon: "🐕‍🦺", anh: "" },
    { id: 6,  ten: "Sóc",     loai: "Chó", tuoi: "3 tuổi",  nhom: "Lớn", gioiTinh: "Cái", icon: "🐶", anh: "" },
    { id: 7,  ten: "Nâu",     loai: "Chó", tuoi: "5 tháng", nhom: "Con", gioiTinh: "Đực", icon: "🐕", anh: "" },
    { id: 8,  ten: "Đốm",     loai: "Chó", tuoi: "2 tuổi",  nhom: "Lớn", gioiTinh: "Cái", icon: "🦮", anh: "" },
    { id: 9,  ten: "Mực",     loai: "Chó", tuoi: "8 tháng", nhom: "Con", gioiTinh: "Đực", icon: "🐩", anh: "" },
    { id: 10, ten: "Lạc",     loai: "Chó", tuoi: "4 tuổi",  nhom: "Lớn", gioiTinh: "Đực", icon: "🐕‍🦺", anh: "" },

    // ----- Mèo -----
    { id: 11, ten: "Mun",      loai: "Mèo", tuoi: "4 tháng", nhom: "Con", gioiTinh: "Đực", icon: "🐱", anh: "" },
    { id: 12, ten: "Kem",      loai: "Mèo", tuoi: "8 tháng", nhom: "Con", gioiTinh: "Cái", icon: "😺", anh: "" },
    { id: 13, ten: "Tam Thể",  loai: "Mèo", tuoi: "1 tuổi",  nhom: "Lớn", gioiTinh: "Cái", icon: "🐈", anh: "" },
    { id: 14, ten: "Xám",      loai: "Mèo", tuoi: "2 tháng", nhom: "Con", gioiTinh: "Đực", icon: "🐈‍⬛", anh: "" },
    { id: 15, ten: "Mướp",     loai: "Mèo", tuoi: "2 tuổi",  nhom: "Lớn", gioiTinh: "Đực", icon: "😸", anh: "" },
    { id: 16, ten: "Bơ",       loai: "Mèo", tuoi: "5 tháng", nhom: "Con", gioiTinh: "Cái", icon: "😻", anh: "" },
    { id: 17, ten: "Cam",      loai: "Mèo", tuoi: "3 tuổi",  nhom: "Lớn", gioiTinh: "Đực", icon: "🐱", anh: "" },
    { id: 18, ten: "Sữa",      loai: "Mèo", tuoi: "6 tháng", nhom: "Con", gioiTinh: "Cái", icon: "😺", anh: "" },
    { id: 19, ten: "Lông Dài", loai: "Mèo", tuoi: "2 tuổi",  nhom: "Lớn", gioiTinh: "Cái", icon: "🐈", anh: "" },
    { id: 20, ten: "Mây",      loai: "Mèo", tuoi: "1 tuổi",  nhom: "Lớn", gioiTinh: "Đực", icon: "🐈‍⬛", anh: "" },

    // ----- Thú cưng khác -----
    { id: 21, ten: "Thỏ Bông",    loai: "Khác", tuoi: "5 tháng", nhom: "Con", gioiTinh: "Cái", icon: "🐰", anh: "" },
    { id: 22, ten: "Hamster Nâu", loai: "Khác", tuoi: "3 tháng", nhom: "Con", gioiTinh: "Đực", icon: "🐹", anh: "" },
    { id: 23, ten: "Thỏ Xám",     loai: "Khác", tuoi: "2 tuổi",  nhom: "Lớn", gioiTinh: "Đực", icon: "🐇", anh: "" }
];

// ----- 2. Lấy các phần tử trên trang -----
const dsKhoi      = document.querySelectorAll(".khoi-thu-cung");   // cả 3 khối (Chó, Mèo, Khác)
const formTimKiem = document.getElementById("formTimKiem");
const oTimKiem    = document.getElementById("oTimKiem");
const nutLenDau   = document.getElementById("nutLenDau");

let tuKhoa = "";   // từ khóa tìm kiếm hiện tại (dùng chung cho cả 3 khối)

// ----- 3. Lọc thú cưng của 1 khối theo tab (loc) và từ khóa -----
function locThuCung(loai, loc) {
    const ketQua = danhSachThuCung.filter(function (tc) {
        if (tc.loai !== loai) return false;                                   // khác loại của khối -> bỏ
        if (!tc.ten.toLowerCase().includes(tuKhoa.toLowerCase())) return false; // không khớp từ khóa -> bỏ

        if (loc === "con") return tc.nhom === "Con";
        if (loc === "lon") return tc.nhom === "Lớn";
        if (loc === "duc") return tc.gioiTinh === "Đực";
        if (loc === "cai") return tc.gioiTinh === "Cái";
        return true;                                                          // "tatca"
    });

    // Tab "Mới nhất": bé nào có id lớn hơn (thêm sau) thì xếp trước
    if (loc === "tatca") {
        ketQua.sort(function (a, b) { return b.id - a.id; });
    }
    return ketQua;
}

// ----- 4. Vẽ các thẻ thú cưng vào 1 khối -----
function veKhoi(khoi) {
    const loai = khoi.dataset.loai;                                    // đọc data-loai trong HTML
    const tab  = khoi.querySelector(".tab.active");                    // tab đang được chọn
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
            ? '<img src="' + tc.anh + '" alt="' + tc.ten + '">'
            : tc.icon;

        html += `
            <div class="the-thu-cung">
                <div class="anh-thu-cung">${noiDungAnh}</div>
                <h3 class="ten-thu-cung">${tc.ten}</h3>
                <p class="thong-tin">${tc.tuoi} · ${tc.gioiTinh}</p>
                <a href="#" class="btn-chi-tiet">Xem chi tiết</a>
            </div>`;
    });
    luoi.innerHTML = html;
}

// ----- 5. Bấm vào tab trong từng khối -----
dsKhoi.forEach(function (khoi) {
    khoi.querySelector(".tabs").addEventListener("click", function (e) {
        const tab = e.target.closest(".tab");
        if (!tab) return;                                              // bấm ra ngoài tab thì bỏ qua

        // Chỉ bỏ "active" của các tab TRONG KHỐI NÀY
        khoi.querySelectorAll(".tab").forEach(function (t) {
            t.classList.remove("active");
        });
        tab.classList.add("active");

        veKhoi(khoi);
    });
});

// ----- 6. Tìm kiếm -----
formTimKiem.addEventListener("submit", function (e) {
    e.preventDefault();                                                // chặn trang tải lại
    tuKhoa = oTimKiem.value.trim();

    dsKhoi.forEach(veKhoi);                                            // vẽ lại cả 3 khối

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

// ----- 8. Chạy lần đầu khi mở trang -----
dsKhoi.forEach(veKhoi);


/* =========================================================
   PHẦN DƯỚI TRANG CHỦ
   A) Câu chuyện nhận nuôi (chia trang, bấm chấm để chuyển)
   B) Kiến thức chăm sóc (bấm bài bên phải -> bài lớn đổi theo)
   ========================================================= */

// ----- A. Câu chuyện nhận nuôi -----
const danhSachCauChuyen = [
    { ten: "Chị Lan",    icon: "🐶", noiDung: "Mình nhận bé Mít về được 2 tháng, bé rất ngoan và quấn người. Cảm ơn TunxPet đã hướng dẫn mình cách chăm sóc bé từ những ngày đầu." },
    { ten: "Anh Đức",    icon: "🐱", noiDung: "Thủ tục nhận nuôi rõ ràng, nhân viên liên hệ và hỏi kỹ điều kiện nhà mình. Bé mèo đã tiêm phòng đầy đủ nên mình rất yên tâm." },
    { ten: "Bạn Minh",   icon: "🐕", noiDung: "Mình là sinh viên nên ban đầu hơi lo, nhưng TunxPet tư vấn rất nhiệt tình. Giờ bé Vàng là thành viên không thể thiếu trong phòng trọ." },
    { ten: "Cô Hà",      icon: "🐈", noiDung: "Nhà chỉ có hai vợ chồng già, nhận một bé mèo lớn tuổi về nuôi cho vui cửa vui nhà. Bé hiền lắm, cảm ơn các bạn tình nguyện viên." },
    { ten: "Anh Tuấn",   icon: "🐩", noiDung: "Mình theo dõi được trạng thái yêu cầu ngay trên website nên không phải hỏi đi hỏi lại. Rất tiện và minh bạch." },
    { ten: "Chị Thu",    icon: "😺", noiDung: "Con gái mình mê mèo từ lâu. Sau khi nhận bé Kem, cháu có trách nhiệm hơn hẳn, tự giờ cho bé ăn mỗi ngày." },
    { ten: "Bạn Hoàng",  icon: "🐰", noiDung: "Mình nhận bé thỏ về làm bạn cho con trai. Website có đủ ảnh và thông tin của bé nên mình chọn rất nhanh." },
    { ten: "Chị Mai",    icon: "🦮", noiDung: "Nhận nuôi thay vì mua là quyết định mình thấy ý nghĩa nhất. Chúc TunxPet tìm được nhiều mái ấm hơn nữa." }
];

const SO_CAU_CHUYEN_MOI_TRANG = 4;     // mỗi trang hiện 4 thẻ
const luoiCauChuyen = document.getElementById("luoiCauChuyen");
const chamTrang     = document.getElementById("chamTrang");

function veCauChuyen(trang) {
    const batDau = trang * SO_CAU_CHUYEN_MOI_TRANG;
    const cacThe = danhSachCauChuyen.slice(batDau, batDau + SO_CAU_CHUYEN_MOI_TRANG);

    let html = "";
    cacThe.forEach(function (cc) {
        html += `
            <div class="the-cau-chuyen">
                <div class="cc-anh">${cc.icon}</div>
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

// Tạo các chấm (số chấm = số trang)
const soTrang = Math.ceil(danhSachCauChuyen.length / SO_CAU_CHUYEN_MOI_TRANG);
for (let i = 0; i < soTrang; i++) {
    const cham = document.createElement("button");
    cham.className = "cham";
    cham.title = "Trang " + (i + 1);
    cham.addEventListener("click", function () { veCauChuyen(i); });
    chamTrang.appendChild(cham);
}
veCauChuyen(0);

// ----- B. Kiến thức chăm sóc thú cưng -----
const danhSachKienThuc = [
    { tieu_de: "Những điều cần biết trước khi nhận nuôi thú cưng", icon: "📋",
      mo_ta: "Nhận nuôi là cam kết lâu dài. Hãy cân nhắc thời gian, chi phí, không gian sống và sự đồng thuận của cả gia đình trước khi đón một bé về nhà." },
    { tieu_de: "Cách làm quen với thú cưng mới trong tuần đầu", icon: "🏠",
      mo_ta: "Hãy cho bé một góc riêng yên tĩnh, không ép bé tiếp xúc quá nhiều. Kiên nhẫn cho bé thời gian để làm quen với mùi hương và âm thanh trong nhà." },
    { tieu_de: "Chế độ ăn phù hợp cho chó con và mèo con", icon: "🍖",
      mo_ta: "Bé nhỏ cần ăn chia nhiều bữa với thức ăn phù hợp độ tuổi. Luôn có nước sạch và tránh các thực phẩm độc hại như sô-cô-la, hành, tỏi." },
    { tieu_de: "Lịch tiêm phòng và tẩy giun định kỳ", icon: "💉",
      mo_ta: "Tiêm phòng đầy đủ giúp bé tránh các bệnh nguy hiểm. Hãy lưu sổ tiêm và tái khám theo hẹn của bác sĩ thú y." },
    { tieu_de: "Dấu hiệu cho thấy thú cưng đang không khỏe", icon: "🩺",
      mo_ta: "Bỏ ăn, ủ rũ, nôn mửa hoặc tiêu chảy kéo dài là những dấu hiệu cần đưa bé đi khám sớm thay vì tự điều trị tại nhà." }
];

const ktLon = document.getElementById("ktLon");
const ktDs  = document.getElementById("ktDs");

// Hiện bài số "chiSo" ở khung lớn và tô viền bài đó ở danh sách
function hienBaiKienThuc(chiSo) {
    const bai = danhSachKienThuc[chiSo];
    ktLon.innerHTML = `
        <div class="kt-anh">${bai.icon}</div>
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
   MENU THẢ XUỐNG "DANH MỤC THÚ CƯNG"
   - Bấm nút: mở / đóng
   - Bấm vào một mục, bấm ra ngoài, hoặc nhấn phím Esc: đóng
   ========================================================= */
const nutDanhMuc  = document.getElementById("nutDanhMuc");
const menuDanhMuc = document.getElementById("menuDanhMuc");
const khungDanhMuc = nutDanhMuc.parentElement;      // thẻ .danh-muc-wrap

nutDanhMuc.addEventListener("click", function (e) {
    e.stopPropagation();                            // không cho sự kiện lan ra document (tránh bị đóng ngay)
    khungDanhMuc.classList.toggle("mo");            // có "mo" thì bỏ, chưa có thì thêm
});

// Bấm vào một mục trong menu -> đóng menu (trang tự cuộn tới khối nhờ href="#cho"...)
menuDanhMuc.addEventListener("click", function () {
    khungDanhMuc.classList.remove("mo");
});

// Bấm ra ngoài vùng menu -> đóng
document.addEventListener("click", function (e) {
    if (!khungDanhMuc.contains(e.target)) {
        khungDanhMuc.classList.remove("mo");
    }
});

// Nhấn Esc -> đóng
document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") khungDanhMuc.classList.remove("mo");
});
// ----- 7b. Nếu được chuyển từ trang khác sang kèm từ khóa (TrangChu.html?q=...) thì tìm luôn -----
const tuKhoaTuUrl = new URLSearchParams(window.location.search).get("q");
if (tuKhoaTuUrl) {
    tuKhoa = tuKhoaTuUrl.trim();
    oTimKiem.value = tuKhoa;
}
// ----- 8. Chạy lần đầu khi mở trang -----
dsKhoi.forEach(veKhoi);