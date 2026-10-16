/* =========================================================
   LienHe.js - Xử lý riêng cho trang Liên hệ tư vấn
   1) Hiển thị "Đang mở cửa / Đã đóng cửa" theo giờ hiện tại
   2) Kiểm tra dữ liệu form liên hệ và báo lỗi
   (menu thả xuống, nút lên đầu trang... nằm trong Chung.js)
   ========================================================= */

// ----- 1. Giờ làm việc -----
const GIO_MO  = 8;     // mở cửa lúc 8:00  (muốn đổi giờ thì sửa 2 số này)
const GIO_DONG = 20;   // đóng cửa lúc 20:00

const trangThaiMoCua = document.getElementById("trangThaiMoCua");
const gioDong        = document.getElementById("gioDong");

const gioHienTai = new Date().getHours();               // giờ hiện tại của máy (0 - 23)
if (gioHienTai >= GIO_MO && gioHienTai < GIO_DONG) {
    trangThaiMoCua.textContent = "Đang mở cửa";
    trangThaiMoCua.className = "dang-mo";
    gioDong.textContent = "Đóng cửa lúc " + GIO_DONG + ":00";
} else {
    trangThaiMoCua.textContent = "Đã đóng cửa";
    trangThaiMoCua.className = "da-dong";
    gioDong.textContent = "Mở cửa lúc 0" + GIO_MO + ":00";
}

// ----- 2. Form liên hệ -----
const formLienHe  = document.getElementById("formLienHe");
const thongBao    = document.getElementById("thongBao");

// Hiện lỗi cho 1 ô; nếu thongDiep rỗng thì xóa lỗi. Trả về true nếu ô hợp lệ.
function datLoi(idO, idLoi, thongDiep) {
    const o = document.getElementById(idO);
    document.getElementById(idLoi).textContent = thongDiep;
    o.classList.toggle("co-loi", thongDiep !== "");
    return thongDiep === "";
}

formLienHe.addEventListener("submit", function (e) {
    e.preventDefault();                                   // chặn trang tải lại
    thongBao.textContent = "";

    const hoTen = document.getElementById("hoTen").value.trim();
    const sdt   = document.getElementById("soDienThoai").value.trim();
    const email = document.getElementById("email").value.trim();
    const noiDung = document.getElementById("noiDung").value.trim();

    // Kiểm tra từng ô (mỗi ô báo 1 lỗi)
    const hopLe = [
        datLoi("hoTen", "loiHoTen",
            hoTen === "" ? "Vui lòng nhập họ và tên." : ""),

        datLoi("soDienThoai", "loiSoDienThoai",
            !/^0\d{9}$/.test(sdt) ? "Số điện thoại gồm 10 chữ số và bắt đầu bằng số 0." : ""),

        datLoi("email", "loiEmail",
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "Email chưa đúng định dạng (ví dụ: ten@email.com)." : ""),

        datLoi("noiDung", "loiNoiDung",
            noiDung.length < 10 ? "Nội dung cần có ít nhất 10 ký tự." : "")
    ].every(Boolean);                                     // tất cả đều true thì mới gửi

    if (!hopLe) return;

    // Tạm thời chỉ hiện thông báo. Sau này sẽ gửi dữ liệu này lên SQL Server.
    thongBao.textContent = "Cảm ơn " + hoTen + "! TunxPet đã nhận được liên hệ của bạn và sẽ phản hồi sớm.";
    formLienHe.reset();
});