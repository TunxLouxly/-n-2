/* =========================================================
   DuLieuYeuCau.js - Dữ liệu và trạng thái của yêu cầu nhận nuôi
   Mỗi yêu cầu lưu trong localStorage (khóa "tunxpet_yeucau")
   ========================================================= */
(function () {

    const KHOA_YEU_CAU = "tunxpet_yeucau";

    // Các trạng thái: Đã gửi yêu cầu › Đang xem xét › Đã duyệt yêu cầu (hoặc Chưa được duyệt)
    const TRANG_THAI = {
        guidi:   "Đã gửi yêu cầu",
        xemxet:  "Đang xem xét",
        daduyet: "Đã duyệt yêu cầu",
        tuchoi:  "Chưa được duyệt"
    };
    const CAC_BUOC = ["guidi", "xemxet", "daduyet"];     // 3 bước hiển thị trên thanh tiến trình

    // Đổi dữ liệu cũ (trạng thái "Chờ xử lý" của bản trước) về dạng mới
    function chuanHoa(y) {
        if (!TRANG_THAI[y.trangThai]) y.trangThai = "guidi";
        if (!y.lichSu) y.lichSu = [{ trangThai: y.trangThai, ngay: y.ngayGui }];
        return y;
    }

    function docTatCa() {
        try {
            return (JSON.parse(localStorage.getItem(KHOA_YEU_CAU)) || []).map(chuanHoa);
        } catch (e) {
            return [];
        }
    }
    function luuTatCa(ds) {
        localStorage.setItem(KHOA_YEU_CAU, JSON.stringify(ds));
    }

    // Thêm yêu cầu mới (luôn bắt đầu ở trạng thái "Đã gửi yêu cầu")
    function themMoi(y) {
        const ds = docTatCa();
        y.id = ds.reduce(function (max, t) { return Math.max(max, t.id); }, 0) + 1;
        y.ngayGui = new Date().toISOString();
        y.trangThai = "guidi";
        y.ghiChu = "";
        y.lichSu = [{ trangThai: "guidi", ngay: y.ngayGui }];
        ds.push(y);
        luuTatCa(ds);
        return y;
    }

    // Quản trị / nhân viên đổi trạng thái (dùng ở trang quản trị sau này)
    function doiTrangThai(id, trangThai, nguoiXuLy, ghiChu) {
        const ds = docTatCa();
        const y = ds.find(function (t) { return t.id === id; });
        if (!y || !TRANG_THAI[trangThai]) return false;
        y.trangThai = trangThai;
        y.ghiChu = ghiChu || "";
        y.nguoiXuLy = nguoiXuLy;
        y.lichSu.push({ trangThai: trangThai, ngay: new Date().toISOString(), nguoiXuLy: nguoiXuLy });
        luuTatCa(ds);
        return true;
    }

    function dinhDangNgay(iso) {
        return iso ? new Date(iso).toLocaleString("vi-VN") : "";
    }

    window.YeuCauDL = {
        TRANG_THAI: TRANG_THAI,
        CAC_BUOC: CAC_BUOC,
        docTatCa: docTatCa,
        themMoi: themMoi,
        doiTrangThai: doiTrangThai,
        dinhDangNgay: dinhDangNgay
    };

})();