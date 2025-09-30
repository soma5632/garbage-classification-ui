import adachiRules from "../rules/adachi.json";

type Material = "PET" | "plastic" | "paper" | "metal" | "glass" | "other";
type Shape = "bottle" | "tray" | "box" | "bag" | "cup" | "can" | "other";

interface AIResult {
  material: Material;
  shape?: Shape;
  dirty?: boolean;
}

interface Rule {
  material?: Material | "other";
  shape?: Shape | "other";
  dirty?: boolean;
  category: string;
}

export function getCategory(result: AIResult): string {
  for (const rule of adachiRules as Rule[]) {
    const matchMaterial = !rule.material || rule.material === result.material;
    const matchShape = !rule.shape || rule.shape === result.shape;
    const matchDirty =
      rule.dirty === undefined || rule.dirty === result.dirty;

    if (matchMaterial && matchShape && matchDirty) {
      return rule.category;
    }
  }
  return "判定不能"; // どのルールにも当てはまらない場合
}