import { useState } from 'react';
import { searchFood, extractNutrients } from '../services/nutritionApi.js';

export default function FoodForm({ onAdd }) {
  const [query, setQuery]     = useState('');
  const [grams, setGrams]     = useState(100);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');

    try {
      const food = await searchFood(query.trim());
      const entry = extractNutrients(food, Number(grams));
      onAdd(entry);
      setQuery('');
      setGrams(100);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="food-form" onSubmit={handleSubmit}>
      <div className="food-form__inputs">
        <input
          type="text"
          placeholder="Food name (e.g. apple, chicken breast)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={loading}
          className="food-form__text"
          required
        />
        <div className="food-form__portion">
          <input
            type="number"
            min="1"
            max="5000"
            value={grams}
            onChange={(e) => setGrams(e.target.value)}
            disabled={loading}
            className="food-form__grams"
            required
          />
          <span className="food-form__unit">g</span>
        </div>
        <button type="submit" disabled={loading} className="food-form__btn">
          {loading ? 'Searching…' : 'Add Food'}
        </button>
      </div>
      {error && <p className="food-form__error">{error}</p>}
    </form>
  );
}
