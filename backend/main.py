import json
import io
from pathlib import Path
from typing import Optional, Tuple

from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image

import torch
from ultralytics import YOLO
from transformers import CLIPProcessor, CLIPModel

# FastAPI
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite/React dev server
        "http://127.0.0.1:5173"   # 念のため両方許可
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Load rules
rules_path = Path(__file__).parent.parent / "src" / "rules" / "adachi.json"
with open(rules_path, encoding="utf-8") as f:
    RULES = json.load(f)

def classify_by_rules(material: str, dirty: bool, shape: Optional[str]) -> str:
    for r in RULES:
        if r.get("material") == material:
            if "dirty" in r and r["dirty"] != dirty:
                continue
            if "shape" in r and shape and r["shape"] != shape:
                continue
            return r["category"]
    return "不明"

# Load YOLOv8 for detection (shape)
yolo = YOLO("yolov8n.pt")  # small model for speed
# COCO class index for bottle (typically 39). We'll map by name to be safe.
COCO_SHAPE_MAP = {"bottle": "bottle", "cup": None, "wine glass": "bottle", "can": "can"}  # can is not native; we'll infer via box aspect later

# Load CLIP for material zero-shot
clip_model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
clip_processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
CANDIDATE_MATERIALS = [
    "PET", "plastic", "paper", "metal", "glass", "other"
]

def zero_shot_material(img: Image.Image):
    prompts = [
        "a photo of a PET bottle",
        "a photo of plastic packaging",
        "a photo of paper material",
        "a photo of a metal can",
        "a photo of a glass bottle",
        "a photo of other material",
    ]
    inputs = clip_processor(
        text=prompts,
        images=img,
        return_tensors="pt",
        padding=True,       # ★追加
        truncation=True     # ★追加
    )
    with torch.no_grad():
        logits_per_image = clip_model(**inputs).logits_per_image
        probs = logits_per_image.softmax(dim=-1).squeeze(0)
        conf, idx = torch.max(probs, dim=0)
    mapped = ["PET", "plastic", "paper", "metal", "glass", "other"][idx.item()]
    return mapped, float(conf.item()), prompts[idx.item()]

def estimate_dirty(img: Image.Image) -> bool:
    # Simple heuristic placeholder: very dark average → potentially dirty
    # You can replace with a trained classifier later.
    import numpy as np
    arr = np.array(img.convert("RGB"))
    brightness = arr.mean()
    return brightness < 60  # conservative; tune later

def detect_and_crop(image: Image.Image) -> Tuple[Optional[Image.Image], Optional[str], float]:
    # Run YOLO detection
    results = yolo.predict(image, verbose=False)
    shape_label = None
    shape_conf = 0.0
    crop_img = None

    if not results:
        return None, None, 0.0

    boxes = results[0].boxes
    names = results[0].names

    # Find best "bottle" or "wine glass" or anything likely a container
    best = None
    for b in boxes:
        cls_idx = int(b.cls.item())
        name = names.get(cls_idx, "")
        conf = float(b.conf.item())
        if name in ["bottle", "wine glass"]:
            if best is None or conf > shape_conf:
                best = b
                shape_label = "bottle"
                shape_conf = conf
        # Optional: try to detect cans via aspect ratio heuristic
        elif name == "cup":
            # If short + wide rectangle, treat as can
            x1, y1, x2, y2 = map(float, b.xyxy.squeeze(0).tolist())
            w, h = x2 - x1, y2 - y1
            if h < w * 1.2:  # short and wide
                if best is None or conf > shape_conf:
                    best = b
                    shape_label = "can"
                    shape_conf = conf

    if best is not None:
        x1, y1, x2, y2 = map(int, best.xyxy.squeeze(0).tolist())
        crop_img = image.crop((x1, y1, x2, y2))
        return crop_img, shape_label, shape_conf

    return None, None, 0.0

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    contents = await file.read()
    image = Image.open(io.BytesIO(contents)).convert("RGB")
    width, height = image.size

    # 1) Detect shape and crop
    crop, shape, shape_conf = detect_and_crop(image)

    # 2) Material via CLIP on crop if available, else full image
    material_img = crop if crop is not None else image
    material, mat_conf, label_prompt = zero_shot_material(material_img)

    # 3) Dirty heuristic (placeholder)
    dirty = bool(estimate_dirty(material_img))

    # 4) Confidence gating
    # If material confidence is low, demote to other to avoid wrong category
    if mat_conf < 0.45:
        material = "other"

    # 5) Final category via rules
    category = classify_by_rules(material, dirty, shape)

    # Compose confidence: combine shape/material confidence with weights
    combined_confidence = round(0.6 * mat_conf + 0.4 * (shape_conf if shape_conf else 0.3), 3)

    result = {
        "material": material,
        "shape": shape,
        "dirty": dirty,
        "confidence": combined_confidence,
        "label": label_prompt,  # CLIP prompt that won
        "image_size": f"{width}x{height}",
        "category": category,
    }

    return result