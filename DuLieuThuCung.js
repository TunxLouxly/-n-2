/* =========================================================
   DuLieuThuCung.js - Dữ liệu thú cưng (mẫu) dùng chung cho
   trang chủ (TrangChu.js) và trang chi tiết (ChiTiet.js).
   Sau này sẽ thay bằng dữ liệu lấy từ SQL Server.
   ---------------------------------------------------------
   Trường BẮT BUỘC (trang chủ dùng):
     id, ten, loai ("Chó" | "Mèo" | "Khác"), tuoi, nhom ("Con" | "Lớn"),
     gioiTinh ("Đực" | "Cái"), icon (emoji hiện khi chưa có ảnh), anh
   Trường THÊM (trang chi tiết dùng, bé nào chưa có sẽ hiện "Đang cập nhật"):
     giong, canNang, mauLong, tiemPhong, trietSan, tinhCach (mảng),
     suKhoa, cauChuyen, yeuCau (mảng), viTri, ngayTiepNhan,
     anhPhu (mảng ảnh cho khung xem ảnh)
   Ảnh thật: để file trong thư mục images/thucung/ rồi ghi đường dẫn.
   ========================================================= */
const danhSachThuCung = [
    // ----- Chó -----
    { id: 1, ten: "Mít", loai: "Chó", tuoi: "6 tháng", nhom: "Con", gioiTinh: "Đực", icon: "🐶",
      anh: "images/thucung/cho-mit-1.jpg",
      anhPhu: ["images/thucung/cho-mit-1.jpg", "images/thucung/cho-mit-2.jpg", "images/thucung/cho-mit-3.jpg"],
      giong: "Chó ta (lai)", canNang: "6 kg", mauLong: "Vàng nâu",
      tiemPhong: "Đã tiêm mũi 1, cần tiêm nhắc lại sau 3 tuần",
      trietSan: "Chưa (bé còn nhỏ)",
      tinhCach: ["Hiếu động", "Thân thiện", "Thích chơi bóng", "Rất quấn người"],
      suKhoa: "Khỏe mạnh, ăn uống tốt, đã tẩy giun định kỳ. Không có bệnh truyền nhiễm.",
      cauChuyen: "Mít được tình nguyện viên nhặt được ở ven đường khi mới vài tuần tuổi, người lấm lem và rất đói. Sau vài tháng được TunxPet chăm sóc, Mít đã tăng cân, khỏe mạnh và tinh nghịch hẳn lên. Bé thích chạy nhảy và luôn vẫy đuôi đón bất kỳ ai đến gần.",
      yeuCau: ["Từ 18 tuổi trở lên, có thu nhập ổn định", "Có không gian sống cho bé vận động", "Cam kết tiêm phòng đầy đủ cho bé", "Đồng ý cho TunxPet hỏi thăm bé định kỳ"],
      viTri: "Hưng Yên", ngayTiepNhan: "2026-08-10" },
    { id: 2,  ten: "Lu",   loai: "Chó", tuoi: "1 tuổi",  nhom: "Lớn", gioiTinh: "Cái", icon: "🐕",    anh: "" },
    { id: 3,  ten: "Bông", loai: "Chó", tuoi: "3 tháng", nhom: "Con", gioiTinh: "Cái", icon: "🐩",    anh: "" },
    { id: 4,  ten: "Vàng", loai: "Chó", tuoi: "2 tuổi",  nhom: "Lớn", gioiTinh: "Đực", icon: "🦮",    anh: "" },
    { id: 5,  ten: "Bin",  loai: "Chó", tuoi: "4 tháng", nhom: "Con", gioiTinh: "Đực", icon: "🐕‍🦺", anh: "" },
    { id: 6,  ten: "Sóc",  loai: "Chó", tuoi: "3 tuổi",  nhom: "Lớn", gioiTinh: "Cái", icon: "🐶",    anh: "" },
    { id: 7,  ten: "Nâu",  loai: "Chó", tuoi: "5 tháng", nhom: "Con", gioiTinh: "Đực", icon: "🐕",    anh: "" },
    { id: 8,  ten: "Đốm",  loai: "Chó", tuoi: "2 tuổi",  nhom: "Lớn", gioiTinh: "Cái", icon: "🦮",    anh: "" },
    { id: 9,  ten: "Mực",  loai: "Chó", tuoi: "8 tháng", nhom: "Con", gioiTinh: "Đực", icon: "🐩",    anh: "" },
        { id: 10, ten: "Trọng Ngao", loai: "Chó", tuoi: "20 tuổi", nhom: "Lớn", gioiTinh: "Cái", icon: "🐕‍🦺",
      anh: "ẢNH/cho-trongngao-1.jpg",
      canNang: "40 kg", mauLong: "Đen óng",
      tiemPhong: "Chưa tiêm phòng",
      trietSan: "Đã triệt sản",
      viTri: "Hải Dương", ngayTiepNhan: "2006-01-18" },

    // ----- Mèo -----
    { id: 11, ten: "Mun", loai: "Mèo", tuoi: "4 tháng", nhom: "Con", gioiTinh: "Đực", icon: "🐱",
      anh: "images/thucung/meo-mun-1.jpg",
      anhPhu: ["images/thucung/meo-mun-1.jpg", "images/thucung/meo-mun-2.jpg", "images/thucung/meo-mun-3.jpg"],
      giong: "Mèo ta", canNang: "1,8 kg", mauLong: "Đen tuyền",
      tiemPhong: "Đã tiêm mũi 1",
      trietSan: "Chưa (bé còn nhỏ)",
      tinhCach: ["Nhút nhát lúc đầu", "Hiền", "Thích nằm sưởi nắng", "Biết dùng khay vệ sinh"],
      suKhoa: "Khỏe mạnh, đã tẩy giun và xịt phòng ve rận. Mắt và tai sạch.",
      cauChuyen: "Mun được tìm thấy cùng mẹ và các anh chị em dưới gầm một quán cà phê. Khi mẹ mèo rời đi, Mun là bé duy nhất còn ở lại. Lúc đầu bé hơi sợ người, nhưng chỉ sau vài ngày được vuốt ve, Mun đã biết kêu gừ gừ và đòi bế.",
      yeuCau: ["Từ 18 tuổi trở lên", "Cam kết nuôi trong nhà, không thả rông", "Chuẩn bị khay vệ sinh và thức ăn phù hợp cho mèo con", "Đồng ý cho TunxPet hỏi thăm bé định kỳ"],
      viTri: "Hưng Yên", ngayTiepNhan: "2026-09-02" },
    { id: 12, ten: "Kem",      loai: "Mèo", tuoi: "8 tháng", nhom: "Con", gioiTinh: "Cái", icon: "😺",    anh: "" },
    { id: 13, ten: "Tam Thể",  loai: "Mèo", tuoi: "1 tuổi",  nhom: "Lớn", gioiTinh: "Cái", icon: "🐈",    anh: "" },
    { id: 14, ten: "Xám",      loai: "Mèo", tuoi: "2 tháng", nhom: "Con", gioiTinh: "Đực", icon: "🐈‍⬛", anh: "" },
    { id: 15, ten: "Mướp",     loai: "Mèo", tuoi: "2 tuổi",  nhom: "Lớn", gioiTinh: "Đực", icon: "😸",    anh: "" },
    { id: 16, ten: "Bơ",       loai: "Mèo", tuoi: "5 tháng", nhom: "Con", gioiTinh: "Cái", icon: "😻",    anh: "" },
    { id: 17, ten: "Cam",      loai: "Mèo", tuoi: "3 tuổi",  nhom: "Lớn", gioiTinh: "Đực", icon: "🐱",    anh: "" },
    { id: 18, ten: "Sữa",      loai: "Mèo", tuoi: "6 tháng", nhom: "Con", gioiTinh: "Cái", icon: "😺",    anh: "" },
    { id: 19, ten: "Lông Dài", loai: "Mèo", tuoi: "2 tuổi",  nhom: "Lớn", gioiTinh: "Cái", icon: "🐈",    anh: "" },
        { id: 20, ten: "Alexander Tuấn Bu", loai: "Mèo", tuoi: "2 tuổi", nhom: "Lớn", gioiTinh: "Đực", icon: "🐈",
      anh: "ẢNH/meo-alexander-1.jpg",
      canNang: "6 kg", mauLong: "Xám khói",
      tiemPhong: "Đã tiêm phòng",
      trietSan: "Đã triệt sản",
      viTri: "Hà Nội", ngayTiepNhan: "2026-10-17" },

    // ----- Thú cưng khác -----
    { id: 21, ten: "Thỏ Bông", loai: "Khác", tuoi: "5 tháng", nhom: "Con", gioiTinh: "Cái", icon: "🐰",
      anh: "images/thucung/tho-bong-1.jpg",
      anhPhu: ["images/thucung/tho-bong-1.jpg", "images/thucung/tho-bong-2.jpg", "images/thucung/tho-bong-3.jpg"],
      giong: "Thỏ cảnh", canNang: "1,2 kg", mauLong: "Trắng, tai hơi xám",
      tiemPhong: "Đã tẩy giun, chưa tiêm phòng",
      trietSan: "Chưa",
      tinhCach: ["Hiền lành", "Thích ăn cà rốt", "Hay nhảy tung tăng", "Ưa yên tĩnh"],
      suKhoa: "Khỏe mạnh, răng và móng bình thường, ăn cỏ khô và rau tốt.",
      cauChuyen: "Thỏ Bông được chủ cũ gửi lại vì gia đình chuyển nhà không thể mang theo. Bé quen với việc sống trong chuồng rộng, thích được thả ra chạy nhảy mỗi chiều và rất hiền khi được bế đúng cách.",
      yeuCau: ["Từ 18 tuổi trở lên", "Có chuồng rộng và chỗ cho bé chạy nhảy", "Hiểu cách chăm thỏ: cỏ khô, rau tươi, nước sạch", "Đồng ý cho TunxPet hỏi thăm bé định kỳ"],
      viTri: "Hưng Yên", ngayTiepNhan: "2026-09-15" },
    { id: 22, ten: "Hamster Nâu", loai: "Khác", tuoi: "3 tháng", nhom: "Con", gioiTinh: "Đực", icon: "🐹", anh: "" },
    { id: 23, ten: "Thỏ Xám",     loai: "Khác", tuoi: "2 tuổi",  nhom: "Lớn", gioiTinh: "Đực", icon: "🐇", anh: "" }
];