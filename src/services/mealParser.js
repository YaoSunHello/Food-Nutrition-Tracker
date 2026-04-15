/**
 * Parses a natural language meal description into [{food, grams}] pairs.
 *
 * Handles patterns like:
 *   "apple 150g"
 *   "150g of chicken breast"
 *   "150 grams chicken breast"
 *   "apple (150g)"
 *   "an apple and some rice 200g"
 *   "apple" → defaults to 100g
 */
export function parseMealText(text) {
  const normalized = text.trim();
  if (!normalized) return [];

  // Split on commas, "and", "with", "plus", newlines
  const segments = normalized.split(/,|\band\b|\bwith\b|\bplus\b|\n/i);

  const results = [];

  for (const segment of segments) {
    const s = segment.trim();
    if (!s) continue;

    let food = null;
    let grams = 100; // default portion

    // Pattern 1: "150g chicken breast" or "150 grams of chicken"
    const prefixMatch = s.match(/^(\d+(?:\.\d+)?)\s*g(?:rams?)?\s+(?:of\s+)?(.+)/i);
    if (prefixMatch) {
      grams = parseFloat(prefixMatch[1]);
      food = prefixMatch[2].trim();
    }

    // Pattern 2: "chicken breast 150g" or "chicken breast 150 grams"
    if (!food) {
      const suffixMatch = s.match(/^(.+?)\s+(\d+(?:\.\d+)?)\s*g(?:rams?)?$/i);
      if (suffixMatch) {
        food = suffixMatch[1].trim();
        grams = parseFloat(suffixMatch[2]);
      }
    }

    // Pattern 3: "chicken breast (150g)"
    if (!food) {
      const parenMatch = s.match(/^(.+?)\s*\((\d+(?:\.\d+)?)\s*g(?:rams?)?\)/i);
      if (parenMatch) {
        food = parenMatch[1].trim();
        grams = parseFloat(parenMatch[2]);
      }
    }

    // Pattern 4: just a food name, no portion → default 100g
    if (!food && s.length > 1) {
      food = s.replace(/^(a|an|some|the)\s+/i, '').trim();
    }

    if (food && food.length > 1) {
      results.push({ food, grams });
    }
  }

  return results;
}
