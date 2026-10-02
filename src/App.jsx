import { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, addDoc, deleteDoc, doc, onSnapshot, updateDoc } from "firebase/firestore";

export default function App() {
  const [nama, setNama] = useState("Syaiful");
  const [jenis, setJenis] = useState("Pemasukan");
  const [jumlah, setJumlah] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [riwayat, setRiwayat] = useState([]);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "tabungan_nikah"), (snapshot) => {
      const dataCloud = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRiwayat(dataCloud);
    });
    return () => unsubscribe();
  }, []);

  let totalSyaiful = 0;
  let totalFira = 0;

  riwayat.forEach((item) => {
    const jml = Number(item.jumlah) || 0;
    if (item.nama === "Syaiful") {
      if (item.jenis === "Pemasukan") totalSyaiful += jml;
      else totalSyaiful -= jml;
    } else {
      if (item.jenis === "Pemasukan") totalFira += jml;
      else totalFira -= jml;
    }
  });

  const totalBersama = totalSyaiful + totalFira;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!jumlah || !keterangan) return alert("Mohon isi semua data!");

    try {
      if (editId) {
        await updateDoc(doc(db, "tabungan_nikah", editId), {
          nama,
          jenis,
          jumlah: Number(jumlah),
          keterangan,
        });
        setEditId(null);
      } else {
        await addDoc(collection(db, "tabungan_nikah"), {
          nama,
          jenis,
          jumlah: Number(jumlah),
          keterangan,
          timestamp: Date.now(),
        });
      }
      setJumlah("");
      setKeterangan("");
    } catch (error) {
      alert("Gagal menyimpan: " + error.message);
    }
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setNama(item.nama);
    setJenis(item.jenis);
    setJumlah(item.jumlah);
    setKeterangan(item.keterangan);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Yakin ingin menghapus catatan ini?")) {
      try {
        await deleteDoc(doc(db, "tabungan_nikah", id));
      } catch (error) {
        alert("Gagal menghapus: " + error.message);
      }
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0b1329", color: "#f8fafc", fontFamily: "Inter, sans-serif", padding: "20px" }}>
      
      <div style={{ textAlign: "center", marginBottom: "30px", paddingTop: "10px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", margin: "0 0 8px 0" }}>
          <span>💍</span> Tabungan Nikah Syaiful & Fira
        </h1>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(16, 185, 129, 0.1)", color: "#34d399", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600", border: "1px solid rgba(16, 185, 129, 0.2)" }}>
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#34d399", display: "inline-block" }}></span>
          Cloud Database Connected
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", maxWidth: "1200px", margin: "0 auto" }}>
        
        <div style={{ background: "#111c38", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px", padding: "24px", boxShadow: "0 10px 25px rgba(0,0,0,0.3)" }}>
          <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "20px", color: "#e2e8f0", borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: "10px" }}>
            {editId ? "Edit Catatan Tabungan" : "Masukan Data Tabungan"}
          </h3>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#94a3b8", marginBottom: "6px" }}>NAMA PENYETOR</label>
              <select value={nama} onChange={(e) => setNama(e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "10px", background: "#0b1329", color: "#fff", border: "1px solid rgba(255,255,255,0.1)", outline: "none", fontSize: "14px" }}>
                <option value="Syaiful">Syaiful</option>
                <option value="Fira">Fira</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#94a3b8", marginBottom: "6px" }}>JENIS TRANSAKSI</label>
              <select value={jenis} onChange={(e) => setJenis(e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "10px", background: "#0b1329", color: "#fff", border: "1px solid rgba(255,255,255,0.1)", outline: "none", fontSize: "14px" }}>
                <option value="Pemasukan">Pemasukan (Setor)</option>
                <option value="Pengeluaran">Pengeluaran (Tarik)</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#94a3b8", marginBottom: "6px" }}>JUMLAH (RP)</label>
              <input type="number" placeholder="Contoh: 500000" value={jumlah} onChange={(e) => setJumlah(e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "10px", background: "#0b1329", color: "#fff", border: "1px solid rgba(255,255,255,0.1)", outline: "none", fontSize: "14px", boxSizing: "border-box" }} required />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#94a3b8", marginBottom: "6px" }}>KETERANGAN</label>
              <input type="text" placeholder="Contoh: Setoran Bulan Oktober" value={keterangan} onChange={(e) => setKeterangan(e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "10px", background: "#0b1329", color: "#fff", border: "1px solid rgba(255,255,255,0.1)", outline: "none", fontSize: "14px", boxSizing: "border-box" }} required />
            </div>

            <button type="submit" style={{ background: "#10b981", color: "#ffffff", border: "none", padding: "14px", borderRadius: "10px", fontWeight: "700", cursor: "pointer", fontSize: "14px", marginTop: "10px", boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)" }}>
              {editId ? "Update Data" : "💾 Simpan Data Ke Cloud"}
            </button>
            {editId && (
              <button type="button" onClick={() => { setEditId(null); setJumlah(""); setKeterangan(""); }} style={{ background: "transparent", color: "#94a3b8", border: "1px solid rgba(255,255,255,0.1)", padding: "8px", borderRadius: "8px", cursor: "pointer", fontSize: "12px" }}>
                Batal Edit
              </button>
            )}
          </form>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ background: "linear-gradient(135deg, #0284c7, #0369a1)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", padding: "20px", textAlign: "center", boxShadow: "0 10px 25px rgba(0,0,0,0.3)" }}>
            <span style={{ fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", color: "#bae6fd" }}>Total Tabungan Bersama</span>
            <div style={{ fontSize: "32px", fontWeight: "800", marginTop: "8px", color: "#ffffff" }}>Rp {totalBersama.toLocaleString("id-ID")}</div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
            <div style={{ background: "#111c38", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px", padding: "20px", textAlign: "center" }}>
              <span style={{ color: "#94a3b8", fontSize: "12px", fontWeight: "700" }}>Tabungan Syaiful</span>
              <div style={{ fontSize: "18px", fontWeight: "700", color: "#38bdf8", marginTop: "8px" }}>Rp {totalSyaiful.toLocaleString("id-ID")}</div>
            </div>
            <div style={{ background: "#111c38", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px", padding: "20px", textAlign: "center" }}>
              <span style={{ color: "#94a3b8", fontSize: "12px", fontWeight: "700" }}>Tabungan Fira</span>
              <div style={{ fontSize: "18px", fontWeight: "700", color: "#f43f5e", marginTop: "8px" }}>Rp {totalFira.toLocaleString("id-ID")}</div>
            </div>
          </div>

          <div style={{ background: "#111c38", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px", padding: "20px", flex: 1, display: "flex", flexDirection: "column" }}>
            <h3 style={{ fontSize: "14px", fontWeight: "600", marginBottom: "15px", color: "#e2e8f0" }}>Status Sinkronisasi</h3>
            <div style={{ background: "#0b1329", padding: "15px", borderRadius: "10px", border: "1px dashed rgba(255,255,255,0.1)", fontSize: "13px", color: "#94a3b8", lineHeight: "1.6" }}>
              Terhubung secara real-time ke Firebase Database. Data yang dimasukkan Syaiful atau Fira akan langsung tersimpan dan tampil otomatis.
            </div>
          </div>
        </div>

      </div>

      <div style={{ maxWidth: "1200px", margin: "30px auto 0 auto", background: "#111c38", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px", padding: "24px" }}>
        <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "16px", color: "#e2e8f0" }}>Riwayat Database Cloud Online</h3>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr style={{ background: "rgba(255,255,255,0.03)", color: "#94a3b8", textAlign: "left" }}>
                <th style={{ padding: "12px" }}>Nama</th>
                <th style={{ padding: "12px" }}>Jenis</th>
                <th style={{ padding: "12px" }}>Jumlah</th>
                <th style={{ padding: "12px" }}>Keterangan</th>
                <th style={{ padding: "12px", textAlign: "center" }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {riwayat.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", padding: "30px", color: "#64748b" }}>Belum ada catatan riwayat tabungan.</td>
                </tr>
              ) : (
                riwayat.map((item) => (
                  <tr key={item.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <td style={{ padding: "12px", fontWeight: "600" }}>{item.nama}</td>
                    <td style={{ padding: "12px", color: item.jenis === "Pemasukan" ? "#34d399" : "#f43f5e", fontWeight: "600" }}>{item.jenis}</td>
                    <td style={{ padding: "12px" }}>Rp {Number(item.jumlah).toLocaleString("id-ID")}</td>
                    <td style={{ padding: "12px", color: "#cbd5e1" }}>{item.keterangan}</td>
                    <td style={{ padding: "12px", textAlign: "center", display: "flex", gap: "6px", justifyContent: "center" }}>
                      <button onClick={() => handleEdit(item)} style={{ background: "rgba(234, 179, 8, 0.1)", color: "#eab308", border: "1px solid rgba(234, 179, 8, 0.2)", padding: "6px 10px", borderRadius: "6px", cursor: "pointer", fontSize: "11px", fontWeight: "600" }}>
                        Edit
                      </button>
                      <button onClick={() => handleDelete(item.id)} style={{ background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", border: "1px solid rgba(239, 68, 68, 0.2)", padding: "6px 10px", borderRadius: "6px", cursor: "pointer", fontSize: "11px", fontWeight: "600" }}>
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

export default App;