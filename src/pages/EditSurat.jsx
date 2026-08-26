import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import logoSulut from "../assets/images/logo-sulut.png";

/* =========================================
   WAKTU INDONESIA - WITA
========================================= */

function getTanggalIndonesia() {
  const sekarang = new Date();

  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Makassar",
  }).format(sekarang);
}

function getJamIndonesia() {
  const sekarang = new Date();

  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Makassar",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(sekarang);
}

/* =========================================
   EDIT SURAT
========================================= */

function EditSurat() {
  const { id } = useParams();
  const navigate = useNavigate();

  /* =========================================
     FORM
  ========================================= */

  const [form, setForm] = useState({
    nomor_surat: "",
    asal_surat: "",
    tanggal_surat: "",
    nomor_agenda: "",
    tanggal_diterima: "",
    jam_diterima: "",
    perihal: "",

    // Tetap disimpan agar tidak merusak struktur
    // database/backend
    sifat_surat: "",
    diteruskan_kepada: [],
    dengan_hormat_harap: [],
    catatan: "",
  });

  const [loading, setLoading] = useState(true);

  /* =========================================
     AMBIL DATA SURAT
  ========================================= */

  useEffect(() => {
    const getSurat = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/surat/${id}`
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || "Gagal mengambil data surat"
          );
        }

        const surat = result.data || result;

        setForm({
          nomor_surat: surat.nomor_surat || "",
          asal_surat: surat.asal_surat || "",
          tanggal_surat: surat.tanggal_surat || "",
          nomor_agenda: surat.nomor_agenda || "",
          tanggal_diterima:
            surat.tanggal_diterima || getTanggalIndonesia(),
          jam_diterima:
            surat.jam_diterima || getJamIndonesia(),
          perihal: surat.perihal || "",

          // Tetap ada di data agar backend aman
          sifat_surat: surat.sifat_surat || "",
          diteruskan_kepada:
            surat.diteruskan_kepada || [],
          dengan_hormat_harap:
            surat.dengan_hormat_harap || [],
          catatan: surat.catatan || "",
        });
      } catch (error) {
        console.error(
          "Gagal mengambil data surat:",
          error
        );

        alert(
          "Gagal mengambil data surat. Pastikan backend sedang berjalan."
        );

        navigate("/surat");
      } finally {
        setLoading(false);
      }
    };

    getSurat();
  }, [id, navigate]);

  /* =========================================
     INPUT BIASA
  ========================================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =========================================
     SIMPAN PERUBAHAN
  ========================================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:5000/api/surat/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Gagal memperbarui surat"
        );
      }

      alert("Data surat berhasil diperbarui.");

      navigate("/surat");
    } catch (error) {
      console.error(
        "Gagal memperbarui surat:",
        error
      );

      alert(
        "Gagal memperbarui surat. Pastikan backend sedang berjalan."
      );
    }
  };

  /* =========================================
     LOADING
  ========================================= */

  if (loading) {
    return (
      <div className="app">
        <main
          className="main-content"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
          }}
        >
          <p>Memuat data surat...</p>
        </main>
      </div>
    );
  }

  /* =========================================
     TAMPILAN
  ========================================= */

  return (
    <div className="app">

      {/* =====================================
          SIDEBAR
      ===================================== */}

      <aside className="sidebar">

        <div className="brand">

          <div className="brand-logo">
            <img
              src={logoSulut}
              alt="Logo Sulawesi Utara"
            />
          </div>

          <div>
            <h2>
              DISNAKERTRANSDA
            </h2>

            <span>
              Sulawesi Utara
            </span>
          </div>

        </div>

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

      {/* =====================================
          MAIN
      ===================================== */}

      <main className="main-content">

        {/* ===================================
            TOPBAR
        =================================== */}

        <header className="topbar">

          <div>

            <h1>
              Edit Surat
            </h1>

            <p>
              Perbarui data surat masuk
            </p>

          </div>

          <div className="user-info">
            Administrator
          </div>

        </header>

        {/* ===================================
            CONTENT
        =================================== */}

        <section className="page-content">

          {/* PAGE HEADER */}

          <div className="page-header">

            <div>

              <h2>
                Form Edit Surat Masuk
              </h2>

              <p>
                Periksa dan perbarui data surat
                dengan benar.
              </p>

            </div>

            <Link
              to="/surat"
              className="btn-secondary"
            >
              ← Kembali
            </Link>

          </div>

          {/* =================================
              FORM CARD
          ================================= */}

          <div className="form-card">

            <form onSubmit={handleSubmit}>

              {/* =================================
                  INFORMASI SURAT
              ================================= */}

              <div className="form-section">

                <h3>
                  Informasi Surat
                </h3>

                <div className="form-grid">

                  {/* =================================
                      SURAT DARI
                  ================================= */}

                  <div className="form-group">

                    <label htmlFor="asal_surat">
                      Surat Dari
                    </label>

                    <input
                      id="asal_surat"
                      name="asal_surat"
                      type="text"
                      value={form.asal_surat}
                      onChange={handleChange}
                      placeholder="Masukkan asal surat"
                      required
                    />

                  </div>

                  {/* =================================
                      NOMOR AGENDA
                  ================================= */}

                  <div className="form-group">

                    <label htmlFor="nomor_agenda">
                      Nomor Agenda
                    </label>

                    <input
                      id="nomor_agenda"
                      name="nomor_agenda"
                      type="text"
                      value={form.nomor_agenda}
                      onChange={handleChange}
                      placeholder="Masukkan nomor agenda"
                      required
                    />

                  </div>

                  {/* =================================
                      NOMOR SURAT
                  ================================= */}

                  <div className="form-group">

                    <label htmlFor="nomor_surat">
                      Nomor Surat
                    </label>

                    <input
                      id="nomor_surat"
                      name="nomor_surat"
                      type="text"
                      value={form.nomor_surat}
                      onChange={handleChange}
                      placeholder="Masukkan nomor surat"
                      required
                    />

                  </div>

                  {/* =================================
                      TANGGAL DITERIMA
                  ================================= */}

                  <div className="form-group">

                    <label htmlFor="tanggal_diterima">
                      Tanggal Diterima
                    </label>

                    <input
                      id="tanggal_diterima"
                      name="tanggal_diterima"
                      type="text"
                      value={form.tanggal_diterima}
                      readOnly
                    />

                  </div>

                  {/* =================================
                      TANGGAL SURAT
                      DIKETIK MANUAL
                  ================================= */}

                  <div className="form-group">

                    <label htmlFor="tanggal_surat">
                      Tanggal Surat
                    </label>

                    <input
                      id="tanggal_surat"
                      name="tanggal_surat"
                      type="text"
                      value={form.tanggal_surat}
                      onChange={handleChange}
                      placeholder="Contoh: 20-08-2026"
                      required
                    />

                  </div>

                  {/* =================================
                      JAM DITERIMA
                  ================================= */}

                  <div className="form-group">

                    <label htmlFor="jam_diterima">
                      Jam Diterima
                    </label>

                    <input
                      id="jam_diterima"
                      name="jam_diterima"
                      type="text"
                      value={form.jam_diterima}
                      readOnly
                    />

                  </div>

                </div>

              </div>

              {/* =================================
                  PERIHAL
              ================================= */}

              <div className="form-section">

                <h3>
                  Perihal
                </h3>

                <div className="form-group">

                  <label htmlFor="perihal">
                    Perihal Surat
                  </label>

                  <textarea
                    id="perihal"
                    name="perihal"
                    value={form.perihal}
                    onChange={handleChange}
                    placeholder="Masukkan perihal surat"
                    rows="4"
                    required
                  />

                </div>

              </div>

              {/* =================================
                  BUTTON
              ================================= */}

              <div className="form-actions">

                <Link
                  to="/surat"
                  className="btn-secondary"
                >
                  Batal
                </Link>

                <button
                  type="submit"
                  className="btn-primary"
                >
                  Simpan Perubahan
                </button>

              </div>

            </form>

          </div>

        </section>

      </main>

    </div>
  );
}

export default EditSurat;