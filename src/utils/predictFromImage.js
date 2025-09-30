import * as mobilenet from "@tensorflow-models/mobilenet";
import * as tf from "@tensorflow/tfjs";

let model = null;

export async function loadModel() {
  if (!model) {
    model = await mobilenet.load(); // MobileNet v2
  }
  return model;
}

function mapLabelToCategory(label) {
  const l = label.toLowerCase();

  // 形状推定
  if (l.includes("bottle")) return { material: "PET", shape: "bottle" };
  if (l.includes("can")) return { material: "metal", shape: "can" };
  if (l.includes("cup")) return { material: "plastic", shape: "cup" };
  if (l.includes("glass")) return { material: "glass", shape: "container" };
  if (l.includes("jar")) return { material: "glass", shape: "jar" };
  if (l.includes("paper") || l.includes("carton")) return { material: "paper", shape: "paper" };
  if (l.includes("plastic")) return { material: "plastic", shape: "container" };

  // よくある日用品の補助
  if (l.includes("plunger")) return { material: "plastic", shape: "tool" };
  if (l.includes("spotlight") || l.includes("lamp")) return { material: "metal", shape: "appliance" };
  if (l.includes("maraca")) return { material: "plastic", shape: "toy" };

  return { material: "other", shape: "other" };
}

export async function predictFromImage(file) {
  const model = await loadModel();

  const imageBitmap = await createImageBitmap(file);
  const predictions = await model.classify(imageBitmap);
  console.log("🔍 MobileNet predictions:", predictions);

  const top = predictions[0];
  const confidence = top?.probability ?? 0;

  // 低信頼なら other にフォールバック
  if (confidence < 0.2) {
    return {
      material: "other",
      shape: "other",
      dirty: false,
      confidence,
      label: top?.className || "unknown",
    };
  }

  const mapped = mapLabelToCategory(top.className);

  return {
    material: mapped.material,
    shape: mapped.shape,
    dirty: false,          // 画像だけで汚れ判定は難しいので仮固定
    confidence,
    label: top.className,  // デバッグ用に元ラベルも保持
  };
}