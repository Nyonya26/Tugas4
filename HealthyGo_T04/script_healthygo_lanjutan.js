
 // ==========================================
 // HEALTHYGO - SCRIPT UTAMA
 // Timer uji coba 1 menit
 // Jadwal, statistik, dan target diperbarui
 // hanya setelah timer selesai.
 // ==========================================

let timerInterval = null;
let sisaDetik = 60;
let namaLatihanDipilih = "";
let totalKalori = 0;
let totalMenit = 0;
let totalLatihan = 0;
let toastTimeout = null;
let latihanMenunggu = null;
let riwayatLatihanHariIni = [];

// ==========================================
// HALAMAN HOME
// ==========================================
function masukDashboard() {
    document.getElementById("home").style.display = "none";
    document.getElementById("dashboard").style.display = "block";
    tampilToast("Selamat datang di HealthyGo! 💛");
}

function ubahJudul() {
    document.getElementById("judulHome").innerHTML =
        "Ayo Bergerak<br>Hidup Lebih Sehat!";
    tampilToast("Judul berhasil diubah!");
}

function ubahWarna() {
    document.querySelectorAll("button").forEach(function (tombol) {
        tombol.style.backgroundColor = "#ffffff";
        tombol.style.color = "#111111";
    });
    tampilToast("Warna tombol berhasil diubah!");
}

function tampilDeskripsi() {
    const info = document.getElementById("infoOlahraga");
    if (info) info.hidden = !info.hidden;
}

// ==========================================
// TIMER 1 MENIT
// ==========================================
function ambilDurasiMenit() {
    return 1; // Untuk sementara, timer selalu 1 menit
}

function tampilkanTimer() {
    const tampilan = document.getElementById("timerDisplay");
    if (!tampilan) return;

    const menit = Math.floor(sisaDetik / 60);
    const detik = sisaDetik % 60;

    tampilan.textContent =
        String(menit).padStart(2, "0") + ":" +
        String(detik).padStart(2, "0");
}

function mulaiTimerLatihan() {
    if (timerInterval !== null) return;

    if (sisaDetik <= 0) {
        sisaDetik = 60;
        tampilkanTimer();
    }

    const status = document.getElementById("timerStatus");

    if (status) {
        status.textContent = namaLatihanDipilih
            ? "Latihan " + namaLatihanDipilih + " sedang berlangsung! 💪"
            : "Timer sedang berjalan! 💪";
    }

    timerInterval = setInterval(function () {
        sisaDetik--;
        tampilkanTimer();

        if (sisaDetik <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            sisaDetik = 0;
            tampilkanTimer();

            if (status) {
                status.textContent =
                    "Latihan selesai! Bagus, kamu berhasil! 🎉";
            }

            // Catat aktivitas setelah timer benar-benar selesai
            selesaikanLatihan();

            tampilToast("Waktu latihan selesai! 🎉");
        }
    }, 1000);
}

function jedaTimerLatihan() {
    if (timerInterval !== null) {
        clearInterval(timerInterval);
        timerInterval = null;

        const status = document.getElementById("timerStatus");
        if (status) {
            status.textContent =
                "Timer dijeda. Tekan Mulai untuk melanjutkan.";
        }

        tampilToast("Timer dijeda.");
    }
}

function resetTimerLatihan() {
    if (timerInterval !== null) {
        clearInterval(timerInterval);
        timerInterval = null;
    }

    sisaDetik = 60;
    tampilkanTimer();

    const pilihan = document.getElementById("durasiTimer");
    if (pilihan) pilihan.value = "1";

    const status = document.getElementById("timerStatus");
    if (status) {
        status.textContent = namaLatihanDipilih
            ? "Timer siap untuk latihan " + namaLatihanDipilih + "."
            : "Timer siap selama 1 menit.";
    }
}

// ==========================================
// MEMILIH LATIHAN
// ==========================================
function latihan(nama, menit, kalori) {
    // Hentikan timer sebelumnya
    if (timerInterval !== null) {
        clearInterval(timerInterval);
        timerInterval = null;
    }

    namaLatihanDipilih = nama;

    // Simpan sementara, belum masuk statistik
    latihanMenunggu = {
        nama: nama,
        durasi: 1,
        kalori: kalori
    };

    sisaDetik = 60;

    const pilihan = document.getElementById("durasiTimer");
    if (pilihan) pilihan.value = "1";

    const namaAktif = document.getElementById("namaLatihanAktif");
    if (namaAktif) {
        namaAktif.textContent = "Latihan aktif: " + nama;
    }

    tampilkanTimer();
    mulaiTimerLatihan();

    tampilToast("Latihan " + nama + " dimulai!");
}

