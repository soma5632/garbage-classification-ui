import { useState } from "react";
import UploadButtons from "../components/UploadButtons";
import { predict } from "../services/api"; // ← api.js を経由して呼び出す

export default function Home({ onResult }) {
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleJudge = async () => {
    if (!file) return;
    try {
        const result = await predict(file);   // ← バックエンド呼び出し
        console.log("APIからの結果:", result); // ← デバッグ用に追加
        onResult(result);
    } catch (err) {
        console.error("判定エラー:", err);
    }
  };


  return (
    <div style={styles.container}>
      <h2 style={styles.title}>今日のゴミ</h2>
      <div style={styles.todayBox}>カン・ビン</div>

      <div style={styles.buttonRow}>
        <UploadButtons
          label="カメラ"
          capture="environment"
          onChange={handleFileChange}
        />
        <UploadButtons
          label="アルバム"
          onChange={handleFileChange}
        />
      </div>

      {preview && (
        <div style={{ marginBottom: "20px" }}>
          <img
            src={preview}
            alt="preview"
            style={{ maxWidth: "100%", borderRadius: "8px" }}
          />
          <button style={styles.footerButton} onClick={handleJudge}>
            判別する
          </button>
        </div>
      )}

      {!preview && (
        <button style={styles.footerButton}>
          自治体の選択・通知設定
        </button>
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