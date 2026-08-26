import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import logoSulut from "../assets/images/logo-sulut.png";

/* =========================================================
   PARSE TANGGAL LOCAL
========================================================= */

function parseDateLocal(value) {
  if (!value) return null;

  const text = String(value).trim();

  /* Format YYYY-MM-DD */
  const match = text.match(/^(\d{4})-(\d{2})-(\d{2})/);

  if (match) {
    const date = new Date(
      Number(match[1]),
      Number(match[2]) - 1,
      Number(match[3])
    );

    if (!Number.isNaN(date.getTime())) {
      return date;
    }
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
}

/* =========================================================
   FORMAT TANGGAL
   Contoh: 19/08/2026
========================================================= */

function formatTanggal(value) {
  const date = parseDateLocal(value);

  if (!date) return "-";

  const hari = String(date.getDate()).padStart(2, "0");

  const bulan = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const tahun = date.getFullYear();

  return `${hari}/${bulan}/${tahun}`;
}

/* =========================================================
   FORMAT JAM
   Contoh: 15:30 WITA
========================================================= */

function formatJam(value) {
  if (!value) return "-";

  const text = String(value).trim();

  const match = text.match(
    /^(\d{1,2}):(\d{2})/
  );

  if (!match) {
    return `${text} WITA`;
  }

  return `${String(match[1]).padStart(
    2,
    "0"
  )}:${match[2]} WITA`;
}

/* =========================================================
   FORMAT LIST DISPOSISI
========================================================= */

function parseList(value) {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value
      .map((item) => String(item).trim())
      .filter(Boolean);
  }

  return String(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

/* =========================================================
   PILIHAN DITERUSKAN KEPADA
========================================================= */

const diteruskanOptions = [
  "Sekretaris",
  "Kabid. HI & Jaminan Sosial Tenaga Kerja",
  "Kabid. Pengawasan Ketenagakerjaan",
  "Kabid. Pelatihan & penempatan T.K",
  "Kabid. Ketransmigrasian",
  "Ka. UPTD Balai Pengawasan Tenaga Kerja",
  "Ka. UPTD Balai Pelatihan Tenaga Kerja",
];

/* =========================================================
   PILIHAN DENGAN HORMAT HARAP
========================================================= */

const hormatOptions = [
  "Buat Tanggapan dan saran",
  "Tangani / Proses lebih Lanjut",
  "Proses Sesuai Ketentuan",
  "Laporkan Kepada Saya",
  "Koordinasi",
  "Untuk Minta Perhatian",
  "Tindak Lanjut",
  "Buatkan Materi / Sambutan",
  "Mewakili",
  "File",
];

/* =========================================================
   KOMPONEN SIDEBAR
========================================================= */

function Sidebar() {
  return (
    <aside className="sidebar">

      {/* BRAND */}

      <div className="brand">

        <div className="brand-logo">

          <img
            src={logoSulut}
            alt="Logo Sulawesi Utara"
          />

        </div>

        <div className="brand-text">

          <h2>
            DISNAKERTRANSDA
          </h2>

          <span>
            Sulawesi Utara
          </span>

        </div>

      </div>

      {/* MENU */}

      <nav className="menu">

        <Link
          to="/"
          className="menu-item"
        >
          <span>
            ⌂
          </span>

          Dashboard
        </Link>

        <Link
          to="/surat"
          className="menu-item active"
        >
          <span>
            ▣
          </span>

          Surat Masuk
        </Link>

      </nav>

    </aside>
  );
}

/* =========================================================
   KOMPONEN TOPBAR
========================================================= */

function Topbar() {
  return (
    <header className="topbar">

      <div>

        <h1>
          Detail Surat
        </h1>

        <p>
          Informasi lengkap surat masuk
        </p>

      </div>

      <div className="user-info">
        Administrator
      </div>

    </header>
  );
}

/* =========================================================
   COMPONENT DETAIL SURAT
========================================================= */

function DetailSurat() {
  const { id } = useParams();

  const [surat, setSurat] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  /* =======================================================
     AMBIL DATA DARI BACKEND
  ======================================================= */

  useEffect(() => {

    const fetchDetailSurat = async () => {

      try {

        setLoading(true);
        setError("");

        const response = await fetch(
          `http://localhost:5000/api/surat/${id}`
        );

        const result = await response.json();

        if (!response.ok) {

          throw new Error(
            result.message ||
              "Data surat tidak ditemukan."
          );

        }

        setSurat(result.data);

      } catch (error) {

        console.error(
          "Gagal mengambil detail surat:",
          error
        );

        setError(
          "Data surat tidak tersedia atau gagal mengambil data dari server."
        );

      } finally {

        setLoading(false);

      }

    };

    if (id) {
      fetchDetailSurat();
    }

  }, [id]);

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {

    return (
      <div className="app">

        <Sidebar />

        <main className="main-content">

          <Topbar />

          <section className="page-content">

            <div className="form-card">

              <p
                style={{
                  margin: 0,
                  color: "#6b7280",
                  fontSize: "13px",
                }}
              >
                Memuat data surat...
              </p>

            </div>

          </section>

        </main>

      </div>
    );

  }

  /* =======================================================
     DATA TIDAK DITEMUKAN
  ======================================================= */

  if (!surat || error) {

    return (
      <div className="app">

        <Sidebar />

        <main className="main-content">

          <Topbar />

          <section className="page-content">

            <div className="form-card">

              <h2
                style={{
                  marginTop: 0,
                  marginBottom: "10px",
                }}
              >
                Surat Tidak Ditemukan
              </h2>

              <p
                style={{
                  color: "#6b7280",
                  marginBottom: "20px",
                }}
              >
                {error ||
                  "Data surat tidak tersedia."}
              </p>

              <Link
                to="/surat"
                className="btn-secondary"
              >
                ← Kembali
              </Link>

            </div>

          </section>

        </main>

      </div>
    );

  }

  /* =======================================================
     DATA DISPOSISI
  ======================================================= */

  const diteruskan = parseList(
    surat.diteruskan_kepada
  );

  const hormat = parseList(
    surat.dengan_hormat_harap
  );

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="app">

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <Sidebar />


      {/* =================================================
          MAIN
      ================================================= */}

      <main className="main-content">

        {/* TOPBAR */}

        <Topbar />


        {/* =================================================
            CONTENT
        ================================================= */}

        <section className="page-content">


          {/* =================================================
              PAGE HEADER
          ================================================= */}

          <div className="page-header">

            <div>

              <h2>
                Detail Surat Masuk
              </h2>

              <p>
                Informasi lengkap data surat
                dan disposisi.
              </p>

            </div>

            <Link
              to="/surat"
              className="btn-secondary"
            >
              ← Kembali
            </Link>

          </div>


          {/* =================================================
              FORM CARD
          ================================================= */}

          <div className="form-card">


            {/* =================================================
                INFORMASI SURAT
            ================================================= */}

            <div className="form-section">

              <h3>
                Informasi Surat
              </h3>


              <div className="form-grid">


                {/* NOMOR SURAT */}

                <div className="form-group">

                  <label>
                    Nomor Surat
                  </label>

                  <input
                    type="text"
                    value={
                      surat.nomor_surat || ""
                    }
                    readOnly
                  />

                </div>


                {/* NOMOR AGENDA */}

                <div className="form-group">

                  <label>
                    Nomor Agenda
                  </label>

                  <input
                    type="text"
                    value={
                      surat.nomor_agenda || ""
                    }
                    readOnly
                  />

                </div>


                {/* SURAT DARI */}

                <div className="form-group">

                  <label>
                    Surat Dari
                  </label>

                  <input
                    type="text"
                    value={
                      surat.asal_surat || ""
                    }
                    readOnly
                  />

                </div>


                {/* SIFAT SURAT */}

                <div className="form-group">

                  <label>
                    Sifat Surat
                  </label>

                  <input
                    type="text"
                    value={
                      surat.sifat_surat || ""
                    }
                    readOnly
                  />

                </div>


                {/* TANGGAL SURAT */}

                <div className="form-group">

                  <label>
                    Tanggal Surat
                  </label>

                  <input
                    type="text"
                    value={formatTanggal(
                      surat.tanggal_surat
                    )}
                    readOnly
                  />

                </div>


                {/* TANGGAL DITERIMA */}

                <div className="form-group">

                  <label>
                    Tanggal Diterima
                  </label>

                  <input
                    type="text"
                    value={formatTanggal(
                      surat.tanggal_diterima
                    )}
                    readOnly
                  />

                </div>


                {/* JAM DITERIMA */}

                <div className="form-group">

                  <label>
                    Jam Diterima
                  </label>

                  <input
                    type="text"
                    value={formatJam(
                      surat.jam_diterima
                    )}
                    readOnly
                  />

                </div>


              </div>

            </div>


            {/* =================================================
                PERIHAL
            ================================================= */}

            <div className="form-section">

              <h3>
                Perihal
              </h3>

              <div className="form-group">

                <label>
                  Perihal Surat
                </label>

                <textarea
                  value={
                    surat.perihal || ""
                  }
                  readOnly
                  rows="4"
                />

              </div>

            </div>


            {/* =================================================
                DISPOSISI
            ================================================= */}

            <div className="form-section">

              <h3>
                Disposisi
              </h3>


              <div className="disposisi-grid">


                {/* =================================================
                    DITERUSKAN KEPADA
                ================================================= */}

                <div className="disposisi-box">

                  <h4>
                    Diteruskan Kepada
                  </h4>


                  <div className="checkbox-list">

                    {diteruskan.length > 0 ? (

                      diteruskanOptions.map(
                        (option) => {

                          const checked =
                            diteruskan.includes(
                              option
                            );

                          return (
                            <div
                              className="check-row"
                              key={option}
                            >

                              <span
                                className="check-box"
                                style={
                                  checked
                                    ? {
                                        background:
                                          "#123b5d",
                                        borderColor:
                                          "#123b5d",
                                        color:
                                          "#ffffff",
                                      }
                                    : {}
                                }
                              >
                                {checked
                                  ? "✓"
                                  : ""}
                              </span>

                              <span className="check-text">
                                {option}
                              </span>

                            </div>
                          );

                        }
                      )

                    ) : (

                      <div
                        style={{
                          fontSize: "12px",
                          color: "#6b7280",
                          padding: "7px 0",
                        }}
                      >
                        Tidak ada pilihan.
                      </div>

                    )}

                  </div>

                </div>


                {/* =================================================
                    DENGAN HORMAT HARAP
                ================================================= */}

                <div className="disposisi-box">

                  <h4>
                    Dengan Hormat Harap
                  </h4>


                  <div className="checkbox-list">

                    {hormat.length > 0 ? (

                      hormatOptions.map(
                        (option) => {

                          const checked =
                            hormat.includes(
                              option
                            );

                          return (
                            <div
                              className="check-row"
                              key={option}
                            >

                              <span
                                className="check-box"
                                style={
                                  checked
                                    ? {
                                        background:
                                          "#123b5d",
                                        borderColor:
                                          "#123b5d",
                                        color:
                                          "#ffffff",
                                      }
                                    : {}
                                }
                              >
                                {checked
                                  ? "✓"
                                  : ""}
                              </span>

                              <span className="check-text">
                                {option}
                              </span>

                            </div>
                          );

                        }
                      )

                    ) : (

                      <div
                        style={{
                          fontSize: "12px",
                          color: "#6b7280",
                          padding: "7px 0",
                        }}
                      >
                        Tidak ada pilihan.
                      </div>

                    )}

                  </div>

                </div>


              </div>

            </div>


            {/* =================================================
                CATATAN
            ================================================= */}

            <div className="form-section">

              <h3>
                Catatan
              </h3>


              <div className="form-group">

                <label>
                  Catatan
                </label>

                <textarea
                  value={
                    surat.catatan || ""
                  }
                  readOnly
                  rows="4"
                />

              </div>

            </div>


            {/* =================================================
                BUTTON
            ================================================= */}

            <div className="form-actions">

              <Link
                to="/surat"
                className="btn-secondary"
              >
                ← Kembali
              </Link>


              <Link
                to={`/surat/edit/${surat._id}`}
                className="btn-primary"
              >
                Edit Surat
              </Link>

            </div>


          </div>

        </section>

      </main>

    </div>
  );
}

export default DetailSurat;