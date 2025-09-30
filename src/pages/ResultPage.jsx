import { getCategory } from "../utils/getCategory";

export default function ResultPage({ aiResult, onBack }) {
  if (!aiResult) {
    return (
      <div style={styles.container}>
        <p>判定結果がありません。</p>
        <button style={styles.backButton} onClick={onBack}>
          ← 戻る
        </button>
      </div>
    );
  }

  const category = getCategory(aiResult);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>判別結果</h2>

      <div style={styles.resultBox}>
        <p style={styles.resultText}>{category}</p>
        <p>材質: {aiResult.material}</p>
        <p>形状: {aiResult.shape}</p>
        <p>汚れ: {aiResult.dirty ? "あり" : "なし"}</p>
        <p>中身を空にして軽くすすぐ</p>
      </div>

      <button style={styles.backButton} onClick={onBack}>
        ← 戻る
      </button>
    </div>
  );
}

const styles = {
  container: {
    flex: 1,
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    textAlign: "center",
  },
  title: {
    marginBottom: "20px",
  },
  resultBox: {
    background: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    marginBottom: "20px",
  },
  resultText: {
    fontSize: "20px",
    fontWeight: "bold",
  },
  backButton: {
    padding: "12px",
    borderRadius: "6px",
    border: "none",
    background: "#007bff",
    color: "#fff",
    fontSize: "16px",
    cursor: "pointer",
  },
};