function tambahLatihanSendiri() {
    const input = document.getElementById("namaLatihan");
    if (!input) return;

    const nama = input.value.trim();

    if (nama === "") {
        tampilToast("Masukkan nama latihan terlebih dahulu!");
        input.focus();
        return;
    }

    latihan(nama, 1, 100);
    input.value = "";
}

// ==========================================
// CATAT LATIHAN YANG SUDAH SELESAI
// ==========================================
function selesaikanLatihan() {
    if (!latihanMenunggu) return;

    const selesai = latihanMenunggu;
    const sekarang = new Date();

    // Tambah statistik hanya saat timer habis
    totalKalori += selesai.kalori;
    totalMenit += selesai.durasi;
    totalLatihan++;

    perbaruiStatistik();

    // Tambahkan jadwal yang selesai
    const daftar = document.getElementById("scheduleList");

    if (daftar) {
        const kosong = daftar.querySelector(".jadwal-kosong");
        if (kosong) kosong.remove();

        const item = document.createElement("p");
        item.className = "jadwal-item";
        item.textContent =
            "✅ " + selesai.nama + " — " +
            selesai.durasi + " menit (Selesai)";

        daftar.appendChild(item);
    }

    // Catat riwayat latihan
    riwayatLatihanHariIni.push({
        nama: selesai.nama,
        durasi: selesai.durasi,
        kalori: selesai.kalori,
        waktu: sekarang.toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit"
        })
    });

    // Simpan riwayat ke browser
    simpanRiwayat();

    // Tampilkan catatan otomatis
    tampilkanCatatanOtomatis();

    // Kosongkan latihan yang sedang menunggu
    latihanMenunggu = null;
}

function simpanRiwayat() {
    try {
        localStorage.setItem(
            "healthyGoRiwayat",
            JSON.stringify(riwayatLatihanHariIni)
        );
    } catch (error) {
        console.log("Riwayat tidak dapat disimpan.");
    }
}

function tampilkanCatatanOtomatis() {
    let catatan = document.getElementById("catatanOtomatis");

    if (!catatan) {
        catatan = document.createElement("div");
        catatan.id = "catatanOtomatis";
        catatan.style.padding = "15px";
        catatan.style.marginTop = "12px";
        catatan.style.borderRadius = "10px";
        catatan.style.backgroundColor = "#fff9c4";

        const area = document.getElementById("catatanMinggu");

        if (area && area.parentElement) {
            area.parentElement.appendChild(catatan);
        } else {
            const daftar = document.getElementById("scheduleList");
            if (daftar && daftar.parentElement) {
                daftar.parentElement.appendChild(catatan);
            }
        }
    }

    catatan.textContent =
        "📝 Hari ini Sikri telah melakukan " +
        totalLatihan + " latihan selama " +
        totalMenit + " menit.";
}

// ==========================================
// STATISTIK DAN TARGET
// ==========================================
function perbaruiStatistik() {
    document.getElementById("calories").textContent = totalKalori;
    document.getElementById("minutes").textContent =
        totalMenit + " Menit";
    document.getElementById("sessions").textContent =
        totalLatihan + " Latihan";

    const persen = Math.min(
        100,
        Math.round((totalMenit / 60) * 100)
    );

    document.getElementById("targetText").textContent =
        persen + "% target olahraga selesai.";

    document.getElementById("targetBar").style.width = persen + "%";
}

// ==========================================
// CATATAN MINGGUAN
// ==========================================
function simpanCatatan() {
    const area = document.getElementById("catatanMinggu");
    if (!area) return;

    try {
        localStorage.setItem("healthyGoCatatanMinggu", area.value);

        const status = document.getElementById("statusCatatan");
        if (status) {
            status.textContent = "Catatan berhasil disimpan! 💛";
        }

        tampilToast("Catatan berhasil disimpan!");
    } catch (error) {
        const status = document.getElementById("statusCatatan");
        if (status) {
            status.textContent = "Catatan tidak dapat disimpan.";
        }
    }
}

