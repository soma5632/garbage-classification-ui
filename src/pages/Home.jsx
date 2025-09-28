export default function Home({ onNavigate }) {
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>今日のゴミ</h2>
      <div style={styles.todayBox}>カン・ビン</div>

      <div style={styles.buttonRow}>
        <button style={styles.button} onClick={onNavigate}>カメラ</button>
        <button style={styles.button} onClick={onNavigate}>アルバム</button>
      </div>

      <button style={styles.footerButton}>自治体の選択・通知設定</button>
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
  title: {
    marginBottom: "10px",
  },
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
  button: {
    flex: 1,
    padding: "12px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    background: "#fff",
    cursor: "pointer",
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
  },
};