/* =========================================================
   QuanTriDanhGia.js - Xem và xóa đánh giá không phù hợp
   ========================================================= */
(function () {

    if (!window.QT) return;
    const KHOA = "tunxpet_danhgia";
    const thoat = QT.thoat;
    const muc = document.getElementById("muc-danhgia");

    function doc() { try { return JSON.parse(localStorage.getItem(KHOA)) || []; } catch (e) { return []; } }

    function ve() {
        const ds = doc().sort(function (a, b) { return b.id - a.id; });
        muc.innerHTML = '<h1>Đánh giá của người nhận nuôi</h1>' +
            (ds.length === 0 ? '<p class="qt-trong">Chưa có đánh giá nào.</p>' :
            '<div class="qt-cuon"><table class="qt-bang"><thead><tr><th>Bé</th><th>Người đánh giá</th><th>Sao</th><th>Nội dung</th><th>Ngày</th><th></th></tr></thead><tbody>' +
            ds.map(function (d) {
                return '<tr><td>' + thoat(QT.tenBe(d.thuCungId)) + '</td><td>' + thoat(d.hoTen) + '</td>' +
                    '<td class="qt-sao">' + "★".repeat(d.sao || 0) + '</td><td class="qt-noi-dung">' + thoat(d.noiDung) +
                    (d.traLoi && d.traLoi.length ? '<br><small>(' + d.traLoi.length + ' phản hồi)</small>' : '') + '</td>' +
                    '<td>' + QT.ngay(d.ngay) + '</td>' +
                    '<td><button type="button" class="qt-nut nho do" data-xoa="' + d.id + '">Xóa</button></td></tr>';
            }).join("") + '</tbody></table></div>');
    }
    QT.dangKy("danhgia", ve);

    muc.addEventListener("click", function (e) {
        const b = e.target.closest("[data-xoa]");
        if (!b) return;
        const id = parseInt(b.dataset.xoa, 10);
        QT.xacNhan("Xóa đánh giá này? Người viết sẽ được viết lại đánh giá mới.", function () {
            localStorage.setItem(KHOA, JSON.stringify(doc().filter(function (d) { return d.id !== id; })));
            ve(); XacThuc.hienToast("Đã xóa đánh giá.");
        }, "Xóa");
    });

})();