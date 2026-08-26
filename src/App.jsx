import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import SuratMasuk from "./pages/SuratMasuk";
import TambahSurat from "./pages/Tambahsurat";
import DetailSurat from "./pages/DetailSurat";
import EditSurat from "./pages/EditSurat";
import CetakSurat from "./pages/CetakSurat";
import RiwayatSurat from "./pages/RiwayatSurat";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Dashboard />}
        />

        <Route
          path="/surat"
          element={<SuratMasuk />}
        />

        <Route
          path="/surat/tambah"
          element={<TambahSurat />}
        />

        <Route
          path="/surat/detail/:id"
          element={<DetailSurat />}
        />

        <Route
          path="/surat/edit/:id"
          element={<EditSurat />}
        />

        <Route
          path="/surat/cetak/:id"
          element={<CetakSurat />}
        />

        <Route
          path="/riwayat"
          element={<RiwayatSurat />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;