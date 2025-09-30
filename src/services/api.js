// 画像を FastAPI に送って判定結果を受け取る
export async function predict(file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("http://localhost:8000/predict", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("API request failed");
  }

  return await res.json();
}