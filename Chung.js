/* =========================================================
   Chung.js - JavaScript dùng chung cho các TRANG CON
   (trang chủ có JS riêng là TrangChu.js)
   1) Menu thả xuống "Danh mục thú cưng"
   2) Nút lên đầu trang
   3) Ô tìm kiếm: chuyển về trang chủ kèm từ khóa
   ========================================================= */

// ----- 1. Menu thả xuống "Danh mục thú cưng" -----
const nutDanhMuc   = document.getElementById("nutDanhMuc");
const menuDanhMuc  = document.getElementById("menuDanhMuc");
const khungDanhMuc = nutDanhMuc.parentElement;      // thẻ .danh-muc-wrap

nutDanhMuc.addEventListener("click", function (e) {
    e.stopPropagation();                            // tránh bị đóng ngay do sự kiện click ở document
    khungDanhMuc.classList.toggle("mo");
});
menuDanhMuc.addEventListener("click", function () {
    khungDanhMuc.classList.remove("mo");
});
document.addEventListener("click", function (e) {
    if (!khungDanhMuc.contains(e.target)) khungDanhMuc.classList.remove("mo");
});
document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") khungDanhMuc.classList.remove("mo");
});

// ----- 2. Nút lên đầu trang -----
const nutLenDau = document.getElementById("nutLenDau");

window.addEventListener("scroll", function () {
    nutLenDau.style.display = window.scrollY > 300 ? "block" : "none";
});
nutLenDau.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

// ----- 3. Tìm kiếm: sang trang chủ và tìm theo từ khóa -----
const formTimKiem = document.getElementById("formTimKiem");
const oTimKiem    = document.getElementById("oTimKiem");

formTimKiem.addEventListener("submit", function (e) {
    e.preventDefault();
    const tuKhoa = oTimKiem.value.trim();
    window.location.href = "TrangChu.html?q=" + encodeURIComponent(tuKhoa);
});