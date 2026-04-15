const API_KEY = 'ezouRzBhd2Zdw7QvTitOBxoEuBki8TikaACvCG2q';
const BASE_URL = 'https://api.nal.usda.gov/fdc/v1';

// USDA nutrient IDs for the columns we care about
const NUTRIENT_IDS = {
  calories:  1008,
  carbs:     1005,
  fat:       1004,
  protein:   1003,
  vitaminC:  1162,
  calcium:   1087,
  iron:      1089,
  vitaminD:  1114,
};

function getNutrientValue(foodNutrients, nutrientId) {
  const entry = foodNutrients.find(
    (n) => n.nutrientId === nutrientId || n.nutrient?.id === nutrientId
  );
  return entry ? (entry.value ?? entry.amount ?? 0) : 0;
}

export async function searchFood(query) {
  const url = `${BASE_URL}/foods/search?query=${encodeURIComponent(query)}&api_key=${API_KEY}&pageSize=5&dataType=Foundation,SR%20Legacy`;
  const response = await fetch(url);

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error('API rate limit reached (DEMO_KEY allows 30 requests/hour). Please try again later.');
    }
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json();

  if (!data.foods || data.foods.length === 0) {
    throw new Error(`No results found for "${query}". Try a different name.`);
  }

  return data.foods[0];
}

export function extractNutrients(food, portionGrams) {
  const nutrients = food.foodNutrients || [];
  const scale = portionGrams / 100;

  const vitaminC = getNutrientValue(nutrients, NUTRIENT_IDS.vitaminC);
  const calcium  = getNutrientValue(nutrients, NUTRIENT_IDS.calcium);
  const iron     = getNutrientValue(nutrients, NUTRIENT_IDS.iron);
  const vitaminD = getNutrientValue(nutrients, NUTRIENT_IDS.vitaminD);

  // Build a human-readable vitamins/minerals summary (only include non-zero)
  const mineralParts = [];
  if (vitaminC > 0) mineralParts.push(`Vit C ${(vitaminC * scale).toFixed(1)} mg`);
  if (calcium  > 0) mineralParts.push(`Ca ${(calcium  * scale).toFixed(1)} mg`);
  if (iron     > 0) mineralParts.push(`Fe ${(iron     * scale).toFixed(2)} mg`);
  if (vitaminD > 0) mineralParts.push(`Vit D ${(vitaminD * scale).toFixed(1)} µg`);

  return {
    id: `${Date.now()}-${Math.random()}`,
    name: food.description,
    portion: portionGrams,
    calories: parseFloat((getNutrientValue(nutrients, NUTRIENT_IDS.calories) * scale).toFixed(1)),
    carbs:    parseFloat((getNutrientValue(nutrients, NUTRIENT_IDS.carbs)    * scale).toFixed(1)),
    fat:      parseFloat((getNutrientValue(nutrients, NUTRIENT_IDS.fat)      * scale).toFixed(1)),
    protein:  parseFloat((getNutrientValue(nutrients, NUTRIENT_IDS.protein)  * scale).toFixed(1)),
    minerals: mineralParts.length > 0 ? mineralParts.join(' · ') : '—',
  };
}
