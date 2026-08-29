const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const suratRoutes = require("./routes/suratRoutes");

const app = express();

// =========================================================
// MIDDLEWARE
// =========================================================

app.use(cors());
app.use(express.json());

// =========================================================
// ROUTE UTAMA
// =========================================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Backend Disposisi Surat berhasil berjalan 🚀",
  });
});

// =========================================================
// ROUTE SURAT
// =========================================================

app.use("/api/surat", suratRoutes);

// =========================================================
// KONEKSI MONGODB
// =========================================================

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ Berhasil terhubung ke MongoDB Atlas");

    // Jalankan server hanya saat dijalankan langsung
    if (require.main === module) {
      const PORT = process.env.PORT || 5000;

      app.listen(PORT, () => {
        console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
      });
    }
  })
  .catch((error) => {
    console.error("❌ Gagal terhubung ke MongoDB Atlas");
    console.error(error.message);
  });

// =========================================================
// EXPORT APP UNTUK VERCEL
// =========================================================

module.exports = app;