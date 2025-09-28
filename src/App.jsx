import { useState } from "react";
import Home from "./pages/Home";
import ResultPage from "./pages/ResultPage";

function App() {
  const [currentPage, setCurrentPage] = useState("home");

  return (
    <div style={styles.wrapper}>
      <div style={styles.appContainer}>
        {currentPage === "home" && (
          <Home onNavigate={() => setCurrentPage("result")} />
        )}
        {currentPage === "result" && (
          <ResultPage onBack={() => setCurrentPage("home")} />
        )}
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    justifyContent: "center", // 横方向中央
    alignItems: "center",     // 縦方向中央
    minHeight: "100vh",       // 全画面をカバー
    background: "#f0f0f0",    // 外側の背景
  },
  appContainer: {
    width: "100%",
    maxWidth: "420px",        // スマホ幅を意識
    minHeight: "90vh",
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: "20px",
  },
};

export default App;