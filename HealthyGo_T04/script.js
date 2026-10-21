
/* =================================
   HEALTHYGO
================================= */

const namaHari = [
    "Minggu", "Senin", "Selasa", "Rabu",
    "Kamis", "Jumat", "Sabtu"
];

// Hari otomatis mengikuti tanggal sekarang
function ambilHariSekarang() {
    return namaHari[new Date().getDay()];
}

let daftarLatihan = [];
let nomorLatihan = 0;


// =================================
// TOMBOL HOME
// =================================

function masukDashboard() {
    document.getElementById("home").style.display = "none";
    document.getElementById("dashboard").style.display = "block";

    tampilkanJadwal();
    perbaruiStatistik();
    perbaruiHari();
}


// =================================
// TOMBOL MULAI LATIHAN
// =================================

function latihan(nama, menit, kalori) {
    nomorLatihan++;

    const data = {
        id: nomorLatihan,
        nama: nama,
        menit: menit,
        kalori: kalori,
        hari: ambilHariSekarang(),
        selesai: false
    };

    daftarLatihan.push(data);

    tampilkanJadwal();
    perbaruiStatistik();
    perbaruiHari();
}


// =================================
// TAMPILKAN JADWAL HARI INI
// =================================

function tampilkanJadwal() {
    const jadwal = document.getElementById("scheduleList");
    const hariIni = ambilHariSekarang();

    const latihanHariIni = daftarLatihan.filter(
        item => item.hari === hariIni
    );

    if (latihanHariIni.length === 0) {
        jadwal.innerHTML = `
            <div class="jadwal-kosong">
                Belum ada latihan hari ini.<br>
                Klik Mulai Latihan untuk menambahkan jadwal.
            </div>
        `;
        return;
    }

    jadwal.innerHTML = "";

    latihanHariIni.forEach(item => {
        jadwal.innerHTML += `
            <div class="jadwal-item ${item.selesai ? "latihan-selesai" : ""}">
                <label class="label-latihan">
                    <input
                        type="checkbox"
                        ${item.selesai ? "checked" : ""}
                        onchange="selesaiLatihan(${item.id}, this.checked)"
                    >
                    <strong>${item.nama}</strong>
                </label>

                <p>📅 Hari: ${item.hari}</p>
                <p>⏱️ Durasi: ${item.menit} menit</p>
                <p>🔥 Kalori: ${item.kalori} kalori</p>

                <span class="status-latihan">
                    ${item.selesai ? "✓ Latihan selesai!" : "Belum selesai"}
                </span>
            </div>
        `;
    });
}


// =================================
// CENTANG JIKA LATIHAN SELESAI
// =================================

function selesaiLatihan(id, dicentang) {
    const item = daftarLatihan.find(
        latihan => latihan.id === id
    );

    if (!item) return;

    item.selesai = dicentang;

    tampilkanJadwal();
    perbaruiStatistik();
    perbaruiHari();
}


// =================================
// PERBARUI STATISTIK
// =================================

function perbaruiStatistik() {
    const hariIni = ambilHariSekarang();

    // Statistik hanya menghitung latihan yang dicentang selesai
    const selesai = daftarLatihan.filter(
        item => item.hari === hariIni && item.selesai
    );

    const menit = selesai.reduce(
        (total, item) => total + item.menit, 0
    );

    const kalori = selesai.reduce(
        (total, item) => total + item.kalori, 0
    );

    document.getElementById("minutes").textContent =
        menit + " Menit";

    document.getElementById("calories").textContent = kalori;

    document.getElementById("sessions").textContent =
        selesai.length + " Latihan";

    const persen = Math.min(
        Math.round((menit / 60) * 100),
        100
    );

    document.getElementById("targetText").textContent =
        `Kamu sudah menyelesaikan ${persen}% target olahraga.`;

    document.getElementById("targetBar").style.width =
        persen + "%";
}


// =================================
// WARNA HARI OTOMATIS
// =================================

function perbaruiHari() {
    const hariIni = ambilHariSekarang();

    document.querySelectorAll(".day").forEach(elemen => {
        const nama = elemen.textContent.trim().split("\n")[0];

        // Tandai hari sekarang
        elemen.classList.toggle(
            "hari-aktif",
            nama.replace("'", "") === hariIni
        );

        const latihanHari = daftarLatihan.filter(
            item => item.hari === hariIni
        );

        if (nama.replace("'", "") === hariIni) {
            const bar = elemen.querySelector(".bar i");

            if (bar) {
                const totalMenit = latihanHari
                    .filter(item => item.selesai)
                    .reduce((total, item) => total + item.menit, 0);

                bar.style.width =
                    Math.min((totalMenit / 60) * 100, 100) + "%";
            }
        }
    });
}


// =================================
// RESET LATIHAN HARI INI
// =================================

function resetHari() {
    if (!confirm("Yakin ingin menghapus semua latihan hari ini?")) {
        return;
    }

    const hariIni = ambilHariSekarang();

    daftarLatihan = daftarLatihan.filter(
        item => item.hari !== hariIni
    );

    tampilkanJadwal();
    perbaruiStatistik();
    perbaruiHari();
}


// =================================
// SAAT HALAMAN DIBUKA
// =================================

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("dashboard").style.display = "none";

    tampilkanJadwal();
    perbaruiStatistik();
    perbaruiHari();
});

/* DOM 1: Mengubah teks judul */
function ubahJudul() {
    document.getElementById("judulHome").textContent =
        "Mulai Hidup Sehat Sekarang!";

    tampilToast("Judul berhasil diubah!");
}

/* DOM 2: Mengubah warna latar */

function ubahWarna() {
    const tombol = document.getElementById("tombolMulai");

    if (!tombol) {
        alert("Tombol Mulai Hidup Sehatmu tidak ditemukan!");
        return;
    }

    tombol.style.setProperty("background-color", "white", "important");
    tombol.style.setProperty("color", "#25332c", "important");
    tombol.style.setProperty("border", "1px solid #25332c", "important");

    tampilToast("Tombol berhasil berubah menjadi putih!");
}

/* DOM 3: Menampilkan atau menyembunyikan informasi */
function tampilDeskripsi() {
    const info = document.getElementById("infoOlahraga");

    if (info.style.display === "none") {
        info.style.display = "block";
        tampilToast("Informasi olahraga ditampilkan!");
    } else {
        info.style.display = "none";
        tampilToast("Informasi olahraga disembunyikan!");
    }
}
let timerToast;

function tampilToast(pesan) {
    const toast = document.getElementById("toast");
    const teks = document.getElementById("toastPesan");

    if (!toast || !teks) {
        alert("Toast tidak ditemukan! Cek index.html");
        return;
    }

    teks.textContent = pesan;
    toast.classList.add("show");

    clearTimeout(timerToast);

    timerToast = setTimeout(function () {
        toast.classList.remove("show");
    }, 3000);
}