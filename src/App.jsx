import { useState } from "react";
import Home from "./pages/Home";
import ResultPage from "./pages/ResultPage";

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [aiResult, setAiResult] = useState(null);

  return (
    <div style={styles.wrapper}>
      <div style={styles.appContainer}>
        {currentPage === "home" && (
          <Home
            onResult={(result) => {
              setAiResult(result);
              setCurrentPage("result");
            }}
          />
        )}
        {currentPage === "result" && (
          <ResultPage
            aiResult={aiResult}
            onBack={() => setCurrentPage("home")}
          />
        )}
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "#f0f0f0",
  },
  appContainer: {
    width: "100%",
    maxWidth: "420px",
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