function muatCatatan() {
    try {
        const catatan = localStorage.getItem("healthyGoCatatanMinggu");
        const area = document.getElementById("catatanMinggu");

        if (catatan !== null && area) {
            area.value = catatan;
        }
    } catch (error) {
        console.log("Catatan tidak dapat dimuat.");
    }
}

// ==========================================
// TIPS OLAHRAGA DENGAN PROMISE
// ==========================================
function ambilTipsOlahraga() {
    const hasil = document.getElementById("hasilTips");
    if (!hasil) return;

    hasil.textContent = "Sedang menyiapkan tips...";

    const tips = [
        "Lakukan pemanasan sebelum olahraga.",
        "Minum air putih agar tubuh tetap terhidrasi.",
        "Mulailah olahraga sesuai kemampuan tubuh.",
        "Istirahat yang cukup setelah berolahraga.",
        "Lakukan peregangan untuk membantu kelenturan."
    ];

    Promise.resolve(tips[Math.floor(Math.random() * tips.length)])
        .then(function (tip) {
            hasil.textContent = "💡 " + tip;
        });
}

// ==========================================
// TOAST / SNACKBAR
// ==========================================
function tampilToast(pesan) {
    const toast = document.getElementById("toast");
    const pesanToast = document.getElementById("toastPesan");

    if (!toast || !pesanToast) return;

    pesanToast.textContent = pesan;
    toast.classList.add("show");

    if (toastTimeout !== null) {
        clearTimeout(toastTimeout);
    }

    toastTimeout = setTimeout(function () {
        toast.classList.remove("show");
        toastTimeout = null;
    }, 3000);
}

// ==========================================
// RESET AKTIVITAS HARI INI
// ==========================================
function resetHari() {
    if (timerInterval !== null) {
        clearInterval(timerInterval);
        timerInterval = null;
    }

    totalKalori = 0;
    totalMenit = 0;
    totalLatihan = 0;
    namaLatihanDipilih = "";
    latihanMenunggu = null;
    riwayatLatihanHariIni = [];

    perbaruiStatistik();

    const daftar = document.getElementById("scheduleList");
    if (daftar) {
        daftar.innerHTML =
            '<p class="jadwal-kosong">Belum ada latihan hari ini.</p>';
    }

    const namaAktif = document.getElementById("namaLatihanAktif");
    if (namaAktif) {
        namaAktif.textContent = "Belum ada latihan dipilih.";
    }

    const catatan = document.getElementById("catatanOtomatis");
    if (catatan) catatan.remove();

    try {
        localStorage.removeItem("healthyGoRiwayat");
    } catch (error) {
        console.log("Riwayat tidak dapat dihapus.");
    }

    resetTimerLatihan();
    tampilToast("Aktivitas hari ini berhasil direset!");
}

// ==========================================
// HUBUNGKAN TOMBOL
// ==========================================
document.addEventListener("DOMContentLoaded", function () {
    const tombolTimer = document.getElementById("tombolTimer");
    const tombolJeda = document.getElementById("tombolJedaTimer");
    const tombolReset = document.getElementById("tombolResetTimer");
    const pilihanDurasi = document.getElementById("durasiTimer");
    const tombolTambah = document.getElementById("tambahLatihanBtn");
    const tombolCatatan = document.getElementById("simpanCatatanBtn");
    const tombolTips = document.getElementById("ambilTipsBtn");

    if (tombolTimer) {
        tombolTimer.addEventListener("click", mulaiTimerLatihan);
    }

    if (tombolJeda) {
        tombolJeda.addEventListener("click", jedaTimerLatihan);
    }

    if (tombolReset) {
        tombolReset.addEventListener("click", resetTimerLatihan);
    }

    if (pilihanDurasi) {
        pilihanDurasi.value = "1";
        pilihanDurasi.addEventListener("change", resetTimerLatihan);
    }

    if (tombolTambah) {
        tombolTambah.addEventListener("click", tambahLatihanSendiri);
    }

    if (tombolCatatan) {
        tombolCatatan.addEventListener("click", simpanCatatan);
    }

    if (tombolTips) {
        tombolTips.addEventListener("click", ambilTipsOlahraga);
    }

    // Muat catatan dan riwayat tersimpan
    muatCatatan();

    try {
        const data = localStorage.getItem("healthyGoRiwayat");

        if (data) {
            riwayatLatihanHariIni = JSON.parse(data);
        }
    } catch (error) {
        riwayatLatihanHariIni = [];
    }

    sisaDetik = 60;
    tampilkanTimer();
});
