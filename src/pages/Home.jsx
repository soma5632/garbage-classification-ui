import { useState } from "react";
import UploadButtons from "../components/UploadButtons";

export default function Home({ onNavigate }) {
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  return (
    <div style={styles.container}>
        {/* Headerから（未） */}
      <h2 style={styles.title}>今日のゴミ</h2>
      <div style={styles.todayBox}>カン・ビン</div>

      {/* UploadButtonsから */}
      <div style={styles.buttonRow}>
        <UploadButtons label="カメラ" capture="environment" onChange={handleFileChange} />
        <UploadButtons label="アルバム" onChange={handleFileChange} />
      </div>

      {/* これはHomeでやっちゃう */}
      {preview && (
        <div style={{ marginBottom: "20px" }}>
          <img src={preview} alt="preview" style={{ maxWidth: "100%", borderRadius: "8px" }} />
          <button style={styles.footerButton} onClick={onNavigate}>
            判別する
          </button>
        </div>
      )}

      {/* FooterMenuから（未） */}
      {!preview && (
        <button style={styles.footerButton}>自治体の選択・通知設定</button>
      )}
    </div>
  );
}

const styles = {
  container: {
    flex: 1,
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    textAlign: "center",
  },
  title: { marginBottom: "10px" },
  todayBox: {
    background: "#fff",
    padding: "15px",
    borderRadius: "8px",
    marginBottom: "20px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  buttonRow: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    marginBottom: "20px",
  },
  footerButton: {
    padding: "15px",
    borderRadius: "6px",
    border: "none",
    background: "#007bff",
    color: "#fff",
    fontSize: "16px",
    cursor: "pointer",
    marginTop: "auto",
    width: "100%",
  },
};