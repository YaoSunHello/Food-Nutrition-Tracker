import { useState } from 'react';
import FoodForm from './components/FoodForm.jsx';
import NutritionTable from './components/NutritionTable.jsx';

export default function App() {
  const [foodList, setFoodList] = useState([]);

  function addFood(entry) {
    setFoodList((prev) => [...prev, entry]);
  }

  function removeFood(id) {
    setFoodList((prev) => prev.filter((item) => item.id !== id));
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Food Nutrition Tracker</h1>
        <p className="app-subtitle">
          Enter a food and portion size to log its nutritional content.
        </p>
      </header>

      <main className="app-main">
        <FoodForm onAdd={addFood} />
        <NutritionTable foodList={foodList} onRemove={removeFood} />
      </main>

      <footer className="app-footer">
        Nutrition data provided by the{' '}
        <a
          href="https://fdc.nal.usda.gov/"
          target="_blank"
          rel="noopener noreferrer"
        >
          USDA FoodData Central
        </a>
      </footer>
    </div>
  );
}
