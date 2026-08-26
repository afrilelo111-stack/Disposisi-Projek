import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logoSulut from "../assets/images/logo-sulut.png";
import "../assets/css/RiwayatSurat.css";

function RiwayatSurat() {
  const [suratList, setSuratList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =========================================================
     AMBIL DATA RIWAYAT DARI BACKEND
  ========================================================= */

  const fetchRiwayat = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/surat/riwayat"
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Gagal mengambil riwayat surat."
        );
      }

      setSuratList(
        Array.isArray(result.data)
          ? result.data
          : []
      );
    } catch (error) {
      console.error(
        "Gagal mengambil riwayat:",
        error
      );

      setError(
        "Gagal mengambil riwayat surat. Pastikan backend sedang berjalan."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     LOAD DATA
  ========================================================= */

  useEffect(() => {
    fetchRiwayat();
  }, []);

  /* =========================================================
     FORMAT TANGGAL
  ========================================================= */

  const formatTanggal = (tanggal) => {
    if (!tanggal) {
      return "-";
    }

    const date = new Date(tanggal);

    if (Number.isNaN(date.getTime())) {
      return "-";
    }

    const hari = String(
      date.getDate()
    ).padStart(2, "0");

    const bulan = String(
      date.getMonth() + 1
    ).padStart(2, "0");

    const tahun =
      date.getFullYear();

    return `${hari}/${bulan}/${tahun}`;
  };

  /* =========================================================
     FORMAT JAM
  ========================================================= */

  const formatJam = (jam) => {
    if (!jam) {
      return "-";
    }

    return (
      String(jam).substring(0, 5) +
      " WITA"
    );
  };

  /* =========================================================
     PULIHKAN SURAT
  ========================================================= */

  const handleRestore = async (id) => {
    const yakin = window.confirm(
      "Pulihkan surat ini kembali ke Surat Masuk?"
    );

    if (!yakin) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/surat/${id}/pulihkan`,
        {
          method: "PUT",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Gagal memulihkan surat."
        );
      }

      setSuratList((prev) =>
        prev.filter(
          (surat) =>
            String(surat._id) !==
            String(id)
        )
      );

      alert(
        "Surat berhasil dipulihkan ke Surat Masuk."
      );
    } catch (error) {
      console.error(
        "Gagal memulihkan surat:",
        error
      );

      alert(
        "Gagal memulihkan surat. Pastikan backend sedang berjalan."
      );
    }
  };

  /* =========================================================
     HAPUS PERMANEN
  ========================================================= */

  const handlePermanentDelete = async (id) => {
    const yakin = window.confirm(
      "PERINGATAN!\n\nSurat ini akan dihapus PERMANEN dari database dan tidak dapat dipulihkan lagi.\n\nApakah Anda yakin?"
    );

    if (!yakin) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/surat/${id}/permanen`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Gagal menghapus surat secara permanen."
        );
      }

      setSuratList((prev) =>
        prev.filter(
          (surat) =>
            String(surat._id) !==
            String(id)
        )
      );

      alert(
        "Surat berhasil dihapus secara permanen."
      );
    } catch (error) {
      console.error(
        "Gagal menghapus permanen:",
        error
      );

      alert(
        "Gagal menghapus surat secara permanen. Pastikan backend sedang berjalan."
      );
    }
  };

  /* =========================================================
     TAMPILAN
  ========================================================= */

  return (
    <div className="riwayat-page">

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside className="riwayat-sidebar">

        {/* BRAND */}

        <div className="riwayat-brand">

          <div className="riwayat-brand-logo">

            <img
              src={logoSulut}
              alt="Logo Sulawesi Utara"
            />

          </div>

          <div className="riwayat-brand-text">

            <h2>
              DISNAKERTRANS
            </h2>

            <span>
              Sulawesi Utara
            </span>

          </div>

        </div>


        {/* MENU */}

        <nav className="riwayat-menu">

          <p className="riwayat-menu-title">
            MENU UTAMA
          </p>


          {/* DASHBOARD */}

          <Link
            to="/"
            className="riwayat-menu-item"
          >
            <span>⌂</span>
            Dashboard
          </Link>


          {/* SURAT MASUK */}

          <Link
            to="/surat"
            className="riwayat-menu-item"
          >
            <span>▣</span>
            Surat Masuk
          </Link>


          {/* RIWAYAT */}

          <Link
            to="/riwayat"
            className="riwayat-menu-item active"
          >
            <span>↶</span>
            Riwayat Surat
          </Link>

        </nav>

      </aside>


      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="riwayat-main">

        {/* TOPBAR */}

        <header className="riwayat-topbar">

          <div className="riwayat-topbar-left">

            <h1>
              Riwayat Surat
            </h1>

            <p>
              Sistem Informasi Disposisi Surat
            </p>

          </div>

        </header>


        {/* CONTENT */}

        <section className="riwayat-content">

          {/* PAGE HEADER */}

          <div className="riwayat-page-header">

            <div className="riwayat-page-title">

              <span>
                DATA ADMINISTRASI
              </span>

              <h2>
                Riwayat Surat Masuk
              </h2>

              <p>
                Daftar surat yang telah dipindahkan dari Surat Masuk.
              </p>

            </div>


            <Link
              to="/surat"
              className="riwayat-btn-back"
            >
              ← Kembali ke Surat Masuk
            </Link>

          </div>


          {/* ERROR */}

          {error && (

            <div className="riwayat-error">
              {error}
            </div>

          )}


          {/* TABLE CARD */}

          <div className="riwayat-table-card">

            {/* TABLE TOP */}

            <div className="riwayat-table-top">

              <div>

                <strong>
                  Daftar Riwayat Surat
                </strong>

                <p>
                  Data surat yang telah dipindahkan ke riwayat
                </p>

              </div>


              <div className="riwayat-count">

                Total {suratList.length} surat

              </div>

            </div>


            {/* LOADING */}

            {loading ? (

              <div className="riwayat-empty">

                <div className="riwayat-loading-icon">
                  ↻
                </div>

                <p>
                  Memuat data surat...
                </p>

              </div>

            ) : error ? (

              <div className="riwayat-empty">

                <div className="riwayat-empty-icon">
                  !
                </div>

                <p>
                  Data riwayat belum dapat ditampilkan.
                </p>

              </div>

            ) : (

              /* TABLE */

              <div className="riwayat-table-wrapper">

                <table className="riwayat-table">

                  <thead>

                    <tr>

                      <th className="riwayat-col-no">
                        No
                      </th>

                      <th>
                        Nomor Surat
                      </th>

                      <th>
                        Surat Dari
                      </th>

                      <th>
                        Perihal
                      </th>

                      <th>
                        Tanggal Surat
                      </th>

                      <th>
                        Diterima
                      </th>

                      <th>
                        Aksi
                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    {suratList.length > 0 ? (

                      suratList.map(
                        (row, index) => (

                          <tr
                            key={row._id}
                          >

                            <td className="riwayat-row-number">
                              {index + 1}
                            </td>


                            <td>

                              <div className="riwayat-nomor">
                                {row.nomor_surat || "-"}
                              </div>

                            </td>


                            <td>

                              <div className="riwayat-asal">
                                {row.asal_surat || "-"}
                              </div>

                            </td>


                            <td>

                              <div className="riwayat-perihal">
                                {row.perihal || "-"}
                              </div>

                            </td>


                            <td>

                              <span className="riwayat-tanggal">

                                {formatTanggal(
                                  row.tanggal_surat
                                )}

                              </span>

                            </td>


                            <td>

                              <div>

                                <div className="riwayat-tanggal">

                                  {formatTanggal(
                                    row.tanggal_diterima
                                  )}

                                </div>

                                <div className="riwayat-jam">

                                  {formatJam(
                                    row.jam_diterima
                                  )}

                                </div>

                              </div>

                            </td>


                            <td>

                              <div className="riwayat-action">

                                {/* PULIHKAN */}

                                <button
                                  type="button"
                                  className="riwayat-action-btn restore"
                                  onClick={() =>
                                    handleRestore(
                                      row._id
                                    )
                                  }
                                >
                                  Pulihkan
                                </button>


                                {/* HAPUS PERMANEN */}

                                <button
                                  type="button"
                                  className="riwayat-action-btn delete"
                                  onClick={() =>
                                    handlePermanentDelete(
                                      row._id
                                    )
                                  }
                                >
                                  Hapus Permanen
                                </button>

                              </div>

                            </td>

                          </tr>

                        )
                      )

                    ) : (

                      <tr>

                        <td
                          colSpan="7"
                          className="riwayat-empty-table"
                        >
                          Belum ada riwayat surat.

                        </td>

                      </tr>

                    )}

                  </tbody>

                </table>

              </div>

            )}

          </div>

        </section>

      </main>

    </div>
  );
}

export default RiwayatSurat;