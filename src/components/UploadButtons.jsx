export default function UploadButtons({ label, capture, onChange }) {
  return (
    <label style={styles.button}>
      {label}
      <input
        type="file"
        accept="image/*"
        capture={capture}
        onChange={onChange}
        style={{ display: "none" }}
      />
    </label>
  );
}

const styles = {
  button: {
    flex: 1,
    padding: "12px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    background: "#fff",
    cursor: "pointer",
    textAlign: "center",
  },